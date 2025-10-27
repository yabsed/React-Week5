import React from 'react';

// 직무 카테고리 정의
export const JOB_CATEGORIES = {
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
  },
};

// 도메인 목록
export const DOMAINS = [
  { value: 'FINTECH', label: '핀테크' },
  { value: 'HEALTHTECH', label: '헬스테크' },
  { value: 'EDUCATION', label: '교육' },
  { value: 'ECOMMERCE', label: '이커머스' },
  { value: 'FOODTECH', label: '푸드테크' },
  { value: 'MOBILITY', label: '모빌리티' },
  { value: 'CONTENTS', label: '콘텐츠' },
  { value: 'B2B', label: 'B2B' },
  { value: 'OTHERS', label: '기타' }
];

/**
 * 직무 필터 컴포넌트 (사이드바)
 */
function JobFilter({ 
  selectedRoles, 
  onRoleToggle, 
  onCategoryAllToggle,
  isFilterOpen, 
  onToggleFilter 
}) {
  return (
    <aside className="job-filter-sidebar">
      <button className="filter-toggle" onClick={onToggleFilter}>
        <span>직군 필터</span>
        <span className={`arrow ${isFilterOpen ? 'open' : ''}`}>▼</span>
      </button>
      
      <div className={`job-filter-content ${isFilterOpen ? 'open' : ''}`}>
        {/* 직무 유형 필터 */}
        <div className="filter-section">
          <h2>직무 유형 선택</h2>
          
          {Object.entries(JOB_CATEGORIES).map(([categoryKey, category]) => (
            <div key={categoryKey} className="filter-category">
              <h3>{category.label}</h3>
              
              <div className="filter-options">
                <label className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={category.roles.every(r => selectedRoles.includes(r.value))}
                    onChange={() => onCategoryAllToggle(categoryKey)}
                  />
                  <span>전체 선택</span>
                </label>
                
                {category.roles.map(role => (
                  <label key={role.value} className="filter-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedRoles.includes(role.value)}
                      onChange={() => onRoleToggle(role.value)}
                    />
                    <span>{role.label}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

export default JobFilter;
