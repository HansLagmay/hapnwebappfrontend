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
      {me && <RoleSection me={me} onEnable={async(r)=> { await Users.addRole(user,r); const u = await Users.findByEmail(user); setMe(u ?? null) }} />}
      <div style={{margin:'12px 0'}}>
        <button className="btn secondary" onClick={()=> { localStorage.removeItem('hapn.currentUser'); sessionStorage.removeItem('hapn.currentUser'); location.href='/' }}>log out</button>
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
function RoleSection({me, onEnable}:{me: User, onEnable: (r:any)=>void}){
  const roles = new Set(me.roles ?? [me.role])
  return (
    <div className="card" style={{marginTop:12}}>
      <div style={{marginBottom:8,fontWeight:700}}>My Portals</div>
      <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
        {roles.has('merchant') && <RL to="/merchant/dashboard" className="btn">Access Merchant Portal</RL>}
        {roles.has('rider') && <RL to="/rider/dashboard" className="btn">Access Rider Portal</RL>}
        
        {!roles.has('merchant') && <button className="btn secondary" onClick={()=> onEnable('merchant')}>Enable Merchant Account</button>}
        {!roles.has('rider') && <button className="btn secondary" onClick={()=> onEnable('rider')}>Enable Rider Account</button>}
      </div>
    </div>
  )
}
