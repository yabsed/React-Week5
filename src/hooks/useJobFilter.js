import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { JOB_CATEGORIES } from '../components/JobFilter';

/**
 * 직무 필터 로직을 관리하는 커스텀 훅
 * @returns {Object} 필터 상태와 핸들러들
 */
export function useJobFilter() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [selectedRoles, setSelectedRoles] = useState(() => {
    // URL에서 roles 파라미터 읽기
    return searchParams.getAll('roles');
  });
  
  const [isFilterOpen, setIsFilterOpen] = useState(true);

  // URL 파라미터 업데이트
  const updateSearchParams = (roles) => {
    const params = new URLSearchParams();
    roles.forEach(role => params.append('roles', role));
    setSearchParams(params);
  };

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

  // 카테고리 전체 선택/해제 핸들러
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

  // 필터 토글 핸들러
  const handleToggleFilter = () => {
    setIsFilterOpen(prev => !prev);
  };

  return {
    selectedRoles,
    isFilterOpen,
    handleRoleToggle,
    handleCategoryAllToggle,
    handleToggleFilter
  };
}
