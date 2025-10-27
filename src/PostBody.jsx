import React from "react";
import { Link } from "react-router-dom";
import "./styles/common.css"; // 공통 CSS
import "./styles/postbody.css"; // 이 컴포넌트 전용 CSS (아래 CSS 내용 참고)
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";

const BASE_URL = 'https://api-internhasha.wafflestudio.com';

function PostBody({}) {
  const navigate = useNavigate();
  const { id } = useParams(); // URL에서 id 파라미터 가져오기

  const [postInfo, setPostInfo] = useState(null); 
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // URL 파라미터에서 받은 id를 사용, 없으면 기본값 사용
    const postId = id || '1fb399e4-62ee-4033-b236-a464b8129d39';
    
    fetch(`${BASE_URL}/api/post/${postId}`, {}) 
      .then(res => {
        if(!res.ok) throw new Error("포스트 정보 불러오기 실패"); 
        return res.json(); 
      })
      .then(data => setPostInfo(data))
      .catch((err) => setError(err.message || '포스트 정보 불러오기 실패'))
      .finally(() => setLoading(false))
  }, [id]); // id가 변경될 때마다 다시 fetch 

  // --- 상태 처리 ---
  if (loading) return <div className="loading">불러오는 중...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!postInfo) return <div className="no-data">포스트 정보가 없습니다.</div>;

  // --- 헬퍼 함수 ---
  // 급여 포맷 (null, 0, 또는 값)
  const formatSalary = (salary) => {
    if (salary === null || salary === undefined) {
      return '회사 내규에 따름';
    }
    if (salary === 0) {
      return '무급 (협의 가능)'; // 0일 때의 처리
    }
    return `연봉: ${salary.toLocaleString()}원`;
  };

  // 날짜 포맷 (YYYY.MM.DD)
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  // --- 렌더링 ---
  return (
    <div className="post-body-container">
      
      {/* 포지션 정보 (postInfo.position)
      */}
      <section className="position-details card">
        <h2>{postInfo.position.positionTitle}</h2>
        
        <ul>
          <li><strong>모집 분야:</strong> {postInfo.position.positionType}</li>
          <li><strong>모집 인원:</strong> {postInfo.position.headCount}명</li>
          <li><strong>급여:</strong> {formatSalary(postInfo.position.salary)}</li>
          <li><strong>채용 마감:</strong> {formatDate(postInfo.position.employmentEndDate)}</li>
        </ul>
        
        <h4>상세 업무 내용</h4>
        {/* [중요] detail 필드에 HTML/Markdown이 포함되어 있으므로
          dangerouslySetInnerHTML을 사용해야 줄바꿈(<br>) 등이 적용됩니다.
          
          경고: 이 방식은 XSS 공격에 취약할 수 있습니다.
          서버에서 받은 데이터가 신뢰할 수 있을 때만 사용해야 합니다.
        */}
        <div 
          className="position-description"
          dangerouslySetInnerHTML={{ 
            __html: postInfo.position.detail.replace(/\n/g, '<br />') 
          }} 
        />
      </section>

      <hr />

      {/* 회사 정보 (postInfo.company)
      */}
      <section className="company-details card">
        <h3>회사 정보</h3>
        <p><strong>회사명:</strong> {postInfo.company.companyName}</p>
        <p><strong>슬로건:</strong> {postInfo.company.slogan}</p>
        <p><strong>설립연도:</strong> {postInfo.company.companyEstablishedYear}년</p>
        <p><strong>산업 분야:</strong> {postInfo.company.domain}</p>
        <p><strong>임직원 수:</strong> {postInfo.company.headcount}명</p>
        {/* | 문자를 공백으로 보기 좋게 변경 */}
        <p><strong>위치:</strong> {postInfo.company.location.replace('|', ' ')}</p> 

        <h4>회사 태그</h4>
        <div className="tags-list">
          {postInfo.company.tags.map((tagItem) => (
            <span key={tagItem.tag} className="tag">{tagItem.tag}</span>
          ))}
        </div>

        <h4>관련 링크</h4>
        <ul>
          {/* 회사 홍보 영상 등 links 배열 순회 */}
          {postInfo.company.links.map((linkItem, index) => (
            <li key={index}>
              <a href={linkItem.link} target="_blank" rel="noopener noreferrer">
                {linkItem.description}
              </a>
            </li>
          ))}
          {/* 랜딩 페이지 링크 */}
          <li>
            <a href={postInfo.company.landingPageLink} target="_blank" rel="noopener noreferrer">
              회사 홈페이지 / 랜딩 페이지
            </a>
          </li>
          {/* PDF 링크 (필요시) */}
          {postInfo.company.companyInfoPDFKey && (
             <li>
              <a href={`${BASE_URL}/${postInfo.company.companyInfoPDFKey}`} target="_blank" rel="noopener noreferrer">
                회사 소개서 (PDF)
              </a>
            </li>
          )}
        </ul>
      </section>

      <hr />

      {/* 기타 정보 (postInfo root)
      */}
      <section className="other-info card">
        <p>
          <strong>북마크 여부:</strong> {postInfo.isBookmarked ? '북마크 함' : '북마크 안 함'}
        </p>
        <p>
          <strong>현재 커피챗 신청 수:</strong> {postInfo.coffeeChatCount} 건
        </p>
      </section>
    </div>
  );
}

export default PostBody;