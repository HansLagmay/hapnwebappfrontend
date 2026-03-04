import { Link } from 'react-router-dom'
import Logo from '../components/Logo'

export default function Welcome(){
  return (
    <div className="container" style={{display:'flex',height:'100%',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:18}}>
      <Logo size={84} />
      <div style={{color:'var(--color-red)', fontWeight:600}}>go on, make it hap’n!</div>
      <div className="stack" style={{minWidth:280}}>
        <Link to="/register" className="btn">register</Link>
        <Link to="/login" className="btn">log in</Link>
        <Link to="/home" style={{textAlign:'center', color:'var(--color-dark-crimson)'}}>log in as guest</Link>
      </div>
    </div>
  )
}
