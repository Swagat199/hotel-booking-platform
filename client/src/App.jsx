import { Route, Routes, useLocation } from 'react-router-dom'
import './App.css'
import Navbar from './Components/Navbar'
import Home from './Pages/Home';
import Footer from './Components/Footer';
import AllRooms from './Pages/AllRooms';
import RoomDetails from './Pages/RoomDetails';
import MyBookings from './Pages/MyBookings';
import HotelReg from './Components/HotelReg';
import Layout from './Pages/HotelOwner/Layout';
import Dashboard from './Pages/HotelOwner/Dashboard';
import AddRooms from './Pages/HotelOwner/AddRooms';
import Listrooms from './Pages/HotelOwner/Listrooms';

function App() {
  
  const isOwner= useLocation().pathname.includes('owner');

  return (
    <div>
     { !isOwner && <Navbar/>}
     {false && <HotelReg/>}
     <div className="min-h-[70vh]">
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/rooms' element={<AllRooms/>} />
        <Route path='/rooms/:id' element={<RoomDetails/>} />
        <Route path='/my-bookings' element={<MyBookings/>} />
        <Route path='/owner' element={<Layout/>}>  
            <Route index element={<Dashboard/>} />    
            <Route path='add-room' element={<AddRooms/>} /> 
            <Route path='list-room' element={<Listrooms/>} /> 
        </Route>
      </Routes>
     </div>
     <Footer/>
    </div>
  )
}


export default App
