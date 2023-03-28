import React from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import Pictures from './page/Pictures.js';
import Home from './page/Home.js';



export default function App() {
  return (
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/pictures" element={<Pictures />} />
      </Routes>

  );
}