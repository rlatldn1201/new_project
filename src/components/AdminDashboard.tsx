import React, { useState, useMemo } from 'react';
import {
  FileSpreadsheet,
  Search,
  Filter,
  Download,
  Eye,
  Trash2,
  CheckCircle,
  Clock,
  XCircle,
  ExternalLink,
  ChevronRight,
  Sparkles,
  RefreshCw,
  X,
  Copy,
  Check,
  FileText,
  SlidersHorizontal,
} from 'lucide-react';
import { Applicant, ApplicationStatus, ClubConfig, TrackType } from '../types/applicant';
import {
  exportApplicantsToExcel,
  exportSingleApplicantToExcel,
  exportApplicantsToCSV,
  formatKoreanDate,
} from '../utils/excelExport';

interface AdminDashboardProps {
  applicants: Applicant[];
  clubConfig: ClubConfig;
  onUpdateApplicant: (updated: Applicant) => void;
  onDeleteApplicant: (id: string) => void;
  onResetSampleData: () => void;
  onClearAll: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  applicants,
  clubConfig,
  onUpdateApplicant,
  onDeleteApplicant,
  onResetSampleData,
  onClearAll,
}) => {
  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [trackFilter, setTrackFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modal State
  const [viewingApplicant, setViewingApplicant] = useState<Applicant | null>(null);
  const [editScore, setEditScore] = useState<number>(0);
  const [editNotes, setEditNotes] = useState<string>('');
  const [editStatus, setEditStatus] = useState<ApplicationStatus>('접수완료');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Sync modal edit fields when applicant opened
  const openApplicantModal = (app: Applicant) => {
    setViewingApplicant(app);
    setEditScore(app.score || 0);
    setEditNotes(app.adminNotes || '');
    setEditStatus(app.status);
  };

  const handleSaveApplicantReview = () => {
    if (!viewingApplicant) return;
    const updated: Applicant = {
      ...viewingApplicant,
      score: editScore,
      adminNotes: editNotes,
      status: editStatus,
    };
    onUpdateApplicant(updated);
    setViewingApplicant(updated);
    alert('심사 결과 및 메모가 저장되었습니다.');
  };

  const handleCopyText = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 1500);
  };

  // Filtered applicants
  const filteredApplicants = useMemo(() => {
    return applicants.filter((app) => {
      const matchesSearch =
        searchTerm === '' ||
        app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.university.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.major.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.studentId.includes(searchTerm) ||
        app.id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesTrack = trackFilter === 'all' || app.primaryTrack === trackFilter;
      const matchesStatus = statusFilter === 'all' || app.status === statusFilter;

      return matchesSearch && matchesTrack && matchesStatus;
    });
  }, [applicants, searchTerm, trackFilter, statusFilter]);

  // Statistics calculation
  const stats = useMemo(() => {
    const total = applicants.length;
    const documentPassed = applicants.filter(
      (a) => a.status === '서류합격' || a.status === '면접대기' || a.status === '최종합격'
    ).length;
    const finalPassed = applicants.filter((a) => a.status === '최종합격').length;
    const pending = applicants.filter((a) => a.status === '접수완료' || a.status === '서류검토중').length;

    // Track distribution
    const tracks: Record<string, number> = {};
    applicants.forEach((a) => {
      tracks[a.primaryTrack] = (tracks[a.primaryTrack] || 0) + 1;
    });

    return { total, documentPassed, finalPassed, pending, tracks };
  }, [applicants]);

  // Selection handlers
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredApplicants.map((a) => a.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Export actions
  const handleExportAllExcel = () => {
    if (applicants.length === 0) {
      alert('다운로드할 지원자 데이터가 없습니다.');
      return;
    }
    exportApplicantsToExcel(applicants, clubConfig.name);
  };

  const handleExportSelectedExcel = () => {
    const selected = applicants.filter((a) => selectedIds.includes(a.id));
    if (selected.length === 0) {
      alert('선택된 지원자가 없습니다.');
      return;
    }
    exportApplicantsToExcel(selected, clubConfig.name, `${clubConfig.name}_선택지원자_${selected.length}명.xlsx`);
  };

  const handleExportCSV = () => {
    if (applicants.length === 0) return;
    exportApplicantsToCSV(applicants, `${clubConfig.name}_지원자명단.csv`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner & Excel Highlights */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600">
              <span>ADMINISTRATOR CONSOLE</span>
              <span aria-hidden="true">·</span>
              <span>{clubConfig.generation}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              지원자 관리 & 엑셀 내보내기 센터
            </h2>
            <p className="text-sm text-slate-500">
              접수된 지원서를 실시간으로 심사하고, 서류/면접 평가 및 종합 엑셀(.xlsx) 파일로 변환하여 다운로드하세요.
            </p>
          </div>

          {/* Quick Excel Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleExportAllExcel}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>전체 엑셀 다운로드 ({applicants.length}명)</span>
            </button>

            {selectedIds.length > 0 && (
              <button
                onClick={handleExportSelectedExcel}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-xl transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>선택 {selectedIds.length}명 엑셀 받기</span>
              </button>
            )}

            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3.5 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              title="CSV 형식으로 다운로드"
            >
              <span>CSV</span>
            </button>

            <button
              onClick={onResetSampleData}
              className="p-2.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
              title="샘플 데이터 복구"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Stats Summary Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="text-xs font-semibold text-slate-500">총 지원자</div>
            <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
              {stats.total}
              <span className="text-sm font-normal text-slate-500 ml-1">명</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="text-xs font-semibold text-slate-500">서류 합격 / 면접</div>
            <div className="text-2xl font-bold font-mono text-indigo-600 mt-1">
              {stats.documentPassed}
              <span className="text-sm font-normal text-slate-500 ml-1">명</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="text-xs font-semibold text-slate-500">최종 선발 완료</div>
            <div className="text-2xl font-bold font-mono text-emerald-600 mt-1">
              {stats.finalPassed}
              <span className="text-sm font-normal text-slate-500 ml-1">명</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="text-xs font-semibold text-slate-500">미심사 / 검토중</div>
            <div className="text-2xl font-bold font-mono text-amber-600 mt-1">
              {stats.pending}
              <span className="text-sm font-normal text-slate-500 ml-1">명</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="지원자 이름, 소속 대학교, 학과, 학번, 접수번호 검색..."
              className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                지우기
              </button>
            )}
          </div>

          {/* Track Filter */}
          <div className="flex items-center gap-2">
            <select
              value={trackFilter}
              onChange={(e) => setTrackFilter(e.target.value)}
              className="px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            >
              <option value="all">전체 직군 파트 ({applicants.length})</option>
              {clubConfig.tracks.map((t) => (
                <option key={t} value={t}>
                  {t} ({stats.tracks[t] || 0})
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            >
              <option value="all">전체 상태</option>
              <option value="접수완료">접수완료</option>
              <option value="서류검토중">서류검토중</option>
              <option value="서류합격">서류합격</option>
              <option value="면접대기">면접대기</option>
              <option value="최종합격">최종합격</option>
              <option value="불합격">불합격</option>
            </select>
          </div>
        </div>

        {/* Active Filters Info */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
          <div>
            검색 결과: <strong className="text-slate-900 font-mono">{filteredApplicants.length}</strong>명
            {selectedIds.length > 0 && ` (${selectedIds.length}명 선택됨)`}
          </div>
          {(searchTerm || trackFilter !== 'all' || statusFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setTrackFilter('all');
                setStatusFilter('all');
              }}
              className="text-indigo-600 hover:underline"
            >
              필터 초기화
            </button>
          )}
        </div>
      </div>

      {/* High-Density Applicants Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600">
                <th className="p-3.5 pl-4 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={
                      filteredApplicants.length > 0 &&
                      selectedIds.length === filteredApplicants.length
                    }
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                </th>
                <th className="p-3.5">접수번호</th>
                <th className="p-3.5">성명</th>
                <th className="p-3.5">대학교 / 전공</th>
                <th className="p-3.5">학번</th>
                <th className="p-3.5">1지망 파트</th>
                <th className="p-3.5">정기모임</th>
                <th className="p-3.5">심사 상태</th>
                <th className="p-3.5 text-center">평가점수</th>
                <th className="p-3.5">접수일시</th>
                <th className="p-3.5 pr-4 text-center">상세 / 엑셀</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredApplicants.length === 0 ? (
                <tr>
                  <td colSpan={11} className="p-12 text-center text-slate-500">
                    <div className="max-w-xs mx-auto space-y-2">
                      <p className="font-semibold text-slate-700">해당하는 지원자가 없습니다.</p>
                      <p className="text-xs">검색어나 필터 조건을 변경하거나 새로운 지원서를 접수해 보세요.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredApplicants.map((app) => {
                  const isSelected = selectedIds.includes(app.id);
                  return (
                    <tr
                      key={app.id}
                      className={`hover:bg-indigo-50/30 transition-colors ${
                        isSelected ? 'bg-indigo-50/50' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="p-3.5 pl-4 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectOne(app.id)}
                          className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                        />
                      </td>

                      {/* ID */}
                      <td className="p-3.5 font-mono text-xs font-semibold text-indigo-600">
                        {app.id}
                      </td>

                      {/* Name */}
                      <td className="p-3.5 font-semibold text-slate-900">
                        <button
                          onClick={() => openApplicantModal(app)}
                          className="hover:text-indigo-600 hover:underline text-left"
                        >
                          {app.name}
                        </button>
                      </td>

                      {/* Univ & Major */}
                      <td className="p-3.5 text-xs text-slate-700">
                        <div>{app.university}</div>
                        <div className="text-slate-500">{app.major}</div>
                      </td>

                      {/* Student ID */}
                      <td className="p-3.5 font-mono text-xs text-slate-600">
                        {app.studentId}
                      </td>

                      {/* Track */}
                      <td className="p-3.5">
                        <span className="text-xs font-medium text-slate-800">
                          {app.primaryTrack}
                        </span>
                        {app.secondaryTrack !== '없음' && (
                          <div className="text-[11px] text-slate-400">
                            2지망: {app.secondaryTrack}
                          </div>
                        )}
                      </td>

                      {/* Meeting */}
                      <td className="p-3.5 text-xs">
                        <span
                          className={`font-medium ${
                            app.regularMeetingAttending === '가능'
                              ? 'text-emerald-700'
                              : app.regularMeetingAttending === '조율필요'
                              ? 'text-amber-700'
                              : 'text-rose-700'
                          }`}
                        >
                          {app.regularMeetingAttending}
                        </span>
                      </td>

                      {/* Status Dropdown */}
                      <td className="p-3.5">
                        <select
                          value={app.status}
                          onChange={(e) => {
                            const newStatus = e.target.value as ApplicationStatus;
                            onUpdateApplicant({ ...app, status: newStatus });
                          }}
                          className={`text-xs font-medium px-2 py-1 rounded border transition-colors ${
                            app.status === '최종합격'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : app.status === '서류합격' || app.status === '면접대기'
                              ? 'bg-indigo-50 text-indigo-800 border-indigo-300'
                              : app.status === '불합격'
                              ? 'bg-rose-50 text-rose-800 border-rose-300'
                              : 'bg-slate-50 text-slate-700 border-slate-200'
                          }`}
                        >
                          <option value="접수완료">접수완료</option>
                          <option value="서류검토중">서류검토중</option>
                          <option value="서류합격">서류합격</option>
                          <option value="면접대기">면접대기</option>
                          <option value="최종합격">최종합격</option>
                          <option value="불합격">불합격</option>
                        </select>
                      </td>

                      {/* Score */}
                      <td className="p-3.5 text-center font-mono text-xs">
                        {app.score > 0 ? (
                          <span className="font-semibold text-indigo-700">
                            {app.score}점
                          </span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>

                      {/* Date */}
                      <td className="p-3.5 text-xs text-slate-500 font-mono whitespace-nowrap">
                        {formatKoreanDate(app.createdAt)}
                      </td>

                      {/* Actions */}
                      <td className="p-3.5 pr-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => openApplicantModal(app)}
                            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                            title="지원서 전문 보기"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => exportSingleApplicantToExcel(app, clubConfig.name)}
                            className="p-1.5 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-md transition-colors"
                            title="이 지원서만 엑셀로 다운로드"
                          >
                            <FileSpreadsheet className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Applicant Detail Modal */}
      {viewingApplicant && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col animate-in fade-in duration-200">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-200 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {viewingApplicant.id}
                </span>
                <h3 className="text-lg font-bold text-slate-900">
                  {viewingApplicant.name} 지원서 상세
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => exportSingleApplicantToExcel(viewingApplicant, clubConfig.name)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>이 지원서 엑셀 받기</span>
                </button>
                <button
                  onClick={() => setViewingApplicant(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Basic & Academic Specs */}
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs sm:text-sm">
                <div>
                  <span className="text-xs text-slate-400 block">소속 대학교</span>
                  <span className="font-semibold text-slate-900">{viewingApplicant.university}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">학과 / 학번</span>
                  <span className="font-semibold text-slate-900">
                    {viewingApplicant.major} ({viewingApplicant.studentId})
                  </span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">학년 / 학기 / 재학</span>
                  <span className="font-semibold text-slate-900">
                    {viewingApplicant.academicYear} {viewingApplicant.academicSemester} ({viewingApplicant.enrollmentStatus})
                  </span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">1지망 파트</span>
                  <span className="font-semibold text-indigo-700">{viewingApplicant.primaryTrack}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">생년월일 / 성별</span>
                  <span className="font-medium text-slate-800">
                    {viewingApplicant.birthDate} ({viewingApplicant.gender})
                  </span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">연락처</span>
                  <div className="flex items-center gap-1 font-mono font-medium text-slate-800">
                    <span>{viewingApplicant.phone}</span>
                    <button
                      onClick={() => handleCopyText(viewingApplicant.phone, 'phone')}
                      className="text-slate-400 hover:text-indigo-600"
                    >
                      {copiedField === 'phone' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-xs text-slate-400 block">이메일</span>
                  <div className="flex items-center gap-1 font-mono font-medium text-slate-800 truncate">
                    <span>{viewingApplicant.email}</span>
                    <button
                      onClick={() => handleCopyText(viewingApplicant.email, 'email')}
                      className="text-slate-400 hover:text-indigo-600"
                    >
                      {copiedField === 'email' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Schedules & Portfolio */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between text-xs gap-2">
                  <div>
                    <span className="font-semibold text-slate-700">정기모임 참석: </span>
                    <span className="font-bold text-indigo-600">{viewingApplicant.regularMeetingAttending}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-700">면접 가능 일정: </span>
                    <span className="text-slate-600">{viewingApplicant.interviewSlots.join(', ')}</span>
                  </div>
                </div>

                {viewingApplicant.portfolioUrl && (
                  <div className="p-3 bg-indigo-50/50 rounded-lg border border-indigo-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-indigo-950">포트폴리오 링크:</span>
                    <a
                      href={viewingApplicant.portfolioUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-mono text-indigo-600 hover:underline flex items-center gap-1 truncate max-w-md"
                    >
                      <span>{viewingApplicant.portfolioUrl}</span>
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                  </div>
                )}
              </div>

              {/* Essay Answers */}
              <div className="space-y-5 border-t border-slate-100 pt-5">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-indigo-600" />
                  <span>자기소개서 답변 전문</span>
                </h4>

                <div className="space-y-4">
                  {/* Essay 1 */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <div className="text-xs font-bold text-slate-800">
                      [문항 1] 지원 동기 및 동아리에서 이루고 싶은 목표
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                      {viewingApplicant.answers?.motivation || '작성된 내용이 없습니다.'}
                    </p>
                  </div>

                  {/* Essay 2 */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <div className="text-xs font-bold text-slate-800">
                      [문항 2] 협업 경험 및 갈등 해결 사례
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                      {viewingApplicant.answers?.collaborativeExperience || '작성된 내용이 없습니다.'}
                    </p>
                  </div>

                  {/* Essay 3 */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <div className="text-xs font-bold text-slate-800">
                      [문항 3] 직무적 강점 및 프로젝트 몰입 경험
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                      {viewingApplicant.answers?.technicalStrengths || '작성된 내용이 없습니다.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Evaluator Review Panel */}
              <div className="border-t border-slate-200 pt-5 space-y-4">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
                  <span>운영진 서류/면접 심사 입력</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Status */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      심사 상태 지정
                    </label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value as ApplicationStatus)}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    >
                      <option value="접수완료">접수완료</option>
                      <option value="서류검토중">서류검토중</option>
                      <option value="서류합격">서류합격</option>
                      <option value="면접대기">면접대기</option>
                      <option value="최종합격">최종합격</option>
                      <option value="불합격">불합격</option>
                    </select>
                  </div>

                  {/* Score */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      심사 점수 (0 ~ 100점)
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={editScore}
                      onChange={(e) => setEditScore(Number(e.target.value))}
                      className="w-full px-3 py-2 text-sm font-mono rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                </div>

                {/* Admin Notes */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    운영진 내부 평가 메모
                  </label>
                  <textarea
                    rows={3}
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    placeholder="면접관 참고 사항, 기술 포트폴리오 평가, 특이사항 등을 기록하세요."
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`${viewingApplicant.name} 지원자의 지원서를 영구 삭제하시겠습니까?`)) {
                        onDeleteApplicant(viewingApplicant.id);
                        setViewingApplicant(null);
                      }
                    }}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>지원서 삭제</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setViewingApplicant(null)}
                      className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                    >
                      닫기
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveApplicantReview}
                      className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
                    >
                      심사 결과 저장
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
