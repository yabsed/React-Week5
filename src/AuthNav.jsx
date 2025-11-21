import { Link } from "react-router-dom";
import "./styles/common.css";

function AuthNav({ isLoggedIn, onLogout }) {
  return (
    <nav className="top-nav">
      <Link className="nav-logo" to="/">스누인턴</Link>
      <div className="nav-right">
        {isLoggedIn ? (
          <>
            <Link className="nav-link" to="/mypage">마이페이지</Link>
            <button className="nav-link nav-button" onClick={onLogout}>로그아웃</button>
          </>
        ) : (
          <>
            <Link className="nav-link" to="/signup">회원가입</Link>
            <Link className="nav-link" to="/login">로그인</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default AuthNav;
