import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users } from '../data/db'
import type { UserRole } from '../data/db'

export default function Register(){
  const nav = useNavigate()
  const [email,setEmail] = useState('')
  const [phone,setPhone] = useState('')
  const [password,setPassword] = useState('')
  const [role,setRole] = useState<UserRole>('consumer')
  const [err,setErr] = useState('')
  const onSubmit = async (e: React.FormEvent)=> {
    e.preventDefault()
    try{
      const exists = await Users.findByEmail(email)
      if(exists){ setErr('email already registered'); return }
      await Users.create({ email, phone, password, role, roles: [role], activeRole: role })
      localStorage.setItem('hapn.currentUser', email)
      localStorage.setItem('hapn.role', role)
      nav('/home')
    }catch(ex:any){ setErr(ex?.message ?? 'registration failed') }
  }
  return (
    <div className="container">
      <div className="card" style={{maxWidth:420, margin:'40px auto'}}>
        <button className="btn secondary" onClick={()=> nav(-1)}>← back</button>
        <h2 style={{color:'var(--color-red)', textAlign:'center'}}>Register</h2>
        <form className="stack" onSubmit={onSubmit}>
          <input className="input" placeholder="email address (e.g., you@example.com)" value={email} onChange={e=>setEmail(e.target.value)} required />
          <input className="input" placeholder="phone number (optional)" value={phone} onChange={e=>setPhone(e.target.value)} />
          <input className="input" type="password" placeholder="password (min 6 chars)" value={password} onChange={e=>setPassword(e.target.value)} required />
          <div className="card" style={{display:'flex', gap:12, alignItems:'center', justifyContent:'space-between'}}>
            <label style={{display:'flex',alignItems:'center',gap:6}}>
              <input type="radio" name="role" checked={role==='consumer'} onChange={()=> setRole('consumer')} /> consumer
            </label>
            <label style={{display:'flex',alignItems:'center',gap:6}}>
              <input type="radio" name="role" checked={role==='merchant'} onChange={()=> setRole('merchant')} /> merchant
            </label>
            <label style={{display:'flex',alignItems:'center',gap:6}}>
              <input type="radio" name="role" checked={role==='rider'} onChange={()=> setRole('rider')} /> rider
            </label>
          </div>
          <div style={{fontSize:12, color:'#555'}}>You can enable other roles later from your Profile.</div>
          {err && <div style={{color:'crimson'}}>{err}</div>}
          <button className="btn" type="submit">register</button>
        </form>
      </div>
    </div>
  )
}
