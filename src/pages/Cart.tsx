import { useEffect, useState } from 'react'
import { Cart as CartDB, Products, Orders } from '../data/db'
import type { CartItem, Product } from '../data/db'
import { applyVoucher, deliveryFee } from '../lib/pricing'

export default function Cart(){
  const [items,setItems] = useState<CartItem[]>([])
  const [map,setMap] = useState<Record<string,Product>>({})
  const [code,setCode] = useState('')
  const [distance,setDistance] = useState(4)
  const uid = localStorage.getItem('hapn.currentUser') ?? 'guest'
  useEffect(()=>{ (async()=>{
    const its = await CartDB.byUser(uid)
    setItems(its)
    const all = await Products.list()
    setMap(Object.fromEntries(all.map(p=>[p.id,p])))
  })() },[uid])
  const subtotal = items.reduce((s,i)=> s + (map[i.productId]?.price ?? 0)*i.qty, 0)
  const voucher = applyVoucher(subtotal, code)
  const dfee = deliveryFee(distance)
  const total = Math.max(0, subtotal - voucher.discount) + dfee
  return (
    <div className="container">
      <h2>Cart</h2>
      <div className="stack">
        {items.map(i=>(
          <div className="card" key={i.id} style={{display:'flex',justifyContent:'space-between'}}>
            <div>{map[i.productId]?.title} × {i.qty}</div>
            <div>₱{(map[i.productId]?.price ?? 0)*i.qty}</div>
          </div>
        ))}
      </div>
      <div className="card" style={{marginTop:12}}>
        <div className="stack">
          <div>Subtotal: ₱{subtotal}</div>
          <div style={{display:'flex', gap:8, alignItems:'center'}}>
            <input className="input" placeholder="Voucher code" value={code} onChange={e=>setCode(e.target.value)} />
            <span>{voucher.discount ? `-₱${voucher.discount}` : ''}</span>
          </div>
          <label>Distance (km after 6 adds ₱/km)</label>
          <input type="range" min={1} max={15} value={distance} onChange={e=>setDistance(parseInt(e.target.value))} />
          <div>Delivery fee: ₱{dfee}</div>
          <div style={{fontWeight:700}}>Total: ₱{total}</div>
        </div>
      </div>
      <button className="btn" style={{marginTop:8}} onClick={async()=>{
        if(items.length===0){ alert('Cart is empty'); return }
        const orderItems = items.map(i=>({ productId: i.productId, qty: i.qty, price: map[i.productId]?.price ?? 0 }))
        await Orders.create({ userId: uid, items: orderItems, subtotal, deliveryFee: dfee, discount: voucher.discount, total })
        await CartDB.clear(uid)
        setItems([])
        alert('Order placed! Tracking will update in your profile.')
      }}>Check Out ({items.length})</button>
    </div>
  )
}
