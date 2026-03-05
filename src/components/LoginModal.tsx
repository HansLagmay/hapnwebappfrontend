import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Users } from '../data/db'
import type { UserRole } from '../data/db'

export default function LoginModal({open,onClose}:{open:boolean,onClose:()=>void}){
  const nav = useNavigate()
  const [mode,setMode] = useState<'login'|'register'>('login')
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [phone,setPhone] = useState('')
  const [role,setRole] = useState<UserRole>('consumer')
  const [err,setErr] = useState('')
  
  if(!open) return null
  
  const reset = ()=> { setMode('login'); setEmail(''); setPassword(''); setPhone(''); setErr(''); setRole('consumer') }
  const close = ()=> { onClose(); setTimeout(reset, 200) }

  const doLogin = async (e: React.FormEvent)=>{
    e.preventDefault()
    const u = await Users.findByEmail(email)
    if(!u || u.password!==password){ setErr('invalid credentials'); return }
    localStorage.setItem('hapn.currentUser', email)
    localStorage.setItem('hapn.role', u.activeRole ?? u.role)
    close(); nav('/home')
  }

  const doRegister = async (e: React.FormEvent)=> {
    e.preventDefault()
    try{
      const exists = await Users.findByEmail(email)
      if(exists){ setErr('email already registered'); return }
      await Users.create({ email, phone, password, role, roles: [role], activeRole: role })
      localStorage.setItem('hapn.currentUser', email)
      localStorage.setItem('hapn.role', role)
      close(); nav('/home')
    }catch(ex:any){ setErr(ex?.message ?? 'registration failed') }
  }

  return (
    <div className="overlay" onClick={close}>
      <div className="modal" onClick={e=> e.stopPropagation()}>
        <button className="modal-close" onClick={close}>×</button>
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
            <h2 style={{marginTop:0, color:'var(--color-red)'}}>{mode==='login' ? 'Welcome!' : 'Join hap’n'}</h2>
            <div className="stack">
              {mode==='login' ? (
                <>
                  <button className="btn secondary" disabled>Continue with Google</button>
                  <button className="btn secondary" disabled>Continue with Apple</button>
                  <div style={{display:'flex',alignItems:'center',gap:8, color:'#777'}}><span style={{flex:1,height:1,background:'#eee'}}/>or<span style={{flex:1,height:1,background:'#eee'}}/></div>
                  <form className="stack" onSubmit={doLogin}>
                    <input className="input" placeholder="email address" value={email} onChange={e=>setEmail(e.target.value)} />
                    <input className="input" type="password" placeholder="password" value={password} onChange={e=>setPassword(e.target.value)} />
                    {err && <div style={{color:'crimson'}}>{err}</div>}
                    <button className="btn" type="submit">log in</button>
                  </form>
                  <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
                    <button className="btn secondary" onClick={()=> { setEmail('customer@hapn.local'); setPassword('123456') }}>customer</button>
                    <button className="btn secondary" onClick={()=> { setEmail('merchant@hapn.local'); setPassword('123456') }}>merchant</button>
                    <button className="btn secondary" onClick={()=> { setEmail('rider@hapn.local'); setPassword('123456') }}>rider</button>
                  </div>
                  <div style={{textAlign:'right'}}>
                    <a href="#" onClick={(e)=> { e.preventDefault(); setMode('register') }}>create account</a>
                  </div>
                </>
              ) : (
                <>
                  <form className="stack" onSubmit={doRegister}>
                    <input className="input" placeholder="email address" value={email} onChange={e=>setEmail(e.target.value)} required />
                    <input className="input" placeholder="phone (optional)" value={phone} onChange={e=>setPhone(e.target.value)} />
                    <input className="input" type="password" placeholder="password (min 6 chars)" value={password} onChange={e=>setPassword(e.target.value)} required />
                    <div className="card" style={{display:'flex', gap:12, alignItems:'center', justifyContent:'space-between', padding:8}}>
                      <label style={{display:'flex',alignItems:'center',gap:4, fontSize:13}}><input type="radio" name="role" checked={role==='consumer'} onChange={()=> setRole('consumer')} /> consumer</label>
                      <label style={{display:'flex',alignItems:'center',gap:4, fontSize:13}}><input type="radio" name="role" checked={role==='merchant'} onChange={()=> setRole('merchant')} /> merchant</label>
                      <label style={{display:'flex',alignItems:'center',gap:4, fontSize:13}}><input type="radio" name="role" checked={role==='rider'} onChange={()=> setRole('rider')} /> rider</label>
                    </div>
                    {err && <div style={{color:'crimson'}}>{err}</div>}
                    <button className="btn" type="submit">register</button>
                  </form>
                  <div style={{textAlign:'right'}}>
                    <a href="#" onClick={(e)=> { e.preventDefault(); setMode('login') }}>log in instead</a>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

