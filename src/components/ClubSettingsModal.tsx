import React, { useState } from 'react';
import { X, Check, RotateCcw, Building } from 'lucide-react';
import { ClubConfig, TrackType } from '../types/applicant';
import { INITIAL_CLUB_CONFIG } from '../utils/sampleData';

interface ClubSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: ClubConfig;
  onSave: (newConfig: ClubConfig) => void;
}

export const ClubSettingsModal: React.FC<ClubSettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onSave,
}) => {
  const [name, setName] = useState(config.name);
  const [subTitle, setSubTitle] = useState(config.subTitle);
  const [generation, setGeneration] = useState(config.generation);
  const [recruitmentPeriod, setRecruitmentPeriod] = useState(config.recruitmentPeriod);
  const [meetingSchedule, setMeetingSchedule] = useState(config.meetingSchedule);
  const [contactEmail, setContactEmail] = useState(config.contactEmail);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...config,
      name,
      subTitle,
      generation,
      recruitmentPeriod,
      meetingSchedule,
      contactEmail,
    });
    onClose();
  };

  const handleResetToDefault = () => {
    if (confirm('기본 설정값으로 되돌리시겠습니까?')) {
      setName(INITIAL_CLUB_CONFIG.name);
      setSubTitle(INITIAL_CLUB_CONFIG.subTitle);
      setGeneration(INITIAL_CLUB_CONFIG.generation);
      setRecruitmentPeriod(INITIAL_CLUB_CONFIG.recruitmentPeriod);
      setMeetingSchedule(INITIAL_CLUB_CONFIG.meetingSchedule);
      setContactEmail(INITIAL_CLUB_CONFIG.contactEmail);
    }
  };

  // Quick Presets
  const applyPreset = (presetName: string, sub: string, tracks: TrackType[]) => {
    setName(presetName);
    setSubTitle(sub);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in duration-200">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Building className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-900">동아리 모집 설정</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-4 text-xs sm:text-sm">
          {/* Presets */}
          <div className="space-y-1.5 pb-2">
            <span className="text-xs font-semibold text-slate-500">빠른 동아리 프리셋:</span>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => applyPreset('멋쟁이사자처럼 (LIKELION)', '대학생 연합 프로그래밍/창업 동아리', config.tracks)}
                className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 rounded-md transition-colors"
              >
                멋쟁이사자처럼
              </button>
              <button
                type="button"
                onClick={() => applyPreset('비즈니스 마케팅 학회 MARP', '대학생 연합 전략 기획 및 마케팅 학회', config.tracks)}
                className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 rounded-md transition-colors"
              >
                마케팅/기획 학회
              </button>
              <button
                type="button"
                onClick={() => applyPreset('캠퍼스 밴드 루키즈', '대학생 중앙 락/인디 밴드 공연 동아리', config.tracks)}
                className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 rounded-md transition-colors"
              >
                공연/밴드 동아리
              </button>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">동아리 / 학회 명칭</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">동아리 슬로건 / 부제</label>
            <input
              type="text"
              value={subTitle}
              onChange={(e) => setSubTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">모집 기수 표기</label>
            <input
              type="text"
              value={generation}
              onChange={(e) => setGeneration(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">모집 접수 기간</label>
            <input
              type="text"
              value={recruitmentPeriod}
              onChange={(e) => setRecruitmentPeriod(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">정기 모임 일정 안내</label>
            <input
              type="text"
              value={meetingSchedule}
              onChange={(e) => setMeetingSchedule(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">대표 문의 이메일</label>
            <input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={handleResetToDefault}
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>기본값 초기화</span>
            </button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
              >
                취소
              </button>
              <button
                type="submit"
                className="flex items-center gap-1 px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
              >
                <Check className="w-3.5 h-3.5" />
                <span>저장 완료</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
