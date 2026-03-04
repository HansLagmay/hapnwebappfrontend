import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Orders, Users } from '../data/db'
import type { Order, User } from '../data/db'

export default function Profile(){
  const user = localStorage.getItem('hapn.currentUser') ?? 'guest'
  const [orders,setOrders] = useState<Order[]>([])
  const [me,setMe] = useState<User | null>(null)
  useEffect(()=>{ (async()=> {
    const list = await Orders.byUser(user)
    setOrders(list.sort((a,b)=> b.createdAt-a.createdAt))
    list.forEach(o=>{
      if(o.status==='placed'){
        setTimeout(async()=> { await Orders.updateStatus(o.id,'preparing'); setOrders(await Orders.byUser(user)) }, 1500)
        setTimeout(async()=> { await Orders.updateStatus(o.id,'enroute'); setOrders(await Orders.byUser(user)) }, 3500)
        setTimeout(async()=> { await Orders.updateStatus(o.id,'delivered'); setOrders(await Orders.byUser(user)) }, 6000)
      }
    })
    const u = await Users.findByEmail(user); setMe(u ?? null)
  })() },[user])
  return (
    <div className="container">
      <button className="btn secondary" onClick={()=> history.back()}>← back</button>
      <div className="card" style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div>
          <div style={{fontWeight:700}}>{user}</div>
          <div>user since 2026</div>
        </div>
        <Link to="/merchant/register" className="btn">start your business</Link>
      </div>
      {me && <RoleSection me={me} onSwitch={async(r)=> { await Users.setActiveRole(user,r); localStorage.setItem('hapn.role', r); location.reload() }} onEnable={async(r)=> { await Users.addRole(user,r); const u = await Users.findByEmail(user); setMe(u ?? null) }} />}
      <div style={{margin:'12px 0'}}>
        <button className="btn secondary" onClick={()=> { localStorage.removeItem('hapn.currentUser'); sessionStorage.removeItem('hapn.currentUser'); location.href='/welcome' }}>log out</button>
      </div>
      <h3 style={{marginTop:16}}>Your Orders</h3>
      <div className="stack">
        {orders.map(o=>(
          <div className="card" key={o.id} style={{display:'flex',justifyContent:'space-between'}}>
            <div>
              <div>#{o.id.slice(0,8)}</div>
              <div>{o.items.length} items • ₱{o.total}</div>
            </div>
            <div style={{color:'var(--color-red)'}}>{o.status}</div>
          </div>
        ))}
        {orders.length===0 && <div className="card">No orders yet</div>}
      </div>
    </div>
  )
}

import { Link as RL } from 'react-router-dom'
function RoleSection({me, onSwitch, onEnable}:{me: User, onSwitch: (r:any)=>void, onEnable: (r:any)=>void}){
  const roles = new Set(me.roles ?? [me.role])
  const active = me.activeRole ?? me.role
  return (
    <div className="card" style={{marginTop:12}}>
      <div style={{marginBottom:8,fontWeight:700}}>Current mode: {active}</div>
      <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
        {Array.from(roles).map(r=> <button key={r} className="btn secondary" onClick={()=> onSwitch(r)}>{r}</button>)}
        {!roles.has('merchant') && <button className="btn" onClick={()=> onEnable('merchant')}>enable merchant</button>}
        {!roles.has('rider') && <button className="btn" onClick={()=> onEnable('rider')}>enable rider</button>}
        {roles.has('merchant') && <RL to="/merchant/products" className="btn">manage products</RL>}
      </div>
    </div>
  )
}
