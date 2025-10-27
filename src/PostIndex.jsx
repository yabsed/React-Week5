import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import "./styles/common.css"; // 공통 CSS
import "./styles/postlist.css"; // 이 컴포넌트 전용 CSS
import PostCard from "./components/PostCard";
import JobFilter from "./components/JobFilter";
import TopFilters from "./components/TopFilters";
import { usePosts } from "./hooks/usePosts";
import { useJobFilter } from "./hooks/useJobFilter";

/**
 * 포스트 목록을 불러와서 그리드 형태로 보여주는 컴포넌트
 */
function PostList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const page = parseInt(searchParams.get("page") || "0", 10);

  useEffect(() => {
    const currentParams = Object.fromEntries(searchParams.entries());
    if (!currentParams.page) {
      navigate(`?page=0`, { replace: true });
    }
  }, [searchParams, navigate]);

  const setPage = (newPage) => {
    const currentParams = Object.fromEntries(searchParams.entries());
    setSearchParams({ ...currentParams, page: newPage });
  };
  // 직무 필터 관련 상태와 핸들러
  const {
    selectedRoles,
    selectedDomains,
    isActive,
    order,
    isFilterOpen,
    isStatusChanged,
    isDomainsChanged,
    isSortChanged,
    handleRoleToggle,
    handleCategoryAllToggle,
    handleDomainToggle,
    handleIsActiveChange,
    handleOrderChange,
    handleToggleFilter,
    handleResetFilters
  } = useJobFilter();

  // 포스트 데이터 가져오기
  const { posts, paginator, loading, error } = usePosts(selectedRoles, selectedDomains, isActive, order, page);

  // --- 상태별 렌더링 ---
  if (loading) {
    return <div className="loading">채용 공고를 불러오는 중...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  const renderPagination = () => {
    if (!paginator || paginator.lastPage <= 1) {
      return null;
    }

    const startPage = Math.floor(page / 5) * 5;
    const endPage = startPage + 5;

    // 이전 버튼 - 현재 페이지가 0보다 크면 활성화
    const hasPrev = page > 0;
    
    // 다음 버튼 - 현재 페이지가 마지막 페이지보다 작으면 활성화
    const hasNext = page < paginator.lastPage - 1;

    return (
      <div className="pagination">
        <button 
          onClick={() => hasPrev && setPage(page - 1)}
          disabled={!hasPrev}
          className="pagination-nav"
        >
          &lt; 이전
        </button>
        
        {Array.from({ length: 5 }, (_, i) => {
          const pageNum = startPage + i;
          const isDisabled = pageNum >= paginator.lastPage;
          return (
            <button
              key={pageNum}
              onClick={() => !isDisabled && setPage(pageNum)}
              className={`pagination-number ${page === pageNum ? "active" : ""} ${isDisabled ? "disabled" : ""}`}
              disabled={isDisabled}
            >
              {pageNum + 1}
            </button>
          );
        })}

        <button 
          onClick={() => hasNext && setPage(page + 1)}
          disabled={!hasNext}
          className="pagination-nav"
        >
          다음 &gt;
        </button>
      </div>
    );
  }

  return (
    <div className="post-list-container">
      <h1>채용 공고</h1>
      
      <div className="content-wrapper">
        {/* 직군 필터 (사이드바) */}
        <JobFilter
          selectedRoles={selectedRoles}
          onRoleToggle={handleRoleToggle}
          onCategoryAllToggle={handleCategoryAllToggle}
          isFilterOpen={isFilterOpen}
          onToggleFilter={handleToggleFilter}
        />

        <div className="main-content">
          {/* 상단 필터 (모집상태, 업종, 정렬) */}
          <TopFilters
            selectedDomains={selectedDomains}
            onDomainToggle={handleDomainToggle}
            isActive={isActive}
            onIsActiveChange={handleIsActiveChange}
            order={order}
            onOrderChange={handleOrderChange}
            onResetFilters={handleResetFilters}
            isStatusChanged={isStatusChanged}
            isDomainsChanged={isDomainsChanged}
            isSortChanged={isSortChanged}
          />

          <div className="post-list-grid">
            {/* 불러온 posts 배열을 순회하며 PostCard를 렌더링 */}
            {posts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
          {renderPagination()}
        </div>
      </div>
    </div>
  );
}

export default PostList;
