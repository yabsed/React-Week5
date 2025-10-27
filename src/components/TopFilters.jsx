import React, { useState } from 'react';
import { DOMAINS } from './JobFilter';

/**
 * 상단 필터 컴포넌트 (모집상태, 도메인, 정렬)
 */
function TopFilters({
  selectedDomains,
  onDomainToggle,
  isActive,
  onIsActiveChange,
  order,
  onOrderChange,
  onResetFilters,
  isStatusChanged,
  isDomainsChanged,
  isSortChanged
}) {
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isDomainOpen, setIsDomainOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  // 모집상태 라벨
  const getStatusLabel = () => {
    if (isActive === true) return '모집중';
    return '모집 상태';
  };

  // 정렬 라벨
  const getSortLabel = () => {
    if (order === 1) return '마감순';
    return '최신순';
  };

  // 도메인 전체 선택/해제
  const handleDomainAllToggle = () => {
    const allSelected = DOMAINS.every(d => selectedDomains.includes(d.value));
    if (allSelected) {
      // 전체 해제
      DOMAINS.forEach(d => {
        if (selectedDomains.includes(d.value)) {
          onDomainToggle(d.value);
        }
      });
    } else {
      // 전체 선택
      DOMAINS.forEach(d => {
        if (!selectedDomains.includes(d.value)) {
          onDomainToggle(d.value);
        }
      });
    }
  };

  // 초기화 버튼
  const handleReset = () => {
    // 모든 도메인 선택 해제
    selectedDomains.forEach(domain => onDomainToggle(domain));
  };

  // 적용 버튼 (드롭다운 닫기)
  const handleApply = () => {
    setIsDomainOpen(false);
  };

  return (
    <div className="top-filters">
      <div className="top-filters-row">
        {/* 모집 상태 드롭다운 */}
        <div className="filter-dropdown">
          <button 
            className={`filter-dropdown-toggle ${isStatusChanged ? 'changed' : ''}`}
            onClick={() => {
              setIsStatusOpen(!isStatusOpen);
              setIsDomainOpen(false);
              setIsSortOpen(false);
            }}
          >
            <span>{getStatusLabel()}</span>
            <span className="arrow">▼</span>
          </button>
          
          {isStatusOpen && (
            <div className="filter-dropdown-menu">
              <label className="filter-dropdown-option">
                <input
                  type="radio"
                  name="status"
                  checked={isActive === null}
                  onChange={() => {
                    onIsActiveChange(null);
                    setIsStatusOpen(false);
                  }}
                />
                <span>전체</span>
              </label>
              <label className="filter-dropdown-option">
                <input
                  type="radio"
                  name="status"
                  checked={isActive === true}
                  onChange={() => {
                    onIsActiveChange(true);
                    setIsStatusOpen(false);
                  }}
                />
                <span>모집중</span>
              </label>
            </div>
          )}
        </div>

        {/* 도메인 드롭다운 */}
        <div className="filter-dropdown">
          <button 
            className={`filter-dropdown-toggle ${isDomainsChanged ? 'changed' : ''}`}
            onClick={() => {
              setIsDomainOpen(!isDomainOpen);
              setIsStatusOpen(false);
              setIsSortOpen(false);
            }}
          >
            <span>업종</span>
            <span className="arrow">▼</span>
          </button>
          
          {isDomainOpen && (
            <div className="filter-dropdown-menu domain-menu">
              <label className="filter-dropdown-option">
                <input
                  type="checkbox"
                  checked={DOMAINS.every(d => selectedDomains.includes(d.value))}
                  onChange={handleDomainAllToggle}
                />
                <span>전체</span>
              </label>
              {DOMAINS.map(domain => (
                <label key={domain.value} className="filter-dropdown-option">
                  <input
                    type="checkbox"
                    checked={selectedDomains.includes(domain.value)}
                    onChange={() => onDomainToggle(domain.value)}
                  />
                  <span>{domain.label}</span>
                </label>
              ))}
              <div className="dropdown-actions">
                <button className="btn-reset" onClick={handleReset}>초기화</button>
                <button className="btn-apply" onClick={handleApply}>적용</button>
              </div>
            </div>
          )}
        </div>

        {/* 정렬 드롭다운 */}
        <div className="filter-dropdown">
          <button 
            className={`filter-dropdown-toggle ${isSortChanged ? 'changed' : ''}`}
            onClick={() => {
              setIsSortOpen(!isSortOpen);
              setIsStatusOpen(false);
              setIsDomainOpen(false);
            }}
          >
            <span>{getSortLabel()}</span>
            <span className="arrow">▼</span>
          </button>
          
          {isSortOpen && (
            <div className="filter-dropdown-menu">
              <label className="filter-dropdown-option">
                <input
                  type="radio"
                  name="sort"
                  checked={order === 0}
                  onChange={() => {
                    onOrderChange(0);
                    setIsSortOpen(false);
                  }}
                />
                <span>최신순</span>
              </label>
              <label className="filter-dropdown-option">
                <input
                  type="radio"
                  name="sort"
                  checked={order === 1}
                  onChange={() => {
                    onOrderChange(1);
                    setIsSortOpen(false);
                  }}
                />
                <span>마감순</span>
              </label>
            </div>
          )}
        </div>
      </div>

      {/* 전체 초기화 버튼 */}
      <button className="btn-reset-all" onClick={onResetFilters}>
        <span className="refresh-icon">↻</span> 초기화
      </button>
    </div>
  );
}

export default TopFilters;
