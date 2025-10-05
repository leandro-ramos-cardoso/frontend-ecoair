import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Menu'
import PrivateRoute from './components/PrivateRoute'
import Home from './pages/Home'
import DeviceForm from './pages/Device/DeviceForm';
import DeviceList from './pages/Device/DeviceList';
import LoginForm from './pages/Auth/LoginForm';
import RegisterForm from './pages/Auth/RegisterForm';
import Sobre from './pages/About/Sobre';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={< Home/>}/>
        <Route path='/register-device' element={<PrivateRoute> <DeviceForm /> </PrivateRoute>} />
        <Route path='/device-list' element={<DeviceList />} />
        <Route path='/update-device/:id' element={<PrivateRoute><DeviceForm /></PrivateRoute>} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/sobre" element={<Sobre />} />
        {/*<Route path="/register" element={<PrivateRoute><RegisterForm /></PrivateRoute>} /> */}
      </Routes>   
    </BrowserRouter>
  );
}

export default App;