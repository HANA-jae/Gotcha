import * as React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import GameDetail from './pages/GameDetail';

function App(): React.ReactElement {
  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <div className="nav-container">
            <Link to="/" className="nav-logo">
              GOTCHA
            </Link>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/game/:gameName" element={<GameDetail />} />
          </Routes>
        </main>

        <footer className="footer">
          <p>&copy; 2024 GOTCHA. 확률확인시스템</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
