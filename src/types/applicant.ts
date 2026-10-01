export type TrackType =
  | '기획/PM'
  | 'UI/UX 디자인'
  | '프론트엔드 개발'
  | '백엔드 개발'
  | '마케팅/대외협력'
  | '콘텐츠/미디어';

export type ApplicationStatus =
  | '접수완료'
  | '서류검토중'
  | '서류합격'
  | '면접대기'
  | '최종합격'
  | '불합격';

export type EnrollmentStatus = '재학' | '휴학' | '졸업예정' | '수료/기타';

export interface Applicant {
  id: string; // e.g. APP-2026-0101
  createdAt: string; // ISO string
  name: string;
  birthDate: string; // YYYY-MM-DD
  gender: '남성' | '여성' | '기타' | '미선택';
  phone: string; // 010-XXXX-XXXX
  email: string;
  university: string;
  major: string;
  studentId: string;
  academicYear: '1학년' | '2학년' | '3학년' | '4학년' | '대학원생';
  academicSemester: '1학기' | '2학기' | '초과학기';
  enrollmentStatus: EnrollmentStatus;
  primaryTrack: TrackType;
  secondaryTrack: TrackType | '없음';
  regularMeetingAttending: '가능' | '불가능' | '조율필요';
  interviewSlots: string[];
  portfolioUrl?: string;
  answers: {
    motivation: string; // 지원 동기 및 활동 목표
    collaborativeExperience: string; // 협업 경험 및 갈등 해결
    technicalStrengths: string; // 직무 강점 및 역량
  };
  agreePrivacy: boolean;
  status: ApplicationStatus;
  score: number; // 0 ~ 100
  adminNotes: string;
}

export interface ClubConfig {
  name: string;
  subTitle: string;
  generation: string; // e.g. "12기 신입 부원"
  recruitmentPeriod: string; // e.g. "2026.03.01 ~ 2026.03.20"
  meetingSchedule: string; // e.g. "매주 토요일 오후 2시 ~ 5시 (서울 신촌/강남)"
  tracks: TrackType[];
  interviewSlots: string[];
  contactEmail: string;
  contactKakao: string;
}
