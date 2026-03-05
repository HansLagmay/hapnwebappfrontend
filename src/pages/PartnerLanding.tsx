import { Link } from 'react-router-dom'

export default function PartnerLanding(){
  return (
    <div>
      <header style={{padding:'20px 0', borderBottom:'1px solid #eee'}}>
        <div className="container" style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <Link to="/" className="logo" style={{fontFamily:'Poppins, sans-serif', fontWeight:800}}>hap’n! for business</Link>
          <div style={{display:'flex', gap:12}}>
            <Link to="/merchant/login" className="btn secondary">Log in</Link>
            <Link to="/merchant/register" className="btn">Get Started</Link>
          </div>
        </div>
      </header>
      <div className="hero" style={{background:'linear-gradient(120deg,#fff,#fff0f0)', padding:'60px 20px', textAlign:'center'}}>
        <div className="container">
          <h1 style={{fontSize:48, marginBottom:16, color:'var(--color-red)'}}>Grow your business with Hap’n</h1>
          <p style={{fontSize:20, color:'#555', maxWidth:700, margin:'0 auto 32px'}}>Reach thousands of new customers in Davao. We handle the delivery, you handle the food (or goods!).</p>
          <Link to="/merchant/register" className="btn" style={{fontSize:18, padding:'14px 28px'}}>Sign up now</Link>
        </div>
      </div>
      <div className="container" style={{marginTop:40, display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:32}}>
        <div className="card">
          <h3>More Sales</h3>
          <p>Tap into a huge customer base looking for local MSMEs.</p>
        </div>
        <div className="card">
          <h3>Hassle-free Delivery</h3>
          <p>Our rider fleet handles logistics so you can focus on quality.</p>
        </div>
        <div className="card">
          <h3>Marketing Tools</h3>
          <p>Create promos and vouchers to attract new buyers.</p>
        </div>
      </div>
    </div>
  )
}
