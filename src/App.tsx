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

export default function App() {
  return (
    <Routes>
      <Route path="/splash" element={<Splash />} />
      <Route path="/welcome" element={<Welcome />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Shell />}>
        <Route index element={<Landing />} />
        <Route path="home" element={<Home />} />
        <Route path="cart" element={<Cart />} />
        <Route path="calendar" element={<Calendar />} />
        <Route path="merchant/register" element={<MerchantRegister />} />
        <Route path="merchant/products" element={<MerchantProducts />} />
        <Route path="merchant/stats" element={<Statistics />} />
        <Route path="rider" element={<Rider />} />
        <Route path="profile" element={<Profile />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
