import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import pic1 from "../img/dg logo.webp";
import './nav.css';

const Nav = () => {
  return (
    <div id="nav">
      <Link to='/'>
        <img src={pic1} alt="" />
      </Link>
    </div>
  );
};

export default Nav;
