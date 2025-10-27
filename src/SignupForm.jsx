import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
    <div className="password-requirements">
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
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const navigate = useNavigate();

  const passwordsMatch = password && password === passwordConfirm;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!passwordsMatch) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }
    setLoading(true);
    setError('');

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

      const res = await fetch(`${BASE_URL}/api/auth/user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('token', data.token);
        onSignup && onSignup();
        navigate('/React-Week5/profile');
      } else {
        const errorData = await res.json();
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
    <form onSubmit={handleSubmit} className="card form-card">
      <h2 className="section-title">회원가입</h2>
      <input className="form-input" type="text" placeholder="이름" value={name} onChange={e => setName(e.target.value)} required />
      <input className="form-input" type="email" placeholder="이메일" value={email} onChange={e => setEmail(e.target.value)} required />
      <div className="input-wrapper">
        <input
          className="form-input input-with-icon"
          type={showPassword ? 'text' : 'password'}
          placeholder="비밀번호"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onFocus={() => setPasswordFocused(true)}
          required
        />
        <span onClick={() => setShowPassword(!showPassword)} className="icon-right">
          {showPassword ? '🙈' : '👁️'}
        </span>
      </div>
      {passwordFocused && (
        <>
          <PasswordRequirements password={password} className="password-requirements" />
          <div className="input-wrapper mt-sm">
            <input
              className="form-input input-with-icon"
              type={showPassword ? 'text' : 'password'}
              placeholder="비밀번호 확인"
              value={passwordConfirm}
              onChange={e => setPasswordConfirm(e.target.value)}
              required
            />
            <span onClick={() => setShowPassword(!showPassword)} className="icon-right">
              {showPassword ? '🙈' : '👁️'}
            </span>
          </div>
        </>
      )}
      {passwordConfirm && !passwordsMatch && (
        <div className="form-error-small">비밀번호가 일치하지 않습니다.</div>
      )}
  <button className="button button-strong full-width-button mt-md" type="submit" disabled={loading || !passwordsMatch}>회원가입</button>
      {error && <div className="form-error">{error}</div>}
    </form>
  );
}
