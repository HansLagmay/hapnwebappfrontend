import { Routes, Route, Navigate } from 'react-router-dom'
import Splash from './pages/Splash'
import Welcome from './pages/Welcome'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import Cart from './pages/Cart'
import Calendar from './pages/Calendar'
import MerchantRegister from './pages/MerchantRegister'
import Statistics from './pages/Statistics'
import Profile from './pages/Profile'
import Rider from './pages/Rider'
import Shell from './components/Shell'
import MerchantProducts from './pages/MerchantProducts'

import PartnerLanding from './pages/PartnerLanding'
import MerchantShell from './components/MerchantShell'
import RiderShell from './components/RiderShell'

export default function App() {
  return (
    <Routes>
      <Route path="/splash" element={<Splash />} />
      <Route path="/welcome" element={<Welcome />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Consumer Routes */}
      <Route path="/" element={<Shell />}>
        <Route index element={<Landing />} />
        <Route path="home" element={<Home />} />
        <Route path="cart" element={<Cart />} />
        <Route path="calendar" element={<Calendar />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* Public Portals */}
      <Route path="/partner" element={<PartnerLanding />} />
      <Route path="/rider" element={<Rider />} />

      {/* Merchant Portal */}
      <Route path="/merchant" element={<MerchantShell />}>
        <Route path="register" element={<MerchantRegister />} />
        <Route path="dashboard" element={<Statistics />} />
        <Route path="products" element={<MerchantProducts />} />
        <Route path="orders" element={<div className="container"><h2>Orders</h2><div className="card">No active orders</div></div>} />
        <Route path="stats" element={<Statistics />} />
      </Route>

      {/* Rider Portal */}
      <Route path="/rider" element={<RiderShell />}>
        <Route path="dashboard" element={<div className="container"><h2>Rider Dashboard</h2><div className="card">Ready to accept tasks</div></div>} />
        <Route path="tasks" element={<div className="container"><h2>My Tasks</h2><div className="card">No active deliveries</div></div>} />
        <Route path="earnings" element={<div className="container"><h2>Earnings</h2><div className="card">Total: ₱0.00</div></div>} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
