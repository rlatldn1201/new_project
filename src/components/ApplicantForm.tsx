import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Save,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Download,
  Info,
  User,
  GraduationCap,
  Calendar,
  Briefcase,
  FileText,
  ShieldCheck,
} from 'lucide-react';
import { Applicant, ClubConfig, TrackType, EnrollmentStatus } from '../types/applicant';
import { exportSingleApplicantToExcel, exportApplicantsToExcel } from '../utils/excelExport';

interface ApplicantFormProps {
  clubConfig: ClubConfig;
  onSubmitSuccess: (newApplicant: Applicant) => void;
  allApplicants: Applicant[];
}

export const ApplicantForm: React.FC<ApplicantFormProps> = ({
  clubConfig,
  onSubmitSuccess,
  allApplicants,
}) => {
  // Form State
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'남성' | '여성' | '기타' | '미선택'>('미선택');
  const [birthDate, setBirthDate] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [university, setUniversity] = useState('');
  const [major, setMajor] = useState('');
  const [studentId, setStudentId] = useState('');
  const [academicYear, setAcademicYear] = useState<'1학년' | '2학년' | '3학년' | '4학년' | '대학원생'>('2학년');
  const [academicSemester, setAcademicSemester] = useState<'1학기' | '2학기' | '초과학기'>('1학기');
  const [enrollmentStatus, setEnrollmentStatus] = useState<EnrollmentStatus>('재학');
  const [primaryTrack, setPrimaryTrack] = useState<TrackType>('프론트엔드 개발');
  const [secondaryTrack, setSecondaryTrack] = useState<TrackType | '없음'>('UI/UX 디자인');
  const [regularMeetingAttending, setRegularMeetingAttending] = useState<'가능' | '불가능' | '조율필요'>('가능');
  const [interviewSlots, setInterviewSlots] = useState<string[]>([]);
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [answers, setAnswers] = useState({
    motivation: '',
    collaborativeExperience: '',
    technicalStrengths: '',
  });
  const [agreePrivacy, setAgreePrivacy] = useState(false);

  // Status & Feedback State
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [draftSavedTime, setDraftSavedTime] = useState<string | null>(null);
  const [submittedApplicant, setSubmittedApplicant] = useState<Applicant | null>(null);
  const [autoExportExcel, setAutoExportExcel] = useState(true);

  // Load draft on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('club_app_draft');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.name) setName(parsed.name);
        if (parsed.gender) setGender(parsed.gender);
        if (parsed.birthDate) setBirthDate(parsed.birthDate);
        if (parsed.phone) setPhone(parsed.phone);
        if (parsed.email) setEmail(parsed.email);
        if (parsed.university) setUniversity(parsed.university);
        if (parsed.major) setMajor(parsed.major);
        if (parsed.studentId) setStudentId(parsed.studentId);
        if (parsed.academicYear) setAcademicYear(parsed.academicYear);
        if (parsed.academicSemester) setAcademicSemester(parsed.academicSemester);
        if (parsed.enrollmentStatus) setEnrollmentStatus(parsed.enrollmentStatus);
        if (parsed.primaryTrack) setPrimaryTrack(parsed.primaryTrack);
        if (parsed.secondaryTrack) setSecondaryTrack(parsed.secondaryTrack);
        if (parsed.regularMeetingAttending) setRegularMeetingAttending(parsed.regularMeetingAttending);
        if (parsed.interviewSlots) setInterviewSlots(parsed.interviewSlots);
        if (parsed.portfolioUrl) setPortfolioUrl(parsed.portfolioUrl);
        if (parsed.answers) setAnswers(parsed.answers);
        setDraftSavedTime('이전에 저장된 임시저장 본을 불러왔습니다.');
      }
    } catch {
      // ignore draft parse error
    }
  }, []);

  // Format phone number
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    let formatted = raw;
    if (raw.length > 3 && raw.length <= 7) {
      formatted = `${raw.slice(0, 3)}-${raw.slice(3)}`;
    } else if (raw.length > 7) {
      formatted = `${raw.slice(0, 3)}-${raw.slice(3, 7)}-${raw.slice(7, 11)}`;
    }
    setPhone(formatted);
  };

  // Toggle interview slots
  const toggleInterviewSlot = (slot: string) => {
    setInterviewSlots((prev) =>
      prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot]
    );
  };

  // Save draft
  const handleSaveDraft = () => {
    const draft = {
      name,
      gender,
      birthDate,
      phone,
      email,
      university,
      major,
      studentId,
      academicYear,
      academicSemester,
      enrollmentStatus,
      primaryTrack,
      secondaryTrack,
      regularMeetingAttending,
      interviewSlots,
      portfolioUrl,
      answers,
    };
    localStorage.setItem('club_app_draft', JSON.stringify(draft));
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now
      .getMinutes()
      .toString()
      .padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    setDraftSavedTime(`임시저장 완료 (${timeStr})`);
  };

  // Fill sample data
  const handleFillSample = () => {
    setName('이지은');
    setGender('여성');
    setBirthDate('2004-09-12');
    setPhone('010-5231-9876');
    setEmail('jieun.lee@korea.ac.kr');
    setUniversity('고려대학교');
    setMajor('컴퓨터소프트웨어학과');
    setStudentId('2023130421');
    setAcademicYear('2학년');
    setAcademicSemester('1학기');
    setEnrollmentStatus('재학');
    setPrimaryTrack('프론트엔드 개발');
    setSecondaryTrack('기획/PM');
    setRegularMeetingAttending('가능');
    setInterviewSlots([clubConfig.interviewSlots[0], clubConfig.interviewSlots[2]]);
    setPortfolioUrl('https://github.com/jieun-dev-space');
    setAnswers({
      motivation:
        '컴퓨터소프트웨어 전공으로 다양한 과제를 수행하며 웹 프론트엔드의 매력에 깊이 빠졌습니다. 특히 디자이너 및 백엔드 팀원과 한 팀을 이루어 기획부터 실 서비스 배포까지 전 주기를 책임지는 사이드 프로젝트를 꼭 완주하고 싶어 지원하게 되었습니다. 유니스피어의 열정적인 동료들과 함께 주도적으로 성장하고 싶습니다.',
      collaborativeExperience:
        '교내 웹 개발 소모임에서 컴포넌트 라이브러리 도입과 관련해 팀원 간 선호도가 갈렸던 적이 있습니다. 각 라이브러리의 번들 사이즈, 문서화 수준, 유지보수 용이성을 비교 분석한 문서를 작성해 공유했고, 팀원들의 합의를 이끌어내어 프로젝트 일정을 2주 단축할 수 있었습니다.',
      technicalStrengths:
        'React, TypeScript, Tailwind CSS를 기반으로 한 컴포넌트 개발에 익숙하며, 반응형 웹 디자인과 REST API 연동 경험이 풍부합니다. 최근에는 성능 최적화와 번들 경량화, Next.js App Router 학습에 집중하고 있습니다.',
    });
    setAgreePrivacy(true);
    setErrors({});
  };

  // Reset form
  const handleReset = () => {
    if (confirm('작성 중인 내용을 모두 초기화하시겠습니까?')) {
      setName('');
      setGender('미선택');
      setBirthDate('');
      setPhone('');
      setEmail('');
      setUniversity('');
      setMajor('');
      setStudentId('');
      setAcademicYear('2학년');
      setAcademicSemester('1학기');
      setEnrollmentStatus('재학');
      setPrimaryTrack('프론트엔드 개발');
      setSecondaryTrack('UI/UX 디자인');
      setRegularMeetingAttending('가능');
      setInterviewSlots([]);
      setPortfolioUrl('');
      setAnswers({
        motivation: '',
        collaborativeExperience: '',
        technicalStrengths: '',
      });
      setAgreePrivacy(false);
      setErrors({});
      localStorage.removeItem('club_app_draft');
      setDraftSavedTime(null);
    }
  };

  // Validate form
  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!name.trim()) errs.name = '성명을 입력해주세요.';
    if (!birthDate) errs.birthDate = '생년월일을 입력해주세요.';
    if (!phone.trim()) {
      errs.phone = '연락처를 입력해주세요.';
    } else if (!/^010-\d{4}-\d{4}$/.test(phone)) {
      errs.phone = '올바른 휴대폰 번호 형식(010-0000-0000)을 입력해주세요.';
    }

    if (!email.trim()) {
      errs.email = '이메일 주소를 입력해주세요.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = '유효한 이메일 주소를 입력해주세요.';
    }

    if (!university.trim()) errs.university = '소속 대학교를 입력해주세요.';
    if (!major.trim()) errs.major = '학과/전공을 입력해주세요.';
    if (!studentId.trim()) errs.studentId = '학번을 입력해주세요.';

    if (interviewSlots.length === 0) {
      errs.interviewSlots = '면접 가능한 일정을 최소 1개 이상 선택해주세요.';
    }

    if (!answers.motivation.trim() || answers.motivation.trim().length < 50) {
      errs.motivation = '지원 동기 및 활동 목표를 50자 이상 작성해주세요.';
    }

    if (!answers.collaborativeExperience.trim() || answers.collaborativeExperience.trim().length < 50) {
      errs.collaborativeExperience = '협업 및 갈등 해결 경험을 50자 이상 작성해주세요.';
    }

    if (!answers.technicalStrengths.trim() || answers.technicalStrengths.trim().length < 50) {
      errs.technicalStrengths = '직무 강점 및 역량을 50자 이상 작성해주세요.';
    }

    if (!agreePrivacy) {
      errs.agreePrivacy = '개인정보 수집 및 이용에 동의해야 지원이 가능합니다.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      const firstError = Object.values(errors)[0];
      alert(`입력 항목을 확인해주세요: ${firstError || '필수 항목이 누락되었습니다.'}`);
      return;
    }

    // Generate Applicant ID: e.g. APP-2026-006
    const nextNum = allApplicants.length + 1;
    const applicantId = `APP-2026-${String(nextNum).padStart(3, '0')}`;

    const newApplicant: Applicant = {
      id: applicantId,
      createdAt: new Date().toISOString(),
      name: name.trim(),
      gender,
      birthDate,
      phone: phone.trim(),
      email: email.trim(),
      university: university.trim(),
      major: major.trim(),
      studentId: studentId.trim(),
      academicYear,
      academicSemester,
      enrollmentStatus,
      primaryTrack,
      secondaryTrack,
      regularMeetingAttending,
      interviewSlots,
      portfolioUrl: portfolioUrl.trim(),
      answers,
      agreePrivacy,
      status: '접수완료',
      score: 0,
      adminNotes: '',
    };

    // Callback to persist
    onSubmitSuccess(newApplicant);
    setSubmittedApplicant(newApplicant);

    // Clear draft
    localStorage.removeItem('club_app_draft');

    // Trigger Confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }

    // If auto export checkbox is checked, trigger Excel download immediately!
    if (autoExportExcel) {
      setTimeout(() => {
        exportSingleApplicantToExcel(newApplicant, clubConfig.name);
      }, 500);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* If already submitted in current session, show Success Receipt View */}
      {submittedApplicant ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-10 space-y-8 animate-in fade-in duration-300">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              지원서가 성공적으로 접수되었습니다!
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              {clubConfig.name} {clubConfig.generation}에 지원해주셔서 대단히 감사합니다.
            </p>
          </div>

          {/* Official Receipt Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between border-b border-slate-200 pb-4 gap-2">
              <div>
                <span className="text-xs font-semibold text-slate-500">접수 번호</span>
                <div className="text-lg font-mono font-bold text-indigo-700">
                  {submittedApplicant.id}
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold text-slate-500">접수 일시</span>
                <div className="text-sm font-medium text-slate-700">
                  {new Date(submittedApplicant.createdAt).toLocaleString('ko-KR')}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-xs text-slate-500">지원자</span>
                <div className="font-semibold text-slate-900">{submittedApplicant.name}</div>
              </div>
              <div>
                <span className="text-xs text-slate-500">소속 대학</span>
                <div className="font-semibold text-slate-900">{submittedApplicant.university}</div>
              </div>
              <div>
                <span className="text-xs text-slate-500">1지망 파트</span>
                <div className="font-semibold text-indigo-600">{submittedApplicant.primaryTrack}</div>
              </div>
              <div>
                <span className="text-xs text-slate-500">연락처</span>
                <div className="font-semibold text-slate-900">{submittedApplicant.phone}</div>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-3 text-xs text-slate-500">
              선택한 면접 희망 일정: {submittedApplicant.interviewSlots.join(', ')}
            </div>
          </div>

          {/* Excel Download Actions (Directly satisfies "html로 입력받으면 엑셀로 저장되게 해줘") */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-emerald-600 text-white rounded-lg shrink-0">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-emerald-950">
                  엑셀(.xlsx) 파일 저장 안내
                </h4>
                <p className="text-xs sm:text-sm text-emerald-800 leading-relaxed">
                  입력하신 모든 지원 항목(인적사항, 학적, 지망 파트, 자기소개서 전문)이 엑셀 서식에
                  맞춰 실시간으로 저장되었습니다. 언제든지 아래 버튼을 통해 다시 다운로드하실 수 있습니다.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => exportSingleApplicantToExcel(submittedApplicant, clubConfig.name)}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>내 지원서 엑셀(.xlsx) 다시 받기</span>
              </button>
              <button
                onClick={() => exportApplicantsToExcel(allApplicants, clubConfig.name)}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-emerald-900 bg-white border border-emerald-300 hover:bg-emerald-50 rounded-lg transition-colors"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                <span>동아리 전체 명단 엑셀 다운로드 (총 {allApplicants.length}명)</span>
              </button>
            </div>
          </div>

          {/* Return or Reset Button */}
          <div className="flex items-center justify-center gap-4 pt-4">
            <button
              onClick={() => {
                setSubmittedApplicant(null);
                handleReset();
              }}
              className="px-5 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              새로운 지원서 추가 작성하기
            </button>
          </div>
        </div>
      ) : (
        /* The Application HTML Input Form */
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Form Header & Action Toolbar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
              <div>
                <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                  ONLINE APPLICATION
                </span>
                <h2 className="text-2xl font-bold text-slate-900 mt-1">
                  {clubConfig.name} 신입 부원 지원서
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  모든 항목은 사실에 기반하여 성실히 작성해 주시기 바랍니다.
                </p>
              </div>

              {/* Utility actions: Sample Fill & Save Draft */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleFillSample}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors"
                  title="테스트용으로 양식을 모의 데이터로 채웁니다"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>예시 자동입력</span>
                </button>
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>임시저장</span>
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="작성 내용 초기화"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {draftSavedTime && (
              <div className="mt-3 text-xs text-indigo-700 bg-indigo-50/60 px-3 py-1.5 rounded-md flex items-center gap-2">
                <Info className="w-3.5 h-3.5" />
                <span>{draftSavedTime}</span>
              </div>
            )}
          </div>

          {/* Section 1: 기본 인적사항 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">01. 기본 인적사항</h3>
                <p className="text-xs text-slate-500">면접 안내 및 합격자 공지 연락을 위해 정확히 입력해 주세요.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* 성명 */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  성명 (실명) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="예: 홍길동"
                  className={`w-full px-3.5 py-2.5 text-sm rounded-lg border ${
                    errors.name ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                  } focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors`}
                />
                {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name}</p>}
              </div>

              {/* 생년월일 */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  생년월일 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className={`w-full px-3.5 py-2.5 text-sm rounded-lg border ${
                    errors.birthDate ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                  } focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors`}
                />
                {errors.birthDate && <p className="text-xs text-rose-500 mt-1">{errors.birthDate}</p>}
              </div>

              {/* 성별 */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  성별
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors"
                >
                  <option value="미선택">미선택</option>
                  <option value="남성">남성</option>
                  <option value="여성">여성</option>
                  <option value="기타">기타</option>
                </select>
              </div>

              {/* 연락처 */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  휴대폰 번호 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={handlePhoneChange}
                  maxLength={13}
                  placeholder="010-0000-0000"
                  className={`w-full px-3.5 py-2.5 text-sm font-mono rounded-lg border ${
                    errors.phone ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                  } focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors`}
                />
                {errors.phone && <p className="text-xs text-rose-500 mt-1">{errors.phone}</p>}
              </div>

              {/* 이메일 */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  이메일 주소 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="campus@example.com (대학교 웹메일 권장)"
                  className={`w-full px-3.5 py-2.5 text-sm rounded-lg border ${
                    errors.email ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                  } focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors`}
                />
                {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email}</p>}
              </div>
            </div>
          </div>

          {/* Section 2: 학적 정보 (대학생 특화) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">02. 학적 정보</h3>
                <p className="text-xs text-slate-500">현재 재학 중인 대학 및 전공 정보를 입력해 주세요.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* 대학교 */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  소속 대학교 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  placeholder="예: 연세대학교, 고려대학교 등"
                  className={`w-full px-3.5 py-2.5 text-sm rounded-lg border ${
                    errors.university ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                  } focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors`}
                />
                {errors.university && <p className="text-xs text-rose-500 mt-1">{errors.university}</p>}
              </div>

              {/* 전공 / 학과 */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  학과 / 전공 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={major}
                  onChange={(e) => setMajor(e.target.value)}
                  placeholder="예: 컴퓨터공학과, 시각디자인과 등"
                  className={`w-full px-3.5 py-2.5 text-sm rounded-lg border ${
                    errors.major ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                  } focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors`}
                />
                {errors.major && <p className="text-xs text-rose-500 mt-1">{errors.major}</p>}
              </div>

              {/* 학번 */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  학번 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="예: 202412345 (입학년도 포함)"
                  className={`w-full px-3.5 py-2.5 text-sm font-mono rounded-lg border ${
                    errors.studentId ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                  } focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors`}
                />
                {errors.studentId && <p className="text-xs text-rose-500 mt-1">{errors.studentId}</p>}
              </div>

              {/* 학년 */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">학년</label>
                <select
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors"
                >
                  <option value="1학년">1학년</option>
                  <option value="2학년">2학년</option>
                  <option value="3학년">3학년</option>
                  <option value="4학년">4학년</option>
                  <option value="대학원생">대학원생</option>
                </select>
              </div>

              {/* 학기 */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">학기</label>
                <select
                  value={academicSemester}
                  onChange={(e) => setAcademicSemester(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors"
                >
                  <option value="1학기">1학기</option>
                  <option value="2학기">2학기</option>
                  <option value="초과학기">초과학기</option>
                </select>
              </div>

              {/* 재학 상태 */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">재학 여부</label>
                <select
                  value={enrollmentStatus}
                  onChange={(e) => setEnrollmentStatus(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors"
                >
                  <option value="재학">재학</option>
                  <option value="휴학">휴학</option>
                  <option value="졸업예정">졸업예정</option>
                  <option value="수료/기타">수료/기타</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: 지원 파트 & 일정 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">03. 지원 파트 & 일정 조율</h3>
                <p className="text-xs text-slate-500">원하시는 직군 파트와 정기 세션 및 면접 일정을 선택해 주세요.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* 1지망 */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  1지망 지원 파트 <span className="text-rose-500">*</span>
                </label>
                <select
                  value={primaryTrack}
                  onChange={(e) => setPrimaryTrack(e.target.value as TrackType)}
                  className="w-full px-3.5 py-2.5 text-sm font-medium rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors"
                >
                  {clubConfig.tracks.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              {/* 2지망 */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  2지망 지원 파트 (선택)
                </label>
                <select
                  value={secondaryTrack}
                  onChange={(e) => setSecondaryTrack(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors"
                >
                  <option value="없음">선택 안 함 (1지망만 지원)</option>
                  {clubConfig.tracks.map((t) => (
                    <option key={t} value={t} disabled={t === primaryTrack}>
                      {t} {t === primaryTrack ? '(1지망과 동일)' : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 정기 모임 참석 여부 */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <label className="block text-xs font-semibold text-slate-800">
                정기 모임 참석 여부 <span className="text-rose-500">*</span>
              </label>
              <p className="text-xs text-slate-500">
                세션 일정: <strong>{clubConfig.meetingSchedule}</strong>
              </p>
              <div className="flex flex-wrap gap-4 pt-1">
                {(['가능', '불가능', '조율필요'] as const).map((opt) => (
                  <label key={opt} className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="regularMeeting"
                      checked={regularMeetingAttending === opt}
                      onChange={() => setRegularMeetingAttending(opt)}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>{opt === '가능' ? '매주 정기 참석 가능' : opt === '조율필요' ? '일부 시간 조율 필요' : '참석 불가'}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 면접 가능 시간대 */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700">
                면접 희망 시간대 (복수 선택 가능) <span className="text-rose-500">*</span>
              </label>
              <p className="text-xs text-slate-500">면접은 20~30분 내외로 진행됩니다. 가능한 시간대를 모두 골라주세요.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                {clubConfig.interviewSlots.map((slot) => {
                  const isChecked = interviewSlots.includes(slot);
                  return (
                    <button
                      type="button"
                      key={slot}
                      onClick={() => toggleInterviewSlot(slot)}
                      className={`text-left p-3 rounded-lg border text-xs sm:text-sm font-medium transition-all flex items-center justify-between ${
                        isChecked
                          ? 'border-indigo-600 bg-indigo-50/60 text-indigo-900 shadow-xs'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <span>{slot}</span>
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                          isChecked
                            ? 'bg-indigo-600 border-indigo-600 text-white'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>
                    </button>
                  );
                })}
              </div>
              {errors.interviewSlots && (
                <p className="text-xs text-rose-500 mt-1">{errors.interviewSlots}</p>
              )}
            </div>

            {/* 포트폴리오 URL */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                포트폴리오 / GitHub / 노션 / 블로그 링크 (선택)
              </label>
              <input
                type="url"
                value={portfolioUrl}
                onChange={(e) => setPortfolioUrl(e.target.value)}
                placeholder="https://github.com/... 또는 https://notion.so/..."
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors"
              />
              <p className="text-xs text-slate-400 mt-1">
                작업물, 깃허브 레포지토리, 비핸스, 디자인 포트폴리오 링크를 첨부하시면 서류 심사 시 우대됩니다.
              </p>
            </div>
          </div>

          {/* Section 4: 자기소개서 문항 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">04. 자기소개서 (서류 심사 문항)</h3>
                <p className="text-xs text-slate-500">진솔한 경험과 생각을 작성해 주세요. (각 문항 300~700자 권장)</p>
              </div>
            </div>

            {/* 문항 1 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-800">
                  [문항 1] {clubConfig.name}에 지원하게 된 동기와, 동아리 활동을 통해 이루고 싶은 목표는 무엇인가요?{' '}
                  <span className="text-rose-500">*</span>
                </label>
                <span className="text-xs font-mono text-slate-400">
                  {answers.motivation.length}자
                </span>
              </div>
              <textarea
                rows={4}
                value={answers.motivation}
                onChange={(e) =>
                  setAnswers({ ...answers, motivation: e.target.value })
                }
                placeholder="지원 동기와 동아리에서 만들고 싶은 프로덕트 혹은 얻고 싶은 역량에 대해 자유롭게 작성해 주세요."
                className={`w-full px-3.5 py-2.5 text-sm rounded-lg border ${
                  errors.motivation ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                } focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 leading-relaxed transition-colors`}
              />
              {errors.motivation && <p className="text-xs text-rose-500">{errors.motivation}</p>}
            </div>

            {/* 문항 2 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-800">
                  [문항 2] 팀 프로젝트나 협업 과정에서 의견 충돌이나 어려움을 겪었을 때, 이를 어떻게 해결했는지 구체적인 사례를 들어 설명해 주세요.{' '}
                  <span className="text-rose-500">*</span>
                </label>
                <span className="text-xs font-mono text-slate-400">
                  {answers.collaborativeExperience.length}자
                </span>
              </div>
              <textarea
                rows={4}
                value={answers.collaborativeExperience}
                onChange={(e) =>
                  setAnswers({ ...answers, collaborativeExperience: e.target.value })
                }
                placeholder="팀 내 소통 방식, 갈등 해결 과정, 그 경험을 통해 배운 점을 기술해 주세요."
                className={`w-full px-3.5 py-2.5 text-sm rounded-lg border ${
                  errors.collaborativeExperience
                    ? 'border-rose-400 bg-rose-50/20'
                    : 'border-slate-300'
                } focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 leading-relaxed transition-colors`}
              />
              {errors.collaborativeExperience && (
                <p className="text-xs text-rose-500">{errors.collaborativeExperience}</p>
              )}
            </div>

            {/* 문항 3 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-800">
                  [문항 3] 지원하신 파트와 관련하여 본인의 핵심 강점(역량)이나 깊이 몰입했던 프로젝트 경험을 기술해 주세요.{' '}
                  <span className="text-rose-500">*</span>
                </label>
                <span className="text-xs font-mono text-slate-400">
                  {answers.technicalStrengths.length}자
                </span>
              </div>
              <textarea
                rows={4}
                value={answers.technicalStrengths}
                onChange={(e) =>
                  setAnswers({ ...answers, technicalStrengths: e.target.value })
                }
                placeholder="활용 가능한 도구(Figma, React, Spring, Premiere 등)나 과거 경험, 자신만의 기술적/직무적 무기를 소개해 주세요."
                className={`w-full px-3.5 py-2.5 text-sm rounded-lg border ${
                  errors.technicalStrengths
                    ? 'border-rose-400 bg-rose-50/20'
                    : 'border-slate-300'
                } focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 leading-relaxed transition-colors`}
              />
              {errors.technicalStrengths && (
                <p className="text-xs text-rose-500">{errors.technicalStrengths}</p>
              )}
            </div>
          </div>

          {/* Section 5: 개인정보 처리 동의 & 엑셀 저장 옵션 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">개인정보 수집 및 이용 동의</h3>
            </div>

            <div className="text-xs text-slate-600 bg-slate-50 p-4 rounded-xl space-y-1.5 leading-relaxed border border-slate-200">
              <p><strong>수집 목적:</strong> {clubConfig.name} 동아리 회원 선발 전형 운영, 서류 심사, 면접 안내 및 합격자 공지</p>
              <p><strong>수집 항목:</strong> 성명, 생년월일, 연락처, 이메일, 대학, 전공, 학번, 자기소개서 내용, 포트폴리오 링크</p>
              <p><strong>보유 기간:</strong> 당해 기수 선발 전형 종료 및 신입 기수 활동 시작 후 6개월 보관 후 안전하게 파기</p>
            </div>

            <label className="flex items-center gap-3 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={agreePrivacy}
                onChange={(e) => setAgreePrivacy(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
              />
              <span className="text-xs sm:text-sm font-medium text-slate-800">
                개인정보 수집 및 이용 목적에 동의합니다. <span className="text-rose-500">*</span>
              </span>
            </label>
            {errors.agreePrivacy && (
              <p className="text-xs text-rose-500">{errors.agreePrivacy}</p>
            )}

            {/* Auto-export toggle */}
            <div className="pt-3 border-t border-slate-100">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoExportExcel}
                  onChange={(e) => setAutoExportExcel(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                />
                <span className="text-xs sm:text-sm text-slate-700 flex items-center gap-1.5">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  <strong>제출 완료 즉시 내 지원서를 엑셀(.xlsx) 파일로 자동 다운로드</strong>
                </span>
              </label>
            </div>
          </div>

          {/* Submit Action */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
            <div className="text-xs text-slate-500 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-slate-400" />
              <span>제출 후 운영진 승인 전까지 수정이 제한될 수 있습니다.</span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleSaveDraft}
                className="flex-1 sm:flex-none px-4 py-3 text-sm font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors text-center"
              >
                임시저장
              </button>
              <button
                type="submit"
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-3 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm hover:shadow transition-all"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>지원서 최종 제출하기</span>
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
