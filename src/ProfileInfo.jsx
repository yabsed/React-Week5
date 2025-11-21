import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './styles/mypage.css';

const BASE_URL = 'https://api-internhasha.wafflestudio.com';

export default function ProfileInfo({ editMode = false }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('bookmarks'); // 'bookmarks' | 'profile'
  const [bookmarks, setBookmarks] = useState([]);
  const [profile, setProfile] = useState(null);
  const [profileNotFound, setProfileNotFound] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 프로필 편집 모드
  const [isEditing, setIsEditing] = useState(editMode);
  const [formData, setFormData] = useState({
    enrollYear: '',
    departments: [''],
    cvFile: null,
    cvFileName: '',
    // 선택 스펙
    positions: [''],
    stacks: [],
    stackInput: '',
    slogan: '',
    explanation: '',
    links: []
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const token = localStorage.getItem('token');

  // 북마크 목록 조회
  const fetchBookmarks = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/post/bookmarks`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.status === 401) {
        localStorage.removeItem('token');
        throw new Error('로그인이 만료되었습니다.');
      }
      if (!res.ok) throw new Error('북마크 목록을 불러오는데 실패했습니다.');
      const data = await res.json();
      setBookmarks(data.posts || []);
    } catch (err) {
      setError(err.message);
    }
  };

  // 프로필 조회
  const fetchProfile = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/applicant/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.status === 401) {
        localStorage.removeItem('token');
        throw new Error('로그인이 만료되었습니다.');
      }

      const data = await res.json();

      // APPLICANT_002 에러코드면 프로필 없음
      if (data.code === 'APPLICANT_002' || res.status === 404) {
        setProfileNotFound(true);
        setProfile(null);
        return;
      }

      if (!res.ok) throw new Error('프로필을 불러오는데 실패했습니다.');

      setProfile(data);
      setProfileNotFound(false);

      // 수정 모드일 경우 기존 데이터 로드
      if (editMode && data) {
        const depts = data.department ? data.department.split(',') : [''];
        const yearStr = data.enrollYear ? String(data.enrollYear).slice(-2) : '';
        setFormData({
          enrollYear: yearStr,
          departments: depts.length > 0 ? depts : [''],
          cvFile: null,
          cvFileName: '',
          positions: data.positions?.length > 0 ? data.positions : [''],
          stacks: data.stacks || [],
          stackInput: '',
          slogan: data.slogan || '',
          explanation: data.explanation || '',
          links: data.links || []
        });
      }
    } catch (err) {
      if (!err.message.includes('404')) {
        setError(err.message);
      }
    }
  };

  useEffect(() => {
    if (!token) {
      setError('로그인이 필요합니다.');
      setLoading(false);
      return;
    }

    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchBookmarks(), fetchProfile()]);
      setLoading(false);
    };
    loadData();
  }, []);

  // 학번 -> 연도 변환 (2자리 -> 4자리)
  const convertToFullYear = (twoDigit) => {
    const num = parseInt(twoDigit, 10);
    if (num >= 0 && num <= 25) {
      return 2000 + num;
    } else {
      return 1900 + num;
    }
  };

  // 학번 유효성 검사 (2자리 숫자)
  const validateEnrollYear = (value) => {
    if (!value) return '학번을 입력해주세요.';
    if (!/^\d{2}$/.test(value)) return '두 자리 수 숫자로 작성해주세요. (e.g. 25)';
    return '';
  };

  // 학과 유효성 검사
  const validateDepartments = (depts) => {
    if (!depts[0] || depts[0].trim() === '') return '주전공은 필수 작성이며, 다전공은 총 6개 이하로 중복되지 않게 입력해주세요.';

    const filtered = depts.filter(d => d.trim() !== '');
    const unique = new Set(filtered);
    if (unique.size !== filtered.length) return '주전공은 필수 작성이며, 다전공은 총 6개 이하로 중복되지 않게 입력해주세요.';
    if (filtered.length > 7) return '주전공은 필수 작성이며, 다전공은 총 6개 이하로 중복되지 않게 입력해주세요.';

    return '';
  };

  // 파일 유효성 검사 (PDF, 5MB 이하)
  const validateFile = (file, isRequired) => {
    if (!file && isRequired) return '5MB 이하의 PDF 파일을 올려주세요.';
    if (!file) return '';
    if (file.type !== 'application/pdf') return '5MB 이하의 PDF 파일을 올려주세요.';
    if (file.size > 5 * 1024 * 1024) return '5MB 이하의 PDF 파일을 올려주세요.';
    return '';
  };

  const handleEnrollYearChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 2);
    setFormData(prev => ({ ...prev, enrollYear: value }));
    setFormErrors(prev => ({ ...prev, enrollYear: '' }));
  };

  const handleDepartmentChange = (index, value) => {
    const newDepts = [...formData.departments];
    newDepts[index] = value;
    setFormData(prev => ({ ...prev, departments: newDepts }));
    setFormErrors(prev => ({ ...prev, departments: '' }));
  };

  const addDepartment = () => {
    if (formData.departments.length < 7) {
      setFormData(prev => ({ ...prev, departments: [...prev.departments, ''] }));
    }
  };

  const removeDepartment = (index) => {
    if (index > 0) {
      const newDepts = formData.departments.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, departments: newDepts }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        setFormErrors(prev => ({ ...prev, cvFile: '5MB 이하의 PDF 파일을 올려주세요.' }));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setFormErrors(prev => ({ ...prev, cvFile: '5MB 이하의 PDF 파일을 올려주세요.' }));
        return;
      }
      setFormData(prev => ({ ...prev, cvFile: file, cvFileName: file.name }));
      setFormErrors(prev => ({ ...prev, cvFile: '' }));
    }
  };

  const removeFile = () => {
    setFormData(prev => ({ ...prev, cvFile: null, cvFileName: '' }));
  };

  // 희망직무 핸들러
  const handlePositionChange = (index, value) => {
    if (value.length > 100) return;
    const newPositions = [...formData.positions];
    newPositions[index] = value;
    setFormData(prev => ({ ...prev, positions: newPositions }));
    setFormErrors(prev => ({ ...prev, positions: '' }));
  };

  const addPosition = () => {
    const filtered = formData.positions.filter(p => p.trim() !== '');
    const unique = new Set(filtered);
    if (unique.size !== filtered.length) {
      setFormErrors(prev => ({ ...prev, positions: '중복되지 않는 100자 이내 직무명을 작성해주세요.' }));
      return;
    }
    setFormData(prev => ({ ...prev, positions: [...prev.positions, ''] }));
  };

  const removePosition = (index) => {
    const newPositions = formData.positions.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, positions: newPositions.length > 0 ? newPositions : [''] }));
  };

  // 기술스택 핸들러
  const handleStackInputChange = (e) => {
    setFormData(prev => ({ ...prev, stackInput: e.target.value }));
    setFormErrors(prev => ({ ...prev, stacks: '' }));
  };

  const handleStackKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const value = formData.stackInput.trim();
      if (!value) return;
      if (value.length > 30) {
        setFormErrors(prev => ({ ...prev, stacks: '기술 스택은 엔터로 구분되며 한 개당 최대 30자까지 입력할 수 있어요.' }));
        return;
      }
      if (formData.stacks.includes(value)) {
        setFormErrors(prev => ({ ...prev, stacks: '기존 태그와 중복되지 않는 30자 이하의 기술 스택을 작성해주세요.' }));
        return;
      }
      if (formData.stacks.length >= 10) {
        setFormErrors(prev => ({ ...prev, stacks: '최대 10개까지 입력 가능합니다.' }));
        return;
      }
      setFormData(prev => ({ ...prev, stacks: [...prev.stacks, value], stackInput: '' }));
    }
  };

  const removeStack = (index) => {
    setFormData(prev => ({ ...prev, stacks: prev.stacks.filter((_, i) => i !== index) }));
  };

  // 한줄소개 핸들러
  const handleSloganChange = (e) => {
    if (e.target.value.length <= 100) {
      setFormData(prev => ({ ...prev, slogan: e.target.value }));
    }
  };

  // 자기소개 핸들러
  const handleExplanationChange = (e) => {
    if (e.target.value.length <= 5000) {
      setFormData(prev => ({ ...prev, explanation: e.target.value }));
    }
  };

  // 기타소개 링크 핸들러
  const addLink = () => {
    setFormData(prev => ({ ...prev, links: [...prev.links, { description: '', link: '' }] }));
  };

  const handleLinkChange = (index, field, value) => {
    const newLinks = [...formData.links];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setFormData(prev => ({ ...prev, links: newLinks }));
    setFormErrors(prev => ({ ...prev, links: '' }));
  };

  const removeLink = (index) => {
    setFormData(prev => ({ ...prev, links: prev.links.filter((_, i) => i !== index) }));
  };

  const validateLinks = () => {
    for (const link of formData.links) {
      if (link.link && !link.link.startsWith('https://')) {
        return '링크는 https://로 시작해야 합니다.';
      }
      if (link.description && link.description.length > 100) {
        return '링크 제목은 100자 이내로 작성해주세요.';
      }
    }
    const linkUrls = formData.links.map(l => l.link).filter(l => l);
    const uniqueUrls = new Set(linkUrls);
    if (uniqueUrls.size !== linkUrls.length) {
      return '중복되지 않는 유효한 링크와 100자 이내의 설명글을 입력해주세요.';
    }
    return '';
  };

  // 랜덤 문자열 생성
  const generateRandomString = (length) => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 전체 유효성 검사
    const isCreating = profileNotFound;
    const errors = {
      enrollYear: validateEnrollYear(formData.enrollYear),
      departments: validateDepartments(formData.departments),
      cvFile: validateFile(formData.cvFile, isCreating && !formData.cvFileName)
    };

    setFormErrors(errors);

    if (errors.enrollYear || errors.departments || errors.cvFile) {
      return;
    }

    setSubmitting(true);

    try {
      const fullYear = convertToFullYear(formData.enrollYear);
      const departmentStr = formData.departments.filter(d => d.trim() !== '').join(',');

      // cvKey 생성
      let cvKey = profile?.cvKey || '';
      if (formData.cvFile) {
        const today = new Date();
        const dateStr = today.getFullYear().toString() +
          String(today.getMonth() + 1).padStart(2, '0') +
          String(today.getDate()).padStart(2, '0');
        cvKey = `static/private/CV/${generateRandomString(10)}_${dateStr}/${formData.cvFile.name}`;
      }

      // 선택 스펙 링크 유효성 검사
      const linkError = validateLinks();
      if (linkError) {
        setFormErrors(prev => ({ ...prev, links: linkError }));
        setSubmitting(false);
        return;
      }

      const bodyData = {
        enrollYear: fullYear,
        department: departmentStr,
        cvKey: cvKey,
        positions: formData.positions.filter(p => p.trim() !== ''),
        stacks: formData.stacks,
        slogan: formData.slogan,
        explanation: formData.explanation,
        links: formData.links.filter(l => l.link && l.description)
      };

      const res = await fetch(`${BASE_URL}/api/applicant/me`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bodyData)
      });

      if (res.status === 401) {
        localStorage.removeItem('token');
        throw new Error('로그인이 만료되었습니다.');
      }
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || '프로필 저장에 실패했습니다.');
      }

      await fetchProfile();
      setIsEditing(false);
      navigate('/React-Week5/mypage');
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const startEditing = () => {
    if (profile) {
      const depts = profile.department ? profile.department.split(',') : [''];
      const yearStr = profile.enrollYear ? String(profile.enrollYear).slice(-2) : '';
      setFormData({
        enrollYear: yearStr,
        departments: depts.length > 0 ? depts : [''],
        cvFile: null,
        cvFileName: '',
        positions: profile.positions?.length > 0 ? profile.positions : [''],
        stacks: profile.stacks || [],
        stackInput: '',
        slogan: profile.slogan || '',
        explanation: profile.explanation || '',
        links: profile.links || []
      });
    } else {
      setFormData({
        enrollYear: '',
        departments: [''],
        cvFile: null,
        cvFileName: '',
        positions: [''],
        stacks: [],
        stackInput: '',
        slogan: '',
        explanation: '',
        links: []
      });
    }
    setFormErrors({});
    setIsEditing(true);
  };

  const goBack = () => {
    setIsEditing(false);
    navigate('/React-Week5/mypage');
  };

  // 마감 상태 계산
  const getDeadlineStatus = (endDate) => {
    if (!endDate) return { text: '상시모집', color: 'blue' };

    const now = new Date();
    const end = new Date(endDate);
    const diffTime = end - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { text: '마감', color: 'red' };
    if (diffDays === 0) return { text: 'D-Day', color: 'blue' };
    return { text: `D-${diffDays}`, color: 'blue' };
  };

  if (loading) return <div className="loading">불러오는 중...</div>;
  if (error) return <div className="card form-card form-error">{error}</div>;

  // 프로필 편집/생성 화면
  if (isEditing || editMode) {
    return (
      <div className="mypage-container">
        <h1 className="mypage-title">{profileNotFound ? '프로필 생성' : '프로필 수정'}</h1>

        <form className="profile-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <h2 className="form-section-title">필수 작성 항목</h2>
            <p className="form-section-desc">아래 항목은 필수로 작성해주세요.</p>
          </div>

          {/* 학번 */}
          <div className="form-group">
            <label>학번 <span className="required">*</span></label>
            <div className="input-with-suffix">
              <input
                type="text"
                className="form-input"
                value={formData.enrollYear}
                onChange={handleEnrollYearChange}
                placeholder="25"
                maxLength={2}
              />
              <span className="input-suffix">학번</span>
            </div>
            {formErrors.enrollYear && <div className="form-error-text">{formErrors.enrollYear}</div>}
          </div>

          {/* 학과 */}
          <div className="form-group">
            <label>학과 <span className="required">*</span></label>
            {formData.departments.map((dept, index) => (
              <div key={index} className="department-input-row">
                <input
                  type="text"
                  className="form-input"
                  value={dept}
                  onChange={(e) => handleDepartmentChange(index, e.target.value)}
                  placeholder={index === 0 ? "주전공 학과명을 입력해주세요. (예시: 컴퓨터공학부, 경제학부 등)" : "다전공 학과명을 입력해주세요. (예시: 컴퓨터공학부, 경제학부 등)"}
                />
                {index > 0 && (
                  <button type="button" className="btn-delete" onClick={() => removeDepartment(index)}>삭제</button>
                )}
              </div>
            ))}
            <button type="button" className="btn-add" onClick={addDepartment} disabled={formData.departments.length >= 7}>추가</button>
            {formErrors.departments && <div className="form-error-text">{formErrors.departments}</div>}
          </div>

          {/* 이력서 */}
          <div className="form-group">
            <label>이력서 (CV) <span className="required">*</span></label>
            {formData.cvFileName ? (
              <div className="file-uploaded">
                <span className="file-name">{formData.cvFileName}</span>
                <button type="button" className="btn-delete" onClick={removeFile}>삭제</button>
              </div>
            ) : (
              <label className="file-upload-area">
                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
                <span className="file-upload-icon">📄</span>
                <span>PDF 파일만 업로드 가능해요.</span>
              </label>
            )}
            {formErrors.cvFile && <div className="form-error-text">{formErrors.cvFile}</div>}
          </div>

          {/* 선택 작성 항목 */}
          <div className="form-section" style={{ marginTop: '40px' }}>
            <h2 className="form-section-title">선택 작성 항목</h2>
            <p className="form-section-desc">아래 항목은 필수로 작성하지 않아도 괜찮지만, 작성해 주시면 채용 담당자가 나의 프로필에 관심을 가질때에 더 많이 도움이 돼요.</p>
          </div>

          {/* 희망 직무 */}
          <div className="form-group">
            <label>희망 직무</label>
            {formData.positions.map((pos, index) => (
              <div key={index} className="department-input-row">
                <input
                  type="text"
                  className="form-input"
                  value={pos}
                  onChange={(e) => handlePositionChange(index, e.target.value)}
                  placeholder="희망 직무명을 입력해주세요. (예시: 웹 프론트)"
                  maxLength={100}
                />
                <button type="button" className="btn-delete" onClick={() => removePosition(index)}>삭제</button>
              </div>
            ))}
            <button type="button" className="btn-add" onClick={addPosition}>추가</button>
            {formErrors.positions && <div className="form-error-text">{formErrors.positions}</div>}
          </div>

          {/* 기술 스택 */}
          <div className="form-group">
            <label>기술 스택</label>
            <input
              type="text"
              className="form-input"
              value={formData.stackInput}
              onChange={handleStackInputChange}
              onKeyDown={handleStackKeyDown}
              placeholder="사용할 수 있는 상세 기술 스택을 입력해주세요.(최대 10"
            />
            <p className="form-hint">기술 스택은 엔터로 구분되며 한 개당 최대 30자까지 입력할 수 있어요.</p>
            {formData.stacks.length > 0 && (
              <div className="stack-tags">
                {formData.stacks.map((stack, index) => (
                  <span key={index} className="stack-tag">
                    {stack} <button type="button" onClick={() => removeStack(index)}>×</button>
                  </span>
                ))}
              </div>
            )}
            {formErrors.stacks && <div className="form-error-text">{formErrors.stacks}</div>}
          </div>

          {/* 한 줄 소개 */}
          <div className="form-group">
            <label>한 줄 소개</label>
            <input
              type="text"
              className="form-input"
              value={formData.slogan}
              onChange={handleSloganChange}
              placeholder="한 줄 소개를 입력해주세요."
              maxLength={100}
            />
            <p className="form-hint">나를 소개하는 한마디를 입력해주세요.</p>
            <p className="form-hint" style={{ color: formData.slogan.length >= 100 ? '#dc3545' : '#888' }}>
              한 줄 소개는 100자 이내로 작성해주세요. {formData.slogan.length}/100
            </p>
          </div>

          {/* 자기소개 */}
          <div className="form-group">
            <label>자기소개</label>
            <textarea
              className="form-input form-textarea"
              value={formData.explanation}
              onChange={handleExplanationChange}
              placeholder="자신에 대한 상세 소개를 작성해주세요."
              rows={6}
              maxLength={5000}
            />
            <p className="form-hint" style={{ color: formData.explanation.length >= 5000 ? '#dc3545' : '#888' }}>
              상세 소개는 5000자 이내로 작성해주세요. {formData.explanation.length}/5000
            </p>
          </div>

          {/* 기타 소개 링크 */}
          <div className="form-group">
            <label>기타 소개 링크</label>
            {formData.links.map((linkItem, index) => (
              <div key={index} className="link-input-group">
                <input
                  type="text"
                  className="form-input"
                  value={linkItem.description}
                  onChange={(e) => handleLinkChange(index, 'description', e.target.value)}
                  placeholder="링크 제목을 작성해주세요. (e.g. 깃허브)"
                  maxLength={100}
                />
                <input
                  type="text"
                  className="form-input"
                  value={linkItem.link}
                  onChange={(e) => handleLinkChange(index, 'link', e.target.value)}
                  placeholder="https://"
                />
                <button type="button" className="btn-delete" onClick={() => removeLink(index)}>삭제</button>
              </div>
            ))}
            <button type="button" className="btn-add" onClick={addLink}>추가</button>
            <p className="form-hint">깃허브, 링크드인, 개인 홈페이지 등 자신을 소개할 수 있는 기타 링크를 첨부해주세요.</p>
            {formErrors.links && <div className="form-error-text">{formErrors.links}</div>}
          </div>

          {/* 버튼 */}
          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? '저장 중...' : '저장'}
            </button>
            <button type="button" className="btn-secondary" onClick={goBack}>
              뒤로가기
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="mypage-container">
      <h1 className="mypage-title">마이페이지</h1>

      {/* 탭 네비게이션 */}
      <div className="mypage-tabs">
        <button
          className={`mypage-tab ${activeTab === 'bookmarks' ? 'active' : ''}`}
          onClick={() => setActiveTab('bookmarks')}
        >
          관심공고
        </button>
        <button
          className={`mypage-tab ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          내 정보
        </button>
        {activeTab === 'profile' && (
          <button className="btn-profile-action" onClick={startEditing}>
            {profileNotFound ? '내 프로필 생성' : '내 프로필 수정'}
          </button>
        )}
      </div>

      {/* 탭 콘텐츠 */}
      <div className="mypage-content">
        {activeTab === 'bookmarks' && (
          <div className="bookmarks-section">
            {bookmarks.length === 0 ? (
              <div className="empty-state">
                <p>북마크한 공고가 없습니다.</p>
                <Link to="/React-Week5" className="button button-strong">공고 둘러보기</Link>
              </div>
            ) : (
              <div className="bookmarks-list">
                {bookmarks.map(post => {
                  const deadline = getDeadlineStatus(post.employmentEndDate);
                  return (
                    <div key={post.id} className="bookmark-item">
                      <div className="bookmark-icon"></div>
                      <div className="bookmark-company">{post.companyName}</div>
                      <div className="bookmark-right">
                        <div className="bookmark-position">{post.positionTitle}</div>
                        <div className={`bookmark-deadline ${deadline.color}`}>{deadline.text}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="profile-section">
            {profileNotFound ? (
              <div className="empty-state">
                <h3>아직 프로필이 등록되지 않았어요!</h3>
                <p>기업에 소개할 나의 정보를 작성해서 나를 소개해보세요.</p>
                <button className="btn-primary-large" onClick={startEditing}>
                  지금 바로 프로필 작성하기
                </button>
              </div>
            ) : (
              <div className="profile-view">
                <h2 className="profile-name">{profile?.name}</h2>
                <p className="profile-email">{profile?.email}</p>
                <p className="profile-detail">
                  {profile?.department?.split(',').map((dept, i) => (
                    <span key={i}>
                      {dept}{i === 0 && profile?.department?.includes(',') ? ' · ' : ''}
                      {i > 0 && i < profile?.department?.split(',').length - 1 ? '(복수전공) · ' : ''}
                    </span>
                  ))}
                  {' '}{profile?.enrollYear ? `${String(profile.enrollYear).slice(-2)}학번` : ''}
                </p>

                {/* 선택 스펙 표시 */}
                {profile?.positions?.length > 0 && (
                  <div className="profile-spec-item">
                    <label>희망 직무</label>
                    <p>{profile.positions.join(', ')}</p>
                  </div>
                )}
                {profile?.stacks?.length > 0 && (
                  <div className="profile-spec-item">
                    <label>기술 스택</label>
                    <div className="stack-tags">
                      {profile.stacks.map((stack, i) => (
                        <span key={i} className="stack-tag">{stack}</span>
                      ))}
                    </div>
                  </div>
                )}
                {profile?.slogan && (
                  <div className="profile-spec-item">
                    <label>한 줄 소개</label>
                    <p>{profile.slogan}</p>
                  </div>
                )}
                {profile?.explanation && (
                  <div className="profile-spec-item">
                    <label>자기소개</label>
                    <p className="profile-explanation">{profile.explanation}</p>
                  </div>
                )}
                {profile?.links?.length > 0 && (
                  <div className="profile-spec-item">
                    <label>기타 소개 링크</label>
                    <div className="profile-links">
                      {profile.links.map((link, i) => (
                        <a key={i} href={link.link} target="_blank" rel="noopener noreferrer">
                          {link.description}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
