import React from 'react';
import { Link } from 'react-router-dom';
import "./home.css"

const Home = () => {
  return (
    <div>
      <h1>Welcome to Our Beautiful Gallery!</h1>
      <p>Explore our stunning collection by clicking the button below.</p>
      <Link to="/gallery">
        <button>Explore Gallery</button>
      </Link>
    </div>
  );
};

export default Home;
