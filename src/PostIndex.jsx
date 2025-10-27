import React from "react";
import "./styles/common.css"; // 공통 CSS
import "./styles/postlist.css"; // 이 컴포넌트 전용 CSS
import PostCard from "./components/PostCard";
import JobFilter from "./components/JobFilter";
import { usePosts } from "./hooks/usePosts";
import { useJobFilter } from "./hooks/useJobFilter";

/**
 * 포스트 목록을 불러와서 그리드 형태로 보여주는 컴포넌트
 */
function PostList() {
  // 직무 필터 관련 상태와 핸들러
  const {
    selectedRoles,
    isFilterOpen,
    handleRoleToggle,
    handleCategoryAllToggle,
    handleToggleFilter
  } = useJobFilter();

  // 포스트 데이터 가져오기
  const { posts, loading, error } = usePosts(selectedRoles);

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
        <JobFilter
          selectedRoles={selectedRoles}
          onRoleToggle={handleRoleToggle}
          onCategoryAllToggle={handleCategoryAllToggle}
          isFilterOpen={isFilterOpen}
          onToggleFilter={handleToggleFilter}
        />

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

export default PostList;
