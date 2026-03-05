import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Rider(){
  const [name,setName] = useState('')
  const [phone,setPhone] = useState('')
  const [vehicle,setVehicle] = useState('Motorcycle')
  const onSubmit = (e: React.FormEvent)=> {
    e.preventDefault()
    alert('Rider application submitted (simulated)')
  }
  return (
    <div>
      <div className="hero" style={{background:'linear-gradient(120deg,#fff,#ffefef)', padding:'40px 20px', textAlign:'center'}}>
        <div className="container">
          <h1 style={{fontSize:42, marginBottom:16, color:'var(--color-red)'}}>Ride with hap’n</h1>
          <p style={{fontSize:18, color:'#555', maxWidth:600, margin:'0 auto'}}>Be your own boss. Earn on your schedule. Join our growing fleet of riders delivering smiles across Davao.</p>
        </div>
      </div>
      
      <div className="container" style={{display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:32, marginTop:32}}>
        <div>
          <h3>Why ride with us?</h3>
          <div className="stack">
            <div className="card">
              <div style={{fontWeight:700, marginBottom:4}}>Flexible Hours</div>
              <div style={{color:'#666'}}>Work whenever you want. Just log in and start accepting orders.</div>
            </div>
            <div className="card">
              <div style={{fontWeight:700, marginBottom:4}}>Competitive Earnings</div>
              <div style={{color:'#666'}}>Earn per delivery plus distance bonuses and tips. Keep 100% of your tips.</div>
            </div>
            <div className="card">
              <div style={{fontWeight:700, marginBottom:4}}>Fast Payouts</div>
              <div style={{color:'#666'}}>Get paid weekly directly to your GCash or bank account.</div>
            </div>
          </div>
        </div>
        
        <div className="card">
          <h2 style={{marginTop:0, color:'var(--color-red)'}}>Sign up to ride</h2>
          <form className="stack" onSubmit={onSubmit}>
            <input className="input" placeholder="Full Name" value={name} onChange={e=>setName(e.target.value)} required />
            <input className="input" placeholder="Phone Number" value={phone} onChange={e=>setPhone(e.target.value)} required />
            <select className="input" value={vehicle} onChange={e=>setVehicle(e.target.value)}>
              <option>Motorcycle</option>
              <option>Bicycle</option>
              <option>Car</option>
              <option>Walker</option>
            </select>
            <div style={{fontSize:12, color:'#666'}}>By clicking submit, you agree to our Terms and Privacy Policy.</div>
            <button className="btn" type="submit">Submit Application</button>
          </form>
        </div>
      </div>
      
      <div className="container" style={{marginTop:40, marginBottom:40, textAlign:'center'}}>
        <h3>Ready to hit the road?</h3>
        <Link to="/register" className="btn secondary">Create a Hap'n Account first</Link>
      </div>
    </div>
  )
}

