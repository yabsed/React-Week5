import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BASE_URL = 'https://api-internhasha.wafflestudio.com';

export default function LoginForm({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${BASE_URL}/api/auth/user/session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) throw new Error('로그인 실패');
      const data = await res.json();
      localStorage.setItem('token', data.token);
      onLogin && onLogin();
      navigate('/React-Week5/profile');
    } catch (err) {
      setError('이메일 또는 비밀번호가 올바르지 않습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card form-card">
      <h2 className="section-title">
        로그인</h2>
      <input className="form-input" type="email" placeholder="이메일" value={email} onChange={e => setEmail(e.target.value)} required />
      <input className="form-input" type="password" placeholder="비밀번호" value={password} onChange={e => setPassword(e.target.value)} required />
      <button className="button button-strong full-width-button" type="submit" disabled={loading}>로그인</button>
      {error && <div className="form-error">{error}</div>}
    </form>
  );
}
