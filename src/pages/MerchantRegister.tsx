import { useState } from 'react'

export default function MerchantRegister(){
  const [name,setName] = useState('')
  const [owner,setOwner] = useState('')
  const [product,setProduct] = useState('')
  const [desc,setDesc] = useState('')
  const onSubmit = (e: React.FormEvent)=> {
    e.preventDefault()
    alert('Merchant application submitted (simulated)')
  }
  return (
    <div className="container">
      <div className="card" style={{maxWidth:520, margin:'40px auto'}}>
        <h2 style={{color:'var(--color-red)', textAlign:'center'}}>Business Registration</h2>
        <form className="stack" onSubmit={onSubmit}>
          <input className="input" placeholder="business name" value={name} onChange={e=>setName(e.target.value)} />
          <input className="input" placeholder="owner’s name" value={owner} onChange={e=>setOwner(e.target.value)} />
          <input className="input" placeholder="product" value={product} onChange={e=>setProduct(e.target.value)} />
          <textarea className="input" placeholder="brief description of the business" rows={3} value={desc} onChange={e=>setDesc(e.target.value)} />
          <button className="btn" type="submit">register</button>
        </form>
      </div>
    </div>
  )
}

