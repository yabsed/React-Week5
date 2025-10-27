import React from "react";
import { Link, useSearchParams } from "react-router-dom"; // Link는 각 포스트로 이동하기 위해 필요합니다.
import "./styles/common.css"; // 공통 CSS
import "./styles/postlist.css"; // 이 컴포넌트 전용 CSS (아래 CSS 내용 참고)
import { useEffect, useState } from 'react';
// import { useNavigate, useParams } from "react-router-dom"; // 이 페이지에서는 필요하지 않습니다.

const BASE_URL = 'https://api-internhasha.wafflestudio.com';

// 직무 카테고리 정의
const JOB_CATEGORIES = {
  DEVELOPMENT: {
    label: 'DEVELOPMENT',
    roles: [
      { value: 'FRONT', label: '프론트엔드 개발' },
      { value: 'APP', label: '앱 개발' },
      { value: 'BACKEND', label: '백엔드 개발' },
      { value: 'DATA', label: '데이터 분석' },
      { value: 'OTHERS', label: '기타' }
    ]
  },
  PLANNER: {
    label: 'PLANNER',
    roles: [
      { value: 'PLANNER', label: '기획' }
    ]
  },
  DESIGN: {
    label: 'DESIGN',
    roles: [
      { value: 'DESIGN', label: '디자인' }
    ]
  },
  MARKETING: {
    label: 'MARKETING',
    roles: [
      { value: 'MARKETING', label: '마케팅' }
    ]
  }
};

/**
 * 포스트 목록을 불러와서 그리드 형태로 보여주는 컴포넌트
 */
function PostList({}) { // Props는 현재 필요하지 않습니다.
  
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState([]); // 포스트 목록을 담을 배열
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRoles, setSelectedRoles] = useState(() => {
    // URL에서 roles 파라미터 읽기
    return searchParams.getAll('roles');
  });
  const [isFilterOpen, setIsFilterOpen] = useState(true); // 필터 열림/닫힘 상태

  useEffect(() => {
    // 선택된 roles를 기반으로 API URL 구성
    let apiUrl = `${BASE_URL}/api/post`;
    if (selectedRoles.length > 0) {
      const rolesQuery = selectedRoles.map(role => `roles=${role}`).join('&');
      apiUrl += `?${rolesQuery}`;
    }

    setLoading(true);
    // 컴포넌트 마운트 시 API로부터 포스트 목록을 불러옵니다.
    fetch(apiUrl)
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
  }, [selectedRoles]); // selectedRoles가 변경될 때마다 재실행

  // 역할 선택/해제 핸들러
  const handleRoleToggle = (role) => {
    setSelectedRoles(prev => {
      let newRoles;
      if (prev.includes(role)) {
        // 이미 선택된 경우 제거
        newRoles = prev.filter(r => r !== role);
      } else {
        // 선택되지 않은 경우 추가
        newRoles = [...prev, role];
      }
      // URL 업데이트
      updateSearchParams(newRoles);
      return newRoles;
    });
  };

  // 개발 전체 선택/해제 핸들러
  const handleCategoryAllToggle = (categoryKey) => {
    const category = JOB_CATEGORIES[categoryKey];
    const categoryRoleValues = category.roles.map(r => r.value);
    const allSelected = categoryRoleValues.every(role => selectedRoles.includes(role));
    
    setSelectedRoles(prev => {
      let newRoles;
      if (allSelected) {
        // 모두 선택된 경우 해당 카테고리 roles 모두 제거
        newRoles = prev.filter(role => !categoryRoleValues.includes(role));
      } else {
        // 일부만 선택되거나 선택되지 않은 경우 해당 카테고리 roles 모두 추가
        const otherRoles = prev.filter(role => !categoryRoleValues.includes(role));
        newRoles = [...otherRoles, ...categoryRoleValues];
      }
      updateSearchParams(newRoles);
      return newRoles;
    });
  };

  // URL 파라미터 업데이트
  const updateSearchParams = (roles) => {
    const params = new URLSearchParams();
    roles.forEach(role => params.append('roles', role));
    setSearchParams(params);
  };

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
      
      <div className="content-wrapper">
        {/* 직무 필터 */}
        <aside className="job-filter-sidebar">
          <button className="filter-toggle" onClick={() => setIsFilterOpen(!isFilterOpen)}>
            <span>직군 필터</span>
            <span className={`arrow ${isFilterOpen ? 'open' : ''}`}>▼</span>
          </button>
          
          <div className={`job-filter-content ${isFilterOpen ? 'open' : ''}`}>
            <h2>직무 유형 선택</h2>
            
            {Object.entries(JOB_CATEGORIES).map(([categoryKey, category]) => (
              <div key={categoryKey} className="filter-category">
                <h3>{category.label}</h3>
                
                <div className="filter-options">
                  <label className="filter-checkbox">
                    <input
                      type="checkbox"
                      checked={category.roles.every(r => selectedRoles.includes(r.value))}
                      onChange={() => handleCategoryAllToggle(categoryKey)}
                    />
                    <span>전체 선택</span>
                  </label>
                  
                  {category.roles.map(role => (
                    <label key={role.value} className="filter-checkbox">
                      <input
                        type="checkbox"
                        checked={selectedRoles.includes(role.value)}
                        onChange={() => handleRoleToggle(role.value)}
                      />
                      <span>{role.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </aside>

        <div className="post-list-grid">
          {/* 불러온 posts 배열을 순회하며 PostCard를 렌더링 */}
          {posts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
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

export default PostList;