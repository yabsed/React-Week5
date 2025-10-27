import { useEffect, useState } from 'react';

const BASE_URL = 'https://api-internhasha.wafflestudio.com';

export default function ProfileInfo() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('로그인이 필요합니다.');
      setLoading(false);
      return;
    }
    fetch(`${BASE_URL}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error('유저 정보 불러오기 실패');
        return res.json();
      })
      .then(data => setUser(data))
      .catch(() => setError('유저 정보 불러오기 실패'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">불러오는 중...</div>;
  if (error) return <div className="card form-card form-error">{error}</div>;
  if (!user) return null;

  return (
    <div className="card form-card">
      <h2 className="section-title">내 정보</h2>
      <div className="info-line"><b>이름:</b> {user.name}</div>
      <div className="info-line"><b>이메일:</b> {user.email}</div>
      <div className="muted"><b>가입일:</b> {new Date(user.createdAt).toLocaleString()}</div>
    </div>
  );
}
