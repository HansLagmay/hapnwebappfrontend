import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Users } from '../data/db'

export default function Login(){
  const nav = useNavigate()
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [err,setErr] = useState('')
  const onSubmit = async (e: React.FormEvent)=>{ 
    e.preventDefault()
    const u = await Users.findByEmail(email)
    if(!u || u.password !== password){ setErr('invalid credentials'); return }
    localStorage.setItem('hapn.currentUser', email)
    const role = u.activeRole ?? u.role
    localStorage.setItem('hapn.role', role)
    nav('/home') 
  }
  return (
    <div className="container">
      <div className="card" style={{maxWidth:420, margin:'40px auto'}}>
        <h2 style={{color:'var(--color-red)', textAlign:'center'}}>Log In</h2>
        <form className="stack" onSubmit={onSubmit}>
          <input className="input" placeholder="email address" value={email} onChange={e=>setEmail(e.target.value)} />
          <input className="input" type="password" placeholder="password" value={password} onChange={e=>setPassword(e.target.value)} />
          <button className="btn" type="submit">log in</button>
        </form>
        {err && <div style={{color:'crimson', marginTop:8}}>{err}</div>}
        <div style={{marginTop:12, textAlign:'right'}}>
          <Link to="/login/forgot">forgot password</Link>
        </div>
      </div>
    </div>
  )
}
