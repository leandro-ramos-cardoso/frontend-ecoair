import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import DeviceForm from './pages/Device/DeviceForm';
import DeviceList from './pages/Device/DeviceList';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={< Home/>}/>
        <Route path='/register-device' element={<DeviceForm />} />
        <Route path='/device-list' element={<DeviceList />} />
        <Route path='/update-device/:id' element={<DeviceForm />} />
      </Routes>   
    </BrowserRouter>
  );
}

export default App;