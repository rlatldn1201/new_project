import React from 'react';
import { Calendar, Clock, MapPin, Sparkles, CheckCircle2, ChevronDown } from 'lucide-react';
import { ClubConfig } from '../types/applicant';

interface ClubHeroProps {
  clubConfig: ClubConfig;
  onScrollToForm: () => void;
}

export const ClubHero: React.FC<ClubHeroProps> = ({ clubConfig, onScrollToForm }) => {
  return (
    <div className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Text / Overview */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-indigo-600 uppercase">
                <span>{clubConfig.generation}</span>
                <span aria-hidden="true">·</span>
                <span>정기 모집</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {clubConfig.name}와 함께 성장할
                <br />
                <span className="text-indigo-600">열정적인 대학생 부원</span>을 찾습니다!
              </h1>
              <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
                기획자, 디자이너, 개발자, 마케터가 모여 실제 유저가 사용하는 서비스를 론칭하고
                밀도 높은 성장을 경험하는 대학생 연합 프로젝트 동아리입니다.
              </p>
            </div>

            {/* Key Information Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <Calendar className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-semibold text-slate-500">모집 기간</div>
                  <div className="text-sm font-medium text-slate-800">{clubConfig.recruitmentPeriod}</div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <Clock className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-semibold text-slate-500">정기 세션 일정</div>
                  <div className="text-sm font-medium text-slate-800">{clubConfig.meetingSchedule}</div>
                </div>
              </div>
            </div>

            {/* Tracks Preview */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-500">모집 직군 & 파트</div>
              <div className="flex flex-wrap gap-2">
                {clubConfig.tracks.map((track) => (
                  <span
                    key={track}
                    className="px-3 py-1 text-xs font-medium text-slate-700 bg-slate-100 rounded-md border border-slate-200"
                  >
                    {track}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA action */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onScrollToForm}
                className="flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm hover:shadow transition-all"
              >
                <span>지원서 작성하기</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              <div className="text-xs text-slate-500 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>제출 즉시 엑셀(.xlsx) 파일로도 확인 및 다운로드 가능</span>
              </div>
            </div>
          </div>

          {/* Right Image / Poster Banner */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden shadow-lg border border-slate-200/80 bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 p-6 sm:p-8 text-white flex flex-col justify-between min-h-[300px] sm:min-h-[340px]">
              {/* Decorative background grid and glow */}
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />

              <div className="relative z-10 space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-medium text-indigo-300 border border-white/10">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>2026 CAMPUS RECRUITMENT</span>
                </div>
                <h3 className="text-2xl font-black tracking-tight text-white">
                  {clubConfig.name}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {clubConfig.subTitle}
                </p>
              </div>

              {/* Highlight Badges */}
              <div className="relative z-10 grid grid-cols-2 gap-2.5 my-4">
                <div className="p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                  <span className="text-[11px] text-slate-400 block">모집 대상</span>
                  <span className="text-xs font-semibold text-slate-100">전국 대학생 누구나</span>
                </div>
                <div className="p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                  <span className="text-[11px] text-slate-400 block">지원 방식</span>
                  <span className="text-xs font-semibold text-emerald-400">온라인 접수 & 엑셀 저장</span>
                </div>
              </div>

              <div className="relative z-10 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                <span>공식 문의</span>
                <span className="font-mono text-slate-300">{clubConfig.contactEmail}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
