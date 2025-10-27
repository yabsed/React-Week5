import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const BASE_URL = 'https://api-internhasha.wafflestudio.com';

/**
 * 개별 포스트 카드를 렌더링하는 컴포넌트
 * @param {object} post - 개별 포스트 데이터
 */
function PostCard({ post }) {
  
  // 이미지는 post.profileImageKey (회사 로고)를 사용합니다.
  const imageUrl = post.profileImageKey ? `${BASE_URL}/${post.profileImageKey}` : null;
  const [imageError, setImageError] = useState(false);
  
  // 상세 페이지로 이동할 경로 (예: /post/a5f5ead2...)
  const postDetailUrl = `/React-Week5/${post.id}`; 
  
  // 위치 데이터 정리 (예: "경기 성남시 분당구...")
  const location = post.location.split('|')[0];

  return (
    // Link 컴포넌트로 카드 전체를 감싸 클릭 가능하게 만듭니다.
    <Link to={postDetailUrl} className="post-card">
      <div className="card-content">
        <div className="card-header">
          <div className="profile-image-wrapper">
            {imageUrl && !imageError ? (
              <img 
                src={imageUrl} 
                alt="" 
                className="profile-image"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="profile-image-placeholder"></div>
            )}
          </div>
          <p className="card-company-name">{post.companyName}</p>
        </div>
        <h3 className="card-position-title">{post.positionTitle}</h3>
        <p className="card-location">{location}</p>
        <div className="card-tags">
          {/* 태그는 최대 3개까지만 표시 (예시) */}
          {post.tags.slice(0, 3).map(tagItem => (
            <span key={tagItem.tag} className="card-tag">{tagItem.tag}</span>
          ))}
        </div>
      </div>
    </Link>
  );
}

export default PostCard;
