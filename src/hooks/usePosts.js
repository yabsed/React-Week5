import { useState, useEffect } from 'react';

const BASE_URL = 'https://api-internhasha.wafflestudio.com';

/**
 * 포스트 데이터를 가져오는 커스텀 훅
 * @param {Array} selectedRoles - 선택된 역할 배열
 * @returns {Object} { posts, loading, error }
 */
export function usePosts(selectedRoles) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 선택된 roles를 기반으로 API URL 구성
    let apiUrl = `${BASE_URL}/api/post`;
    if (selectedRoles.length > 0) {
      const rolesQuery = selectedRoles.map(role => `roles=${role}`).join('&');
      apiUrl += `?${rolesQuery}`;
    }

    setLoading(true);
    setError(null);
    
    // API로부터 포스트 목록을 불러옵니다.
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

  return { posts, loading, error };
}
