import { useEffect, useState } from 'react'
import { Merchants, Products } from '../data/db'
import type { Product } from '../data/db'
import { useToast } from '../components/Toast'
import { useNavigate } from 'react-router-dom'

export default function MerchantProducts(){
  const nav = useNavigate()
  const email = localStorage.getItem('hapn.currentUser') ?? 'guest'
  const [merchantId,setMerchantId] = useState<string | null>(null)
  const [items,setItems] = useState<Product[]>([])
  const [title,setTitle] = useState('')
  const [price,setPrice] = useState<number>(0)
  const [category,setCategory] = useState('Food & Beverage')
  const [image,setImage] = useState<string | undefined>(undefined)
  const { push } = useToast()
  useEffect(()=>{ (async()=>{
    const m = await Merchants.ensureForEmail(email); setMerchantId(m.id)
    setItems(await Products.byMerchant(m.id))
  })() },[email])
  const onFile = (f: File)=> {
    const r = new FileReader(); r.onload = ()=> setImage(r.result as string); r.readAsDataURL(f)
  }
  const create = async (e: React.FormEvent)=> {
    e.preventDefault()
    if(!merchantId) return
    await Products.create({ merchantId, title, price, category, image })
    setItems(await Products.byMerchant(merchantId))
    setTitle(''); setPrice(0); setCategory('Food & Beverage'); setImage(undefined)
    push('Product created')
  }
  const remove = async (id: string)=> {
    await Products.remove(id)
    if(merchantId) setItems(await Products.byMerchant(merchantId))
    push('Product removed')
  }
  return (
    <div className="container">
      <button className="btn secondary" onClick={()=> nav(-1)}>← back</button>
      <h2>My Products</h2>
      <div className="card" style={{marginBottom:16}}>
        <form className="stack" onSubmit={create}>
          <div style={{display:'grid', gridTemplateColumns:'1fr 140px', gap:12}}>
            <div className="stack">
              <input className="input" placeholder="title" value={title} onChange={e=> setTitle(e.target.value)} required />
              <input className="input" type="number" placeholder="price" value={price} onChange={e=> setPrice(parseFloat(e.target.value))} required />
              <select className="input" value={category} onChange={e=> setCategory(e.target.value)}>
                <option>Food & Beverage</option>
                <option>Clothing & Apparel</option>
                <option>Stationery</option>
              </select>
              <label className="btn secondary" style={{textAlign:'center'}}>
                upload image
                <input type="file" accept="image/*" style={{display:'none'}} onChange={e=> e.target.files && onFile(e.target.files[0])}/>
              </label>
            </div>
            <div style={{border:'1px dashed #ccc', borderRadius:8, minHeight:120, display:'flex', alignItems:'center', justifyContent:'center'}}>
              {image ? <img src={image} alt="" style={{maxWidth:'100%', maxHeight:120, borderRadius:8}}/> : <div style={{color:'#888'}}>preview</div>}
            </div>
          </div>
          <button className="btn" type="submit">add product</button>
        </form>
      </div>
      <div className="grid">
        {items.map(p=>(
          <div className="card" key={p.id}>
            {p.image && <img src={p.image} alt="" style={{width:'100%', height:120, objectFit:'cover', borderRadius:8, marginBottom:8}}/>}
            <div style={{fontWeight:600}}>{p.title}</div>
            <div>₱{p.price}</div>
            <div style={{fontSize:12, color:'#666'}}>{p.category}</div>
            <button className="btn secondary" onClick={()=> remove(p.id)} style={{marginTop:8}}>delete</button>
          </div>
        ))}
      </div>
    </div>
  )
}

