import { Link, Outlet } from 'react-router-dom'

export default function MerchantShell(){
  return (
    <div>
      <header style={{position:'sticky', top:0, zIndex:10, background:'#fff', borderBottom:'1px solid #eee', boxShadow:'0 2px 4px rgba(0,0,0,0.05)'}}>
        <div className="container" style={{display:'flex', alignItems:'center', justifyContent:'space-between', gap:12, padding:'12px 24px'}}>
          <Link to="/merchant/dashboard" className="logo" style={{fontFamily:'Poppins, sans-serif', fontWeight:800}}>hap’n! partner</Link>
          <nav style={{display:'flex', gap:16}}>
            <Link to="/merchant/dashboard">Dashboard</Link>
            <Link to="/merchant/products">Products</Link>
            <Link to="/merchant/orders">Orders</Link>
            <Link to="/profile">Profile</Link>
          </nav>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  )
}
