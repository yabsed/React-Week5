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

/**
 * 직무 필터 컴포넌트
 * @param {Array} selectedRoles - 선택된 역할 배열
 * @param {Function} onRoleToggle - 역할 선택/해제 핸들러
 * @param {Function} onCategoryAllToggle - 카테고리 전체 선택/해제 핸들러
 * @param {boolean} isFilterOpen - 필터 열림/닫힘 상태
 * @param {Function} onToggleFilter - 필터 토글 핸들러
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
    </aside>
  );
}

export default JobFilter;
