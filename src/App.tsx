import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { ClubHero } from './components/ClubHero';
import { ApplicantForm } from './components/ApplicantForm';
import { AdminDashboard } from './components/AdminDashboard';
import { ClubSettingsModal } from './components/ClubSettingsModal';
import { SourceCodeModal } from './components/SourceCodeModal';
import { Applicant, ClubConfig } from './types/applicant';
import { INITIAL_CLUB_CONFIG, SAMPLE_APPLICANTS } from './utils/sampleData';
import { exportApplicantsToExcel } from './utils/excelExport';

export default function App() {
  // Navigation tab state
  const [currentTab, setCurrentTab] = useState<'apply' | 'admin'>('apply');

  // Club Config State with localStorage persistence
  const [clubConfig, setClubConfig] = useState<ClubConfig>(() => {
    try {
      const saved = localStorage.getItem('club_app_config');
      return saved ? JSON.parse(saved) : INITIAL_CLUB_CONFIG;
    } catch {
      return INITIAL_CLUB_CONFIG;
    }
  });

  // Applicants State with localStorage persistence
  const [applicants, setApplicants] = useState<Applicant[]>(() => {
    try {
      const saved = localStorage.getItem('club_app_applicants');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      return SAMPLE_APPLICANTS;
    } catch {
      return SAMPLE_APPLICANTS;
    }
  });

  // Settings Modal State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  // Source Code Modal State
  const [isSourceCodeOpen, setIsSourceCodeOpen] = useState(false);

  // Form scroll anchor
  const formRef = useRef<HTMLDivElement>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('club_app_applicants', JSON.stringify(applicants));
    } catch {
      // quota or storage error
    }
  }, [applicants]);

  useEffect(() => {
    try {
      localStorage.setItem('club_app_config', JSON.stringify(clubConfig));
    } catch {
      // quota or storage error
    }
  }, [clubConfig]);

  // Handler: Add new submitted applicant
  const handleAddNewApplicant = (newApplicant: Applicant) => {
    setApplicants((prev) => [newApplicant, ...prev]);
  };

  // Handler: Update existing applicant (status, score, notes)
  const handleUpdateApplicant = (updated: Applicant) => {
    setApplicants((prev) =>
      prev.map((app) => (app.id === updated.id ? updated : app))
    );
  };

  // Handler: Delete applicant
  const handleDeleteApplicant = (id: string) => {
    setApplicants((prev) => prev.filter((app) => app.id !== id));
  };

  // Handler: Reset sample applicants
  const handleResetSampleData = () => {
    if (confirm('샘플 대학생 지원자 데이터 5건으로 복구하시겠습니까?')) {
      setApplicants(SAMPLE_APPLICANTS);
      alert('샘플 데이터가 복구되었습니다.');
    }
  };

  // Handler: Clear all applicants
  const handleClearAll = () => {
    if (confirm('모든 지원자 목록을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      setApplicants([]);
      localStorage.removeItem('club_app_applicants');
    }
  };

  // Quick Excel export shortcut
  const handleQuickExcelExport = () => {
    if (applicants.length === 0) {
      alert('다운로드할 지원자 데이터가 없습니다.');
      return;
    }
    exportApplicantsToExcel(applicants, clubConfig.name);
  };

  // Scroll smoothly to application form
  const handleScrollToForm = () => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Top Bar Contract */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        applicantCount={applicants.length}
        clubConfig={clubConfig}
        onQuickExcelExport={handleQuickExcelExport}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenSourceCode={() => setIsSourceCodeOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentTab === 'apply' ? (
          <div>
            {/* Club Hero Banner & Requirements */}
            <ClubHero
              clubConfig={clubConfig}
              onScrollToForm={handleScrollToForm}
            />

            {/* Applicant HTML Form */}
            <div ref={formRef} className="scroll-mt-20">
              <ApplicantForm
                clubConfig={clubConfig}
                onSubmitSuccess={handleAddNewApplicant}
                allApplicants={applicants}
              />
            </div>
          </div>
        ) : (
          /* Admin / Executive Management Dashboard */
          <AdminDashboard
            applicants={applicants}
            clubConfig={clubConfig}
            onUpdateApplicant={handleUpdateApplicant}
            onDeleteApplicant={handleDeleteApplicant}
            onResetSampleData={handleResetSampleData}
            onClearAll={handleClearAll}
          />
        )}
      </main>

      {/* Settings Modal */}
      <ClubSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        config={clubConfig}
        onSave={(newCfg) => setClubConfig(newCfg)}
      />

      {/* Source Code Modal for VS Code */}
      <SourceCodeModal
        isOpen={isSourceCodeOpen}
        onClose={() => setIsSourceCodeOpen(false)}
      />

      {/* Quiet Footer */}
      <footer className="bg-white border-t border-slate-200 mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            <span className="font-semibold text-slate-700">{clubConfig.name}</span>
            <span className="mx-2" aria-hidden="true">·</span>
            <span>{clubConfig.generation}</span>
            <span className="mx-2" aria-hidden="true">·</span>
            <span>문의: {clubConfig.contactEmail}</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentTab('apply')}
              className="hover:text-indigo-600 transition-colors"
            >
              지원서 작성
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setCurrentTab('admin')}
              className="hover:text-indigo-600 transition-colors"
            >
              운영진 관리자 ({applicants.length}명)
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={handleQuickExcelExport}
              className="hover:text-emerald-600 font-medium transition-colors"
            >
              엑셀(.xlsx) 내보내기
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setIsSourceCodeOpen(true)}
              className="hover:text-indigo-600 font-medium transition-colors"
            >
              VS Code 코드 받기 (.zip)
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
