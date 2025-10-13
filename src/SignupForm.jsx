import { useState, useEffect } from 'react';

const BASE_URL = 'https://api-internhasha.wafflestudio.com';

const PasswordRequirements = ({ password }) => {
  const checks = {
    length: password.length >= 8,
    number: /\d/.test(password),
    case: /[a-z]/.test(password) && /[A-Z]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    consecutive: !/(.)\1{2,}/.test(password) && !/abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|012|123|234|345|456|567|678|789/.test(password.toLowerCase()),
  };

  return (
    <div style={{ marginTop: 8, fontSize: 12, color: '#555' }}>
      <div>{checks.length ? '✓' : '✗'} 8자리 이상</div>
      <div>{checks.number ? '✓' : '✗'} 숫자 포함</div>
      <div>{checks.case ? '✓' : '✗'} 영문 대소문자 포함</div>
      <div>{checks.special ? '✓' : '✗'} 특수문자 포함</div>
      <div>{checks.consecutive ? '✓' : '✗'} 연속된 문자열이나 숫자 없음</div>
    </div>
  );
};

export default function SignupForm({ onSignup }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [requestPayload, setRequestPayload] = useState(null);
  const [responseMessage, setResponseMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResponseMessage('');
    setRequestPayload(null);

    try {
      const payload = {
        authType: 'APPLICANT',
        info: {
          type: "APPLICANT",
          name,
          email,
          password,
          successCode: '1234',
        },
      };
      setRequestPayload(payload);

      const res = await fetch(`${BASE_URL}/api/auth/user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const text = await res.text();
        setResponseMessage(text);
        onSignup && onSignup();
      } else {
        const errorData = await res.json();
        setResponseMessage(JSON.stringify(errorData, null, 2));
        if (errorData.details) {
          const errorMessages = Object.values(errorData.details).join(' ');
          setError(errorMessages);
        } else {
          setError(errorData.message || '회원가입에 실패했습니다.');
        }
      }
    } catch (err) {
      setError('회원가입 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card" style={{ maxWidth: 400, margin: '40px auto', padding: 32 }}>
      <h2 className="section-title">회원가입</h2>
      <input type="text" placeholder="이름" value={name} onChange={e => setName(e.target.value)} required style={{ width: '100%', marginBottom: 16, padding: 8 }} />
      <input type="email" placeholder="이메일" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: '100%', marginBottom: 16, padding: 8 }} />
      <div style={{ position: 'relative', width: '100%', marginBottom: 16 }}>
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="비밀번호"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onFocus={() => setPasswordFocused(true)}
          required
          style={{ width: '100%', padding: 8, paddingRight: 40 }}
        />
        <span onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}>
          {showPassword ? '🙈' : '👁️'}
        </span>
      </div>
      {passwordFocused && <PasswordRequirements password={password} />}
      <button className="button button-strong" type="submit" disabled={loading} style={{ width: '100%', marginTop: 16 }}>회원가입</button>
      {error && <div style={{ color: 'red', marginTop: 12 }}>{error}</div>}
      {requestPayload && (
        <div style={{ marginTop: 16, fontSize: 13, color: '#555', wordBreak: 'break-all' }}>
          <b>보낸 데이터:</b>
          <pre style={{ background: '#f6f6f6', padding: 8, borderRadius: 4 }}>{JSON.stringify(requestPayload, null, 2)}</pre>
        </div>
      )}
      {responseMessage && (
        <div style={{ marginTop: 8, fontSize: 13, color: '#555', wordBreak: 'break-all' }}>
          <b>받은 메시지:</b>
          <pre style={{ background: '#f6f6f6', padding: 8, borderRadius: 4 }}>{responseMessage}</pre>
        </div>
      )}
    </form>
  );
}
