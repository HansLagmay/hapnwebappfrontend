import { useEffect, useMemo, useState } from 'react'
import { Products, seedIfEmpty, Events } from '../data/db'
import type { Product } from '../data/db'
import { Link } from 'react-router-dom'

export default function Home(){
  const [products,setProducts] = useState<Product[]>([])
  const [events,setEvents] = useState<any[]>([])
  const role = (localStorage.getItem('hapn.role') ?? 'consumer') as string
  const [query,setQuery] = useState('')
  useEffect(()=>{ (async()=>{
    await seedIfEmpty()
    setProducts(await Products.list())
    setEvents(await Events.list())
  })() },[])
  const fProducts = useMemo(()=> products.filter(p=> p.title.toLowerCase().includes(query.toLowerCase())),[products,query])
  return (
    <div className="container">
      <header style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
        <div className="logo" style={{display:'flex', alignItems:'center', gap:8}}>
          <img src="/vite.svg" alt="" style={{width:24,height:24,opacity:0}}/>
          <span style={{fontFamily:'Poppins, sans-serif', fontWeight:700, color:'var(--color-red)'}}>hap’n!</span>
        </div>
        <div style={{display:'flex',gap:12, alignItems:'center'}}>
          <span style={{fontSize:12, color:'var(--color-dark-crimson)'}}>{role}</span>
          <Link to="/profile">👤</Link>
          <Link to="/cart">🛒</Link>
        </div>
      </header>
      <div className="card" style={{marginBottom:12}}>
        <input className="input" placeholder="Search products" value={query} onChange={e=> setQuery(e.target.value)} />
      </div>
      <section className="card" style={{marginBottom:16}}>
        <h3 style={{marginTop:0}}>Upcoming Events</h3>
        <div className="grid">
          {events.map(e=>(<div className="card" key={e.id}>
            <strong>{e.title}</strong><div>{e.startsAt} – {e.endsAt}</div>
            <Link to="/calendar" className="btn" style={{marginTop:8}}>more details</Link>
          </div>))}
        </div>
      </section>
      <h3>Food and Beverage</h3>
      <div className="grid">
        {fProducts.filter(p=>p.category==='Food & Beverage').map(p=>(
          <div key={p.id} className="card">
            <div style={{height:80, background:'linear-gradient(180deg,#fff,#fee)', borderRadius:8, marginBottom:8}} />
            <div style={{fontWeight:600}}>{p.title}</div>
            <div>₱{p.price}</div>
            <button className="btn" onClick={()=> addToCart(p.id)}>add to cart</button>
          </div>
        ))}
      </div>
      <h3>Clothing and Apparel</h3>
      <div className="grid">
        {fProducts.filter(p=>p.category==='Clothing & Apparel').map(p=>(
          <div key={p.id} className="card">
            <div style={{height:80, background:'linear-gradient(180deg,#fff,#fee)', borderRadius:8, marginBottom:8}} />
            <div style={{fontWeight:600}}>{p.title}</div>
            <div>₱{p.price}</div>
            <button className="btn" onClick={()=> addToCart(p.id)}>add to cart</button>
          </div>
        ))}
      </div>
      <h3>Stationery</h3>
      <div className="grid">
        {fProducts.filter(p=>p.category==='Stationery').map(p=>(
          <div key={p.id} className="card">
            <div style={{height:80, background:'linear-gradient(180deg,#fff,#fee)', borderRadius:8, marginBottom:8}} />
            <div style={{fontWeight:600}}>{p.title}</div>
            <div>₱{p.price}</div>
            <button className="btn" onClick={()=> addToCart(p.id)}>add to cart</button>
          </div>
        ))}
      </div>
    </div>
  )
}

async function addToCart(pid: string){
  const email = localStorage.getItem('hapn.currentUser') ?? 'guest'
  // for simplicity, use email as user key; seed creates an admin if none registered
  // create a stable pseudo user id based on email
  const userId = email
  const { Cart } = await import('../data/db')
  await Cart.add(userId,pid,1)
  alert('Added to cart')
}
