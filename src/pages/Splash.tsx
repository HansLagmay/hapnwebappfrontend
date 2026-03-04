import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'

export default function Splash(){
  const nav = useNavigate()
  useEffect(()=>{
    const t = setTimeout(()=> nav('/welcome'), 1200)
    return ()=> clearTimeout(t)
  },[nav])
  return (
    <div className="container" style={{display:'flex',height:'100%',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:12}}>
      <Logo size={96} />
    </div>
  )
}
