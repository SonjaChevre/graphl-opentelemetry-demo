import React from 'react';
import {Link} from "react-router-dom";



function Home() {

  return (
    <div>
     <b>Hello</b>
     <p><Link to="/Pictures"> Pictures </Link></p>
    </div>
  );
}

export default Home;