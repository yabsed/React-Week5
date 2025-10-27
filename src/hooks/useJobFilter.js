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
  
  const [selectedDomains, setSelectedDomains] = useState(() => {
    // URL에서 domains 파라미터 읽기
    return searchParams.getAll('domains');
  });
  
  const [isActive, setIsActive] = useState(() => {
    // URL에서 isActive 파라미터 읽기
    const param = searchParams.get('isActive');
    if (param === 'true') return true;
    if (param === 'false') return false;
    return null; // 전체
  });
  
  const [order, setOrder] = useState(() => {
    // URL에서 order 파라미터 읽기
    const param = searchParams.get('order');
    return param ? parseInt(param, 10) : 0;
  });
  
  const [isFilterOpen, setIsFilterOpen] = useState(true);

  // URL 파라미터 업데이트
  const updateSearchParams = (roles, domains, activeState, orderValue) => {
    const params = new URLSearchParams();
    
    // roles 추가
    roles.forEach(role => params.append('roles', role));
    
    // domains 추가
    domains.forEach(domain => params.append('domains', domain));
    
    // isActive 추가 (null이 아닐 때만)
    if (activeState !== null) {
      params.set('isActive', activeState.toString());
    }
    
    // order 추가
    params.set('order', orderValue.toString());
    
    setSearchParams(params);
  };

  // 역할 선택/해제 핸들러
  const handleRoleToggle = (role) => {
    setSelectedRoles(prev => {
      const newRoles = prev.includes(role) 
        ? prev.filter(r => r !== role)
        : [...prev, role];
      
      updateSearchParams(newRoles, selectedDomains, isActive, order);
      return newRoles;
    });
  };

  // 카테고리 전체 선택/해제 핸들러
  const handleCategoryAllToggle = (categoryKey) => {
    const category = JOB_CATEGORIES[categoryKey];
    const categoryRoleValues = category.roles.map(r => r.value);
    const allSelected = categoryRoleValues.every(role => selectedRoles.includes(role));
    
    setSelectedRoles(prev => {
      const newRoles = allSelected
        ? prev.filter(role => !categoryRoleValues.includes(role))
        : [...prev.filter(role => !categoryRoleValues.includes(role)), ...categoryRoleValues];
      
      updateSearchParams(newRoles, selectedDomains, isActive, order);
      return newRoles;
    });
  };

  // 도메인 선택/해제 핸들러
  const handleDomainToggle = (domain) => {
    setSelectedDomains(prev => {
      const newDomains = prev.includes(domain)
        ? prev.filter(d => d !== domain)
        : [...prev, domain];
      
      updateSearchParams(selectedRoles, newDomains, isActive, order);
      return newDomains;
    });
  };

  // 모집 상태 변경 핸들러
  const handleIsActiveChange = (value) => {
    setIsActive(value);
    updateSearchParams(selectedRoles, selectedDomains, value, order);
  };

  // 정렬 변경 핸들러
  const handleOrderChange = (value) => {
    setOrder(value);
    updateSearchParams(selectedRoles, selectedDomains, isActive, value);
  };

  // 필터 토글 핸들러
  const handleToggleFilter = () => {
    setIsFilterOpen(prev => !prev);
  };

  return {
    selectedRoles,
    selectedDomains,
    isActive,
    order,
    isFilterOpen,
    handleRoleToggle,
    handleCategoryAllToggle,
    handleDomainToggle,
    handleIsActiveChange,
    handleOrderChange,
    handleToggleFilter
  };
}
