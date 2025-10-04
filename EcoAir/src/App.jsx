import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import DeviceForm from './pages/Device/DeviceForm';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={< Home/>}/>
        <Route path='/register-device' element={<DeviceForm />} />
      </Routes>   
    </BrowserRouter>
  );
}

export default App;