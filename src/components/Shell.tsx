import { Link, Outlet, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'

export default function Shell(){
  const [addr,setAddr] = useState(localStorage.getItem('hapn.addr') || 'Davao City')
  const [edit,setEdit] = useState(false)
  const loc = useLocation()
  useEffect(()=>{ setEdit(false) },[loc.pathname])
  const role = localStorage.getItem('hapn.role') || 'consumer'
  const user = localStorage.getItem('hapn.currentUser') || sessionStorage.getItem('hapn.currentUser') || ''
  return (
    <div>
      <header style={{position:'sticky', top:0, zIndex:10, background:'var(--color-bg)', borderBottom:'1px solid #eee'}}>
        <div className="container" style={{display:'flex', alignItems:'center', justifyContent:'space-between', gap:12, paddingTop:12, paddingBottom:12}}>
          <Link to="/home" className="logo" style={{fontFamily:'Poppins, sans-serif', fontWeight:800}}>hap’n!</Link>
          <div style={{flex:1, maxWidth:420, display:'flex', gap:8, alignItems:'center', justifyContent:'center'}}>
            {!edit ? (
              <button className="btn secondary" onClick={()=> setEdit(true)}>Deliver to: {addr}</button>
            ) : (
              <div style={{display:'flex', gap:8, width:'100%'}}>
                <input className="input" value={addr} onChange={e=> setAddr(e.target.value)} />
                <button className="btn" onClick={()=> { localStorage.setItem('hapn.addr', addr); setEdit(false) }}>save</button>
              </div>
            )}
          </div>
          {user ? (
            <nav style={{display:'flex', gap:12}}>
              <span style={{fontSize:12,color:'var(--color-dark-crimson)',alignSelf:'center'}}>{role}</span>
              <Link to="/calendar">📅</Link>
              <Link to="/profile">👤</Link>
              <Link to="/cart">🛒</Link>
            </nav>
          ) : (
            <div style={{display:'flex', gap:8}}>
              <Link to="/login" className="btn secondary">log in</Link>
              <Link to="/register" className="btn">create account</Link>
            </div>
          )}
        </div>
      </header>
      <main>
        <Outlet />
      </main>
      <footer style={{padding:'16px 0', marginTop:24, background:'#fff'}}>
        <div className="container" style={{display:'flex', justifyContent:'space-between', fontSize:12, color:'#666'}}>
          <div>© {new Date().getFullYear()} hap’n</div>
          <div style={{display:'flex', gap:12}}>
            <a href="#">About</a>
            <a href="#">Help</a>
            <a href="#">Privacy</a>
          </div>
        </div>
      </footer>
      <div style={{position:'fixed', bottom:0, left:0, right:0, display:'flex', justifyContent:'space-around', padding:'10px 0', background:'rgba(255,255,255,0.95)', borderTop:'1px solid #eee'}}>
        <Link to="/">🏠</Link>
        <Link to="/home">🛍️</Link>
        <Link to="/calendar">📅</Link>
        <Link to="/cart">🛒</Link>
        <Link to="/profile">👤</Link>
      </div>
    </div>
  )
}
