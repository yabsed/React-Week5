import React from "react";
import { Link } from "react-router-dom";
import "./styles/common.css";

import { useNavigate } from "react-router-dom";

function AuthNav({ isLoggedIn, onLogout }) {
  const navigate = useNavigate();
  return (
    <>
      <nav className="auth-nav">
        {!isLoggedIn ? (
          <>
            <Link className="button button-strong" to="/React-Week5/login">로그인</Link>
            <Link className="button button-strong" to="/React-Week5/signup">회원가입</Link>
          </>
        ) : (
          <>
            <Link className="button button-strong" to="/React-Week5/profile">내 정보</Link>
            <button className="button button-strong" onClick={onLogout}>로그아웃</button>
          </>
        )}
      </nav>
    </>
  );
}

export default AuthNav;
