import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users } from '../data/db'

export default function LoginOTP(){
  const nav = useNavigate()
  const [phone,setPhone] = useState('')
  const [code,setCode] = useState('')
  const [sentCode,setSentCode] = useState<string | null>(null)
  const [err,setErr] = useState('')
  const sendCode = ()=>{
    if(!phone){ setErr('enter phone number'); return }
    const c = Math.floor(100000 + Math.random()*900000).toString()
    sessionStorage.setItem(`hapn.otp.${phone}`, c)
    setSentCode(c)
    setErr('')
  }
  const onSubmit = async (e: React.FormEvent)=> {
    e.preventDefault()
    if(!phone){ setErr('enter phone number'); return }
    const expected = sessionStorage.getItem(`hapn.otp.${phone}`)
    if(!expected || expected !== code){ setErr('invalid code'); return }
    let u = await Users.findByPhone(phone)
    if(!u){
      const email = `p_${phone.replace(/\D/g,'')}@hapn.local`
      u = await Users.create({ email, phone, password: 'otp', role: 'consumer', roles:['consumer'], activeRole:'consumer' })
    }
    localStorage.setItem('hapn.currentUser', u.email)
    localStorage.setItem('hapn.role', u.activeRole ?? u.role)
    nav('/home')
  }
  return (
    <div className="container">
      <div className="card" style={{maxWidth:420, margin:'40px auto'}}>
        <button className="btn secondary" onClick={()=> nav(-1)}>← back</button>
        <h2 style={{color:'var(--color-red)', textAlign:'center'}}>Log In with Code</h2>
        <form className="stack" onSubmit={onSubmit}>
          <input className="input" placeholder="phone number" value={phone} onChange={e=>setPhone(e.target.value)} />
          <div style={{display:'flex', gap:8}}>
            <input className="input" style={{flex:1}} placeholder="6‑digit code" value={code} onChange={e=>setCode(e.target.value)} />
            <button type="button" className="btn secondary" onClick={sendCode}>send code</button>
          </div>
          {sentCode && <div className="card" style={{background:'#fff7f7'}}>Demo code: {sentCode}</div>}
          <button className="btn" type="submit">log in</button>
        </form>
        {err && <div style={{color:'crimson', marginTop:8}}>{err}</div>}
      </div>
    </div>
  )
}

