import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { JOB_CATEGORIES } from '../components/JobFilter';

/**
 * 직무 필터 로직을 관리하는 커스텀 훅
 * @returns {Object} 필터 상태와 핸들러들
 */
export function useJobFilter() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [selectedRoles, setSelectedRoles] = useState(() => {
    // URL 우선, 없으면 localStorage에서 읽기
    const urlRoles = searchParams.getAll('roles');
    if (urlRoles.length > 0) return urlRoles;
    
    const stored = localStorage.getItem('filterState');
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.selectedRoles || [];
    }
    return [];
  });
  
  const [selectedDomains, setSelectedDomains] = useState(() => {
    // URL 우선, 없으면 localStorage에서 읽기
    const urlDomains = searchParams.getAll('domains');
    if (urlDomains.length > 0) return urlDomains;
    
    const stored = localStorage.getItem('filterState');
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.selectedDomains || [];
    }
    return [];
  });
  
  const [isActive, setIsActive] = useState(() => {
    // URL 우선, 없으면 localStorage에서 읽기
    const urlParam = searchParams.get('isActive');
    if (urlParam === 'true') return true;
    if (urlParam === 'false') return false;
    
    const stored = localStorage.getItem('filterState');
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.isActive !== undefined ? parsed.isActive : null;
    }
    return null; // 전체
  });
  
  const [order, setOrder] = useState(() => {
    // URL 우선, 없으면 localStorage에서 읽기
    const urlParam = searchParams.get('order');
    if (urlParam) return parseInt(urlParam, 10);
    
    const stored = localStorage.getItem('filterState');
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.order !== undefined ? parsed.order : 0;
    }
    return 0;
  });
  
  const [isFilterOpen, setIsFilterOpen] = useState(true);

  // 필터 상태를 localStorage에 저장
  useEffect(() => {
    const filterState = {
      selectedRoles,
      selectedDomains,
      isActive,
      order
    };
    localStorage.setItem('filterState', JSON.stringify(filterState));
  }, [selectedRoles, selectedDomains, isActive, order]);

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

  // 전체 초기화 핸들러 (모집상태, 도메인, 정렬만 초기화, 직군은 유지)
  const handleResetFilters = () => {
    // 변경사항이 있는지 확인
    const hasChanges = selectedDomains.length > 0 || isActive !== null || order !== 0;
    
    // 변경사항이 없으면 아무것도 하지 않음
    if (!hasChanges) {
      return;
    }
    
    // 모든 도메인 선택 해제
    setSelectedDomains([]);
    // 모집상태를 전체로
    setIsActive(null);
    // 정렬을 최신순으로
    setOrder(0);
    
    // URL 업데이트 (roles와 page는 유지)
    const currentPage = searchParams.get('page');
    const params = new URLSearchParams();
    
    // roles 유지
    selectedRoles.forEach(role => params.append('roles', role));
    
    // order 초기값 추가
    params.set('order', '0');
    
    // 현재 페이지 유지
    if (currentPage) {
      params.set('page', currentPage);
    }
    
    setSearchParams(params);
  };

  // 각 필터가 기본값에서 변경되었는지 확인
  const isStatusChanged = isActive !== null;
  const isDomainsChanged = selectedDomains.length > 0;
  const isSortChanged = order !== 0;

  return {
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
  };
}
