import React from "react";
import { Link } from "react-router-dom"; // Link는 각 포스트로 이동하기 위해 필요합니다.
import "./styles/common.css"; // 공통 CSS
import "./styles/postlist.css"; // 이 컴포넌트 전용 CSS (아래 CSS 내용 참고)
import { useEffect, useState } from 'react';
// import { useNavigate, useParams } from "react-router-dom"; // 이 페이지에서는 필요하지 않습니다.

const BASE_URL = 'https://api-internhasha.wafflestudio.com';

/**
 * 포스트 목록을 불러와서 그리드 형태로 보여주는 컴포넌트
 */
function PostList({}) { // Props는 현재 필요하지 않습니다.
  
  const [posts, setPosts] = useState([]); // 포스트 목록을 담을 배열
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 컴포넌트 마운트 시 API로부터 포스트 목록을 불러옵니다.
    fetch(`${BASE_URL}/api/post`)
      .then(res => {
        if (!res.ok) {
          throw new Error('데이터를 불러오는 데 실패했습니다.');
        }
        return res.json();
      })
      .then(data => {
        setPosts(data.posts); // JSON 응답의 'posts' 배열을 상태에 저장
      })
      .catch(err => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []); // 빈 의존성 배열로 마운트 시 1회만 실행

  // --- 상태별 렌더링 ---
  if (loading) {
    return <div className="loading">채용 공고를 불러오는 중...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="post-list-container">
      <h1>채용 공고</h1>
      <div className="post-list-grid">
        {/* 불러온 posts 배열을 순회하며 PostCard를 렌더링 */}
        {posts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}

/**
 * 개별 포스트 카드를 렌더링하는 "미니 모듈"
 * @param {object} post - 개별 포스트 데이터
 */
function PostCard({ post }) {
  
  // 이미지는 post.profileImageKey (회사 로고)를 사용합니다.
  const imageUrl = `${BASE_URL}/${post.profileImageKey}`;
  
  // 상세 페이지로 이동할 경로 (예: /post/a5f5ead2...)
  const postDetailUrl = `/React-Week5/${post.id}`; 
  
  // 위치 데이터 정리 (예: "경기 성남시 분당구...")
  const location = post.location.split('|')[0];

  return (
    // Link 컴포넌트로 카드 전체를 감싸 클릭 가능하게 만듭니다.
    <Link to={postDetailUrl} className="post-card">
      <div className="card-image-wrapper">
        <img 
          src={imageUrl} 
          alt={`${post.companyName} 로고`} 
          className="card-image"
        />
      </div>
      <div className="card-content">
        <h3 className="card-position-title">{post.positionTitle}</h3>
        <p className="card-company-name">{post.companyName}</p>
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

export default PostList;