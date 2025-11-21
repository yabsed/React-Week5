import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/modal.css';

/**
 * 로그인이 필요한 경우 표시되는 모달
 */
function LoginRequiredModal({ isOpen, onClose }) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">찜하기를 하려면 로그인이 필요해요</h2>
        <p className="modal-subtitle">계정이 없으시다면</p>
        <p className="modal-subtitle">지금 바로 회원가입해보세요</p>
        
        <div className="modal-buttons">
          <button className="modal-button primary" onClick={handleLoginClick}>
            로그인하기
          </button>
          <button className="modal-button secondary" onClick={handleClose}>
            뒤로 가기
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginRequiredModal;
