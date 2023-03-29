import React from 'react';
import {Link} from "react-router-dom";



function Home() {

  return (
    <div>
     <b>Last minute deals 🏝️</b>
     <p><Link to="/Deals">Deals</Link></p>
     <p><Link to="/Pictures">Pictures</Link> - take a look at the best locations</p>
    </div>
  );
}

export default Home;