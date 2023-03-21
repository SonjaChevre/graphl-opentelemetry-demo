import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/Home';
import Switzerland from './pages/Switzerland';


export default function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<HomePage />} />
        <Route path="/ch" element={<Switzerland />} /> // deal for switzerland
      </Routes>
    </Router>
  );
}