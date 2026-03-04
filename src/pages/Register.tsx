import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users } from '../data/db'
import type { UserRole } from '../data/db'

export default function Register(){
  const nav = useNavigate()
  const [email,setEmail] = useState('')
  const [phone,setPhone] = useState('')
  const [password,setPassword] = useState('')
  const [roles,setRoles] = useState<Record<UserRole,boolean>>({consumer:true, merchant:false, rider:false, admin:false})
  const [err,setErr] = useState('')
  const onSubmit = async (e: React.FormEvent)=> {
    e.preventDefault()
    try{
      const exists = await Users.findByEmail(email)
      if(exists){ setErr('email already registered'); return }
      const picked = (Object.keys(roles) as UserRole[]).filter(r=> roles[r])
      const role = picked.includes('consumer')? 'consumer' : picked[0]
      await Users.create({ email, phone, password, role, roles: picked, activeRole: role })
      localStorage.setItem('hapn.currentUser', email)
      localStorage.setItem('hapn.role', role)
      nav('/home')
    }catch(ex:any){ setErr(ex?.message ?? 'registration failed') }
  }
  return (
    <div className="container">
      <div className="card" style={{maxWidth:420, margin:'40px auto'}}>
        <h2 style={{color:'var(--color-red)', textAlign:'center'}}>Register</h2>
        <form className="stack" onSubmit={onSubmit}>
          <input className="input" placeholder="email address" value={email} onChange={e=>setEmail(e.target.value)} required />
          <input className="input" placeholder="phone number" value={phone} onChange={e=>setPhone(e.target.value)} />
          <input className="input" type="password" placeholder="password" value={password} onChange={e=>setPassword(e.target.value)} required />
          <div className="card" style={{display:'flex', gap:8, alignItems:'center'}}>
            <label><input type="checkbox" checked={roles.consumer} onChange={e=> setRoles({...roles, consumer:e.target.checked})}/> consumer</label>
            <label><input type="checkbox" checked={roles.merchant} onChange={e=> setRoles({...roles, merchant:e.target.checked})}/> merchant</label>
            <label><input type="checkbox" checked={roles.rider} onChange={e=> setRoles({...roles, rider:e.target.checked})}/> rider</label>
          </div>
          {err && <div style={{color:'crimson'}}>{err}</div>}
          <button className="btn" type="submit">register</button>
        </form>
      </div>
    </div>
  )
}
