import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Users } from '../data/db'

export default function Login(){
  const nav = useNavigate()
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [showPw,setShowPw] = useState(false)
  const [remember,setRemember] = useState(true)
  const [err,setErr] = useState('')
  const onSubmit = async (e: React.FormEvent)=>{ 
    e.preventDefault()
    if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)){ setErr('invalid email'); return }
    if(password.length < 6){ setErr('password too short'); return }
    const u = await Users.findByEmail(email)
    if(!u || u.password !== password){ setErr('invalid credentials'); return }
    if(remember){
      localStorage.setItem('hapn.currentUser', email)
    }else{
      sessionStorage.setItem('hapn.currentUser', email)
      localStorage.removeItem('hapn.currentUser')
    }
    const role = u.activeRole ?? u.role
    localStorage.setItem('hapn.role', role)
    nav('/home') 
  }
  return (
    <div className="container">
      <div className="card" style={{maxWidth:420, margin:'40px auto'}}>
        <button className="btn secondary" onClick={()=> nav(-1)}>← back</button>
        <h2 style={{color:'var(--color-red)', textAlign:'center'}}>Log In</h2>
        <form className="stack" onSubmit={onSubmit}>
          <input className="input" placeholder="email address (e.g., customer@hapn.local)" value={email} onChange={e=>setEmail(e.target.value)} />
          <div style={{display:'flex', gap:8}}>
            <input className="input" style={{flex:1}} type={showPw?'text':'password'} placeholder="password (e.g., 123456)" value={password} onChange={e=>setPassword(e.target.value)} />
            <button type="button" className="btn secondary" onClick={()=> setShowPw(!showPw)}>{showPw? 'hide' : 'show'}</button>
          </div>
          <label style={{display:'flex',alignItems:'center',gap:8}}><input type="checkbox" checked={remember} onChange={e=> setRemember(e.target.checked)} /> remember me</label>
          <button className="btn" type="submit">log in</button>
        </form>
        {err && <div style={{color:'crimson', marginTop:8}}>{err}</div>}
        <div style={{marginTop:12, display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
            <button className="btn secondary" onClick={()=> { setEmail('admin@hapn.local'); setPassword('admin123') }}>admin</button>
            <button className="btn secondary" onClick={()=> { setEmail('customer@hapn.local'); setPassword('123456') }}>customer</button>
            <button className="btn secondary" onClick={()=> { setEmail('merchant@hapn.local'); setPassword('123456') }}>merchant</button>
            <button className="btn secondary" onClick={()=> { setEmail('rider@hapn.local'); setPassword('123456') }}>rider</button>
          </div>
          <Link to="/login/forgot">forgot password</Link>
        </div>
      </div>
    </div>
  )
}
