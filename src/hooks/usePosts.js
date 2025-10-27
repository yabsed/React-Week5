import { useState, useEffect } from 'react';

const BASE_URL = 'https://api-internhasha.wafflestudio.com';

/**
 * 포스트 데이터를 가져오는 커스텀 훅
 * @param {Array} selectedRoles - 선택된 역할 배열
 * @param {Array} selectedDomains - 선택된 도메인 배열
 * @param {boolean|null} isActive - 모집 상태 (true: 모집중만, null: 전체)
 * @param {number} order - 정렬 방식 (0: 최신순, 1: 마감순)
 * @returns {Object} { posts, loading, error }
 */
export function usePosts(selectedRoles, selectedDomains, isActive, order, page) {
  const [posts, setPosts] = useState([]);
  const [paginator, setPaginator] = useState({ lastPage: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // API URL 구성
    let apiUrl = `${BASE_URL}/api/post`;
    const params = new URLSearchParams();
    
    // roles 추가
    selectedRoles.forEach(role => params.append('roles', role));
    
    // domains 추가
    selectedDomains.forEach(domain => params.append('domains', domain));
    
    // isActive 추가 (null이 아닐 때만)
    if (isActive !== null) {
      params.set('isActive', isActive.toString());
    }
    
    // order 추가
    params.set('order', order.toString());

    // page 추가
    params.set('page', page.toString());
    
    const queryString = params.toString();
    if (queryString) {
      apiUrl += `?${queryString}`;
    }

    setLoading(true);
    setError(null);
    
    // 로그인 토큰 가져오기
    const token = localStorage.getItem('token');
    
    // API로부터 포스트 목록을 불러옵니다.
    const headers = {
      'Content-Type': 'application/json'
    };
    
    // 토큰이 있으면 헤더에 추가
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    fetch(apiUrl, { headers })
      .then(res => {
        if (res.status === 401) {
          // 토큰이 만료된 경우
          localStorage.removeItem('token');
          window.location.reload(); // 페이지 새로고침하여 로그아웃 상태 반영
          throw new Error('로그인이 만료되었습니다. 다시 로그인해주세요.');
        }
        if (!res.ok) {
          throw new Error('데이터를 불러오는 데 실패했습니다.');
        }
        return res.json();
      })
      .then(data => {
        setPosts(data.posts); // JSON 응답의 'posts' 배열을 상태에 저장
        setPaginator(data.paginator);
      })
      .catch(err => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [selectedRoles, selectedDomains, isActive, order, page]); // 의존성 배열에 모든 필터 추가

  return { posts, paginator, loading, error };
}
