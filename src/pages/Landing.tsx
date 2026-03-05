import { useEffect, useMemo, useState } from 'react'
import { seedIfEmpty, Products } from '../data/db'
import type { Product } from '../data/db'
import { Link, useNavigate } from 'react-router-dom'

export default function Landing(){
  const nav = useNavigate()
  const [products,setProducts] = useState<Product[]>([])
  const [events,setEvents] = useState<any[]>([])
  const [query,setQuery] = useState('')
  useEffect(()=>{ (async()=>{
    await seedIfEmpty()
    setProducts(await Products.list())
    setEvents(await (await import('../data/db')).Events.list())
  })() },[])
  const cats = useMemo(()=> Array.from(new Set(products.map(p=> p.category))), [products])
  const f = useMemo(()=> products.filter(p=> p.title.toLowerCase().includes(query.toLowerCase())),[products, query])
  const loading = products.length===0 && events.length===0
  return (
    <div className="container">
      <section className="hero card" style={{marginTop:12}}>
        <div>
          <h1 style={{margin:'8px 0', color:'var(--color-red)'}}>go on, make it hap’n!</h1>
          <div style={{margin:'8px 0 16px 0'}}>discover local goods, great eats, and services around you — all in one place.</div>
          <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
            <button className="btn" onClick={()=> nav('/home')}>order now</button>
            <Link to="/merchant/register" className="btn secondary">start selling</Link>
            <Link to="/rider" className="btn secondary">ride with hap’n</Link>
          </div>
        </div>
        <div className="placeholder-lg" />
      </section>
      <div className="banner" style={{marginTop:12}}>
        free delivery on your first order in davao city. terms apply.
      </div>
      <div className="card" style={{marginTop:12}}>
        <input className="input" placeholder="Search products and services" value={query} onChange={e=> setQuery(e.target.value)} />
      </div>
      <section style={{marginTop:12}}>
        <h3 style={{marginTop:0}}>Browse by category</h3>
        <div style={{display:'flex', gap:8, overflowX:'auto', paddingBottom:8}}>
          {cats.map(c=> <a key={c} href={`#cat-${slug(c)}`} className="pill">{icon(c)} {c}</a>)}
        </div>
      </section>
      <section className="card" style={{marginTop:12}}>
        <h3 style={{marginTop:0}}>Happenings near you</h3>
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:12}}>
          {loading ? Array.from({length:3}).map((_,i)=><div key={i} className="skeleton" style={{height:96}} />) :
            events.map(e=>(
            <div key={e.id} className="card">
              <div className="card-title">{e.title}</div>
              <div className="card-sub">{e.startsAt} – {e.endsAt}</div>
            </div>
          ))}
        </div>
      </section>
      {cats.map(c=> (
        <section key={c} id={`cat-${slug(c)}`} style={{marginTop:12}}>
          <h3 style={{marginTop:0}}>{c}</h3>
          <div className="grid">
            {loading ? Array.from({length:6}).map((_,i)=><div key={i} className="skeleton" style={{height:140}}/>) :
              f.filter(p=> p.category===c).slice(0,8).map(p=>(
                <div className="card" key={p.id}>
                  <div className="placeholder" style={{marginBottom:8}} />
                  <div className="card-title">{p.title}</div>
                  <div className="card-sub">₱{p.price}</div>
                  <button className="btn" onClick={()=> nav('/home')}>view</button>
                </div>
              ))
            }
            {!loading && f.filter(p=> p.category===c).length===0 && <div className="card">No items in this category</div>}
          </div>
        </section>
      ))}
      <section className="card" style={{marginTop:16}}>
        <h3 style={{marginTop:0}}>Why hap’n?</h3>
        - hyperlocal marketplace for Davao MSMEs<br/>
        - easy same‑day checkout with transparent delivery fees<br/>
        - one account, multiple roles: customer, merchant, or rider<br/>
      </section>
    </div>
  )
}

function slug(s: string){ return s.toLowerCase().replace(/\s+/g,'-') }

function icon(c:string){
  const k = c.toLowerCase()
  if(k.includes('food')) return '🍜'
  if(k.includes('clothing')) return '👕'
  if(k.includes('stationery')) return '✏️'
  if(k.includes('service')) return '🧰'
  return '🛍️'
}
