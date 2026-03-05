import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Users } from '../data/db'

export default function LoginModal({open,onClose}:{open:boolean,onClose:()=>void}){
  const nav = useNavigate()
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [err,setErr] = useState('')
  if(!open) return null
  const doLogin = async (e: React.FormEvent)=>{
    e.preventDefault()
    const u = await Users.findByEmail(email)
    if(!u || u.password!==password){ setErr('invalid credentials'); return }
    localStorage.setItem('hapn.currentUser', email)
    localStorage.setItem('hapn.role', u.activeRole ?? u.role)
    onClose(); nav('/home')
  }
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e=> e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:16}}>
          <div className="card" style={{textAlign:'center'}}>
            <div className="placeholder-lg" />
            <div style={{marginTop:8}}><strong>Download the app</strong> for exclusive deals</div>
            <div style={{display:'flex', gap:8, justifyContent:'center', marginTop:8}}>
              <span className="pill">App Store</span>
              <span className="pill">Play Store</span>
            </div>
          </div>
          <div>
            <h2 style={{marginTop:0, color:'var(--color-red)'}}>Welcome!</h2>
            <div className="stack">
              <button className="btn secondary" disabled>Continue with Google</button>
              <button className="btn secondary" disabled>Continue with Apple</button>
              <div style={{display:'flex',alignItems:'center',gap:8, color:'#777'}}><span style={{flex:1,height:1,background:'#eee'}}/>or<span style={{flex:1,height:1,background:'#eee'}}/></div>
              <form className="stack" onSubmit={doLogin}>
                <input className="input" placeholder="email address (e.g., customer@hapn.local)" value={email} onChange={e=>setEmail(e.target.value)} />
                <input className="input" type="password" placeholder="password (e.g., 123456)" value={password} onChange={e=>setPassword(e.target.value)} />
                {err && <div style={{color:'crimson'}}>{err}</div>}
                <button className="btn" type="submit">log in</button>
              </form>
              <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
                <button className="btn secondary" onClick={()=> { setEmail('customer@hapn.local'); setPassword('123456') }}>customer</button>
                <button className="btn secondary" onClick={()=> { setEmail('merchant@hapn.local'); setPassword('123456') }}>merchant</button>
                <button className="btn secondary" onClick={()=> { setEmail('rider@hapn.local'); setPassword('123456') }}>rider</button>
                <button className="btn secondary" onClick={()=> { setEmail('admin@hapn.local'); setPassword('admin123') }}>admin</button>
              </div>
              <div style={{textAlign:'right'}}>
                <Link to="/register" onClick={onClose}>create account</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

