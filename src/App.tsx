import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, createContext, useContext, useEffect } from 'react';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import GlobalEconomy from './pages/GlobalEconomy';
import Analysis from './pages/Analysis';
import AdminPanel from './pages/AdminPanel';
import Layout from './components/Layout';
import { DBUser } from './lib/database';

interface AuthContextType {
  isLoggedIn: boolean;
  isAdmin: boolean;
  user: DBUser | null;
  login: (user: DBUser) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  isAdmin: false,
  user: null,
  login: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<DBUser | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('eclesiar_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
        setIsLoggedIn(true);
        setIsAdmin(parsed.role === 'owner');
      } catch {
        localStorage.removeItem('eclesiar_user');
      }
    }
  }, []);

  const login = (userData: DBUser) => {
    setUser(userData);
    setIsLoggedIn(true);
    setIsAdmin(userData.role === 'owner');
    localStorage.setItem('eclesiar_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    setIsAdmin(false);
    localStorage.removeItem('eclesiar_user');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, isAdmin, user, login, logout }}>
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
