import React from 'react'
import {Link} from 'react-router-dom'
import Signup from './Signup';
import PublicNavbar from './PublicNavbar';
import PrivateNavbar from './PrivateNavbar';

function Navbar() {
  const token = localStorage.getItem("token");
  return (
    <div>
      {token ? <PrivateNavbar /> : <PublicNavbar />}  
    </div>
  )
}

export default Navbar
