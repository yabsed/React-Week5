import React from "react";
import { Link } from "react-router-dom";
import "./styles/common.css";

import { useNavigate } from "react-router-dom";

function AuthNav({ isLoggedIn, onLogout }) {
  const navigate = useNavigate();
  return (
    <>
      {/* 우측 네비게이션 */}
      <nav className="auth-nav" style={{ display: 'flex', gap: 16, justifyContent: 'flex-end', padding: 16 }}>
        {!isLoggedIn ? (
          <>
            <Link className="button button-strong" to="/login">로그인</Link>
            <Link className="button button-strong" to="/signup">회원가입</Link>
          </>
        ) : (
          <>
            <Link className="button button-strong" to="/profile">내 정보</Link>
            <button className="button button-strong" onClick={onLogout}>로그아웃</button>
          </>
        )}
      </nav>
    </>
  );
}

export default AuthNav;
