import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, createContext, useContext } from 'react';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import GlobalEconomy from './pages/GlobalEconomy';
import Analysis from './pages/Analysis';
import AdminPanel from './pages/AdminPanel';
import Layout from './components/Layout';

interface AuthContextType {
  isLoggedIn: boolean;
  isAdmin: boolean;
  login: (role: 'owner' | 'member') => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  isAdmin: false,
  login: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const login = (role: 'owner' | 'member') => {
    setIsLoggedIn(true);
    setIsAdmin(role === 'owner');
  };

  const logout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, isAdmin, login, logout }}>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={isLoggedIn ? <Layout><Dashboard /></Layout> : <Navigate to="/login" />} />
          <Route path="/global" element={isLoggedIn ? <Layout><GlobalEconomy /></Layout> : <Navigate to="/login" />} />
          <Route path="/analysis" element={isLoggedIn ? <Layout><Analysis /></Layout> : <Navigate to="/login" />} />
          <Route path="/admin" element={isLoggedIn && isAdmin ? <Layout><AdminPanel /></Layout> : <Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
