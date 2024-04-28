import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Nav from './Components/Nav'
import Home from './Components/Home'
import Gallery from './Components/Gallery'

const App= ()=> {
  return (
    <div>
      <BrowserRouter>
      <Nav/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/gallery' element={<Gallery/>}/>
      </Routes>
      </BrowserRouter>
    </div>
  )
}
 export default App