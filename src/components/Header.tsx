import React from 'react';
import { FileSpreadsheet, Users, UserPlus, Sparkles, Settings, Code2 } from 'lucide-react';
import { ClubConfig } from '../types/applicant';

interface HeaderProps {
  currentTab: 'apply' | 'admin';
  setCurrentTab: (tab: 'apply' | 'admin') => void;
  applicantCount: number;
  clubConfig: ClubConfig;
  onQuickExcelExport: () => void;
  onOpenSettings: () => void;
  onOpenSourceCode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  applicantCount,
  clubConfig,
  onQuickExcelExport,
  onOpenSettings,
  onOpenSourceCode,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Single text element wordmark / Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentTab('apply')}
              className="text-left group flex items-center gap-2.5 transition-opacity hover:opacity-90"
            >
              <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                C
              </div>
              <div>
                <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {clubConfig.name}
                </span>
                <span className="hidden sm:inline-block ml-2 text-xs font-normal text-slate-500">
                  신입 회원 모집 시스템
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation / Mode Switcher */}
          <nav className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg">
            <button
              onClick={() => setCurrentTab('apply')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all whitespace-nowrap ${
                currentTab === 'apply'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>지원서 작성</span>
            </button>
            <button
              onClick={() => setCurrentTab('admin')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all whitespace-nowrap ${
                currentTab === 'admin'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>운영진 관리자</span>
              <span className="font-mono text-xs px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700">
                {applicantCount}
              </span>
            </button>
          </nav>

          {/* Zone 3: Primary Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenSourceCode}
              title="VS Code로 볼 수 있는 전체 소스코드 ZIP 다운로드 및 파일 보기"
              className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-slate-700 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors border border-slate-200"
            >
              <Code2 className="w-4 h-4 text-indigo-600" />
              <span className="hidden sm:inline">VS Code 코드 다운로드</span>
              <span className="sm:hidden">코드</span>
            </button>

            <button
              onClick={onQuickExcelExport}
              title="현재 등록된 지원자 명단을 엑셀(.xlsx)로 바로 다운로드합니다."
              className="flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-xs whitespace-nowrap"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span className="hidden sm:inline">엑셀 다운로드</span>
              <span className="sm:hidden">엑셀</span>
            </button>
            <button
              onClick={onOpenSettings}
              title="동아리 정보 설정"
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

