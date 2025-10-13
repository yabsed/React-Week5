
import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import AuthNav from './AuthNav.jsx';
import LoginForm from './LoginForm.jsx';
import SignupForm from './SignupForm.jsx';
import ProfileInfo from './ProfileInfo.jsx';
import './styles/common.css';
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";

// 임시 로그인 상태 관리 (실제 앱에서는 context나 redux 등 사용)
function AppLayout() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('token');
    navigate('/React-Week5/login');
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    navigate('/React-Week5/profile');
  };

  const handleSignup = () => {
    navigate('/React-Week5/signup');
  };

  return (
    <div>
      <AuthNav isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <Routes>
        <Route path="/React-Week5/login" element={<LoginForm onLogin={handleLogin} />} />
        <Route path="/React-Week5/signup" element={<SignupForm onSignup={handleSignup} />} />
        <Route path="/React-Week5/profile" element={isLoggedIn ? <ProfileInfo /> : <div style={{padding: 32}}><h2>로그인이 필요합니다</h2></div>} />
      </Routes>
    </div>
  );
}

createRoot(document.getElementById('root')).render(
  <Router>
    <AppLayout />
  </Router>
);
