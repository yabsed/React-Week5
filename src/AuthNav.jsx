import React from "react";
import { Link } from "react-router-dom";
import "./styles/common.css";

import { useNavigate } from "react-router-dom";

function AuthNav({ isLoggedIn, onLogout }) {
  const navigate = useNavigate();
  
  const handleGoBack = () => {
    // 이전 페이지가 우리 사이트 내부인지 확인
    // window.history.state가 null이거나 히스토리가 1개뿐이면 홈으로
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } 
  };
  
  return (
    <>
      <nav className="auth-nav">
        <button className="button button-weak" onClick={handleGoBack}>← 뒤로가기</button>
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
