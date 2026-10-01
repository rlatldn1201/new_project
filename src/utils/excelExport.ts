import * as XLSX from 'xlsx';
import { Applicant } from '../types/applicant';

/**
 * Cleanly format an ISO timestamp to Korean local format: YYYY-MM-DD HH:mm
 */
export function formatKoreanDate(isoString: string): string {
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  } catch {
    return isoString;
  }
}

/**
 * Exports multiple applicants to an Excel (.xlsx) file with multiple sheets.
 */
export function exportApplicantsToExcel(
  applicants: Applicant[],
  clubName = '동아리',
  filename?: string
): void {
  const wb = XLSX.utils.book_new();

  // Sheet 1: 지원자 종합 명단
  const summaryRows = applicants.map((app, idx) => ({
    '연번': idx + 1,
    '접수번호': app.id,
    '성명': app.name,
    '성별': app.gender,
    '생년월일': app.birthDate,
    '연락처': app.phone,
    '이메일': app.email,
    '대학교': app.university,
    '학과/전공': app.major,
    '학번': app.studentId,
    '학년/학기': `${app.academicYear} ${app.academicSemester}`,
    '재학상태': app.enrollmentStatus,
    '1지망 파트': app.primaryTrack,
    '2지망 파트': app.secondaryTrack,
    '정기모임 참석': app.regularMeetingAttending,
    '면접 희망 일정': app.interviewSlots.join(' / '),
    '포트폴리오 링크': app.portfolioUrl || '없음',
    '심사 상태': app.status,
    '평가 점수': app.score || 0,
    '운영진 메모': app.adminNotes || '',
    '지원 접수 일시': formatKoreanDate(app.createdAt),
  }));

  const wsSummary = XLSX.utils.json_to_sheet(summaryRows);

  // Set column widths for Sheet 1
  wsSummary['!cols'] = [
    { wch: 6 },  // 연번
    { wch: 14 }, // 접수번호
    { wch: 10 }, // 성명
    { wch: 8 },  // 성별
    { wch: 12 }, // 생년월일
    { wch: 15 }, // 연락처
    { wch: 22 }, // 이메일
    { wch: 16 }, // 대학교
    { wch: 18 }, // 학과/전공
    { wch: 12 }, // 학번
    { wch: 14 }, // 학년/학기
    { wch: 10 }, // 재학상태
    { wch: 14 }, // 1지망
    { wch: 14 }, // 2지망
    { wch: 14 }, // 정기모임
    { wch: 30 }, // 면접희망일정
    { wch: 30 }, // 포트폴리오
    { wch: 12 }, // 심사상태
    { wch: 10 }, // 평가점수
    { wch: 30 }, // 운영진메모
    { wch: 18 }, // 지원일시
  ];

  XLSX.utils.book_append_sheet(wb, wsSummary, '01_지원자_명단');

  // Sheet 2: 자기소개서 서류 심사용 상세 시트
  const essayRows = applicants.map((app, idx) => ({
    '연번': idx + 1,
    '접수번호': app.id,
    '성명': app.name,
    '대학교 / 전공': `${app.university} ${app.major}`,
    '1지망 파트': app.primaryTrack,
    '[문항 1] 지원 동기 및 활동 목표': app.answers?.motivation || '',
    '[문항 2] 협업 경험 및 갈등 해결 사례': app.answers?.collaborativeExperience || '',
    '[문항 3] 직무적 강점 및 프로젝트 경험': app.answers?.technicalStrengths || '',
    '포트폴리오 URL': app.portfolioUrl || '없음',
    '심사 상태': app.status,
    '심사 점수': app.score || 0,
    '운영진 평가 메모': app.adminNotes || '',
  }));

  const wsEssays = XLSX.utils.json_to_sheet(essayRows);
  wsEssays['!cols'] = [
    { wch: 6 },
    { wch: 14 },
    { wch: 10 },
    { wch: 24 },
    { wch: 14 },
    { wch: 55 },
    { wch: 55 },
    { wch: 55 },
    { wch: 30 },
    { wch: 12 },
    { wch: 10 },
    { wch: 30 },
  ];

  XLSX.utils.book_append_sheet(wb, wsEssays, '02_자기소개서_상세');

  // Sheet 3: 파트별/상태별 통계 요약
  const trackCounts: Record<string, number> = {};
  const statusCounts: Record<string, number> = {};
  applicants.forEach((a) => {
    trackCounts[a.primaryTrack] = (trackCounts[a.primaryTrack] || 0) + 1;
    statusCounts[a.status] = (statusCounts[a.status] || 0) + 1;
  });

  const statsRows = [
    { '구분': '총 지원자 수', '상세': `${applicants.length}명`, '비고': '전체 접수 건' },
    { '구분': '---', '상세': '---', '비고': '---' },
    { '구분': '[파트별 지원 현황]', '상세': '', '비고': '' },
    ...Object.entries(trackCounts).map(([track, cnt]) => ({
      '구분': `  1지망: ${track}`,
      '상세': `${cnt}명`,
      '비고': `${((cnt / (applicants.length || 1)) * 100).toFixed(1)}%`,
    })),
    { '구분': '---', '상세': '---', '비고': '---' },
    { '구분': '[심사 상태별 현황]', '상세': '', '비고': '' },
    ...Object.entries(statusCounts).map(([st, cnt]) => ({
      '구분': `  상태: ${st}`,
      '상세': `${cnt}명`,
      '비고': `${((cnt / (applicants.length || 1)) * 100).toFixed(1)}%`,
    })),
  ];

  const wsStats = XLSX.utils.json_to_sheet(statsRows);
  wsStats['!cols'] = [{ wch: 25 }, { wch: 14 }, { wch: 14 }];
  XLSX.utils.book_append_sheet(wb, wsStats, '03_지원통계_요약');

  // Generate Excel file and trigger download
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const finalFilename = filename || `${clubName}_지원서_명단_${dateStr}.xlsx`;

  XLSX.writeFile(wb, finalFilename);
}

/**
 * Exports a single applicant's application sheet to Excel
 */
export function exportSingleApplicantToExcel(applicant: Applicant, clubName = '동아리'): void {
  const wb = XLSX.utils.book_new();

  const applicantInfo = [
    { '항목': '접수 번호', '내용': applicant.id },
    { '항목': '접수 일시', '내용': formatKoreanDate(applicant.createdAt) },
    { '항목': '성명', '내용': applicant.name },
    { '항목': '성별', '내용': applicant.gender },
    { '항목': '생년월일', '내용': applicant.birthDate },
    { '항목': '연락처', '내용': applicant.phone },
    { '항목': '이메일', '내용': applicant.email },
    { '항목': '소속 대학교', '내용': applicant.university },
    { '항목': '학과 / 전공', '내용': applicant.major },
    { '항목': '학번', '내용': applicant.studentId },
    { '항목': '학년 / 학기', '내용': `${applicant.academicYear} ${applicant.academicSemester}` },
    { '항목': '재학 상태', '내용': applicant.enrollmentStatus },
    { '항목': '1지망 지원 파트', '내용': applicant.primaryTrack },
    { '항목': '2지망 지원 파트', '내용': applicant.secondaryTrack },
    { '항목': '정기모임 참석 가능 여부', '내용': applicant.regularMeetingAttending },
    { '항목': '면접 가능 시간대', '내용': applicant.interviewSlots.join(', ') || '전체 가능' },
    { '항목': '포트폴리오 URL', '내용': applicant.portfolioUrl || '없음' },
    { '항목': '심사 상태', '내용': applicant.status },
    { '항목': '평가 점수', '내용': `${applicant.score || 0}점` },
    { '항목': '운영진 메모', '내용': applicant.adminNotes || '' },
    { '항목': '---', '내용': '----------------------------------------' },
    { '항목': '[문항 1] 지원 동기 및 활동 목표', '내용': applicant.answers.motivation },
    { '항목': '[문항 2] 협업 경험 및 갈등 해결', '내용': applicant.answers.collaborativeExperience },
    { '항목': '[문항 3] 직무적 강점 및 프로젝트 경험', '내용': applicant.answers.technicalStrengths },
  ];

  const ws = XLSX.utils.json_to_sheet(applicantInfo);
  ws['!cols'] = [{ wch: 30 }, { wch: 70 }];
  XLSX.utils.book_append_sheet(wb, ws, '지원서_상세');

  const safeName = applicant.name.replace(/[^a-zA-Z0-9가-힣]/g, '_');
  XLSX.writeFile(wb, `${clubName}_지원서_${safeName}_${applicant.id}.xlsx`);
}

/**
 * Exports applicants to UTF-8 CSV with BOM for legacy Excel compatibility
 */
export function exportApplicantsToCSV(applicants: Applicant[], filename = '지원자명단.csv'): void {
  const headers = [
    '접수번호',
    '성명',
    '성별',
    '생년월일',
    '연락처',
    '이메일',
    '대학교',
    '학과/전공',
    '학번',
    '학년/학기',
    '재학상태',
    '1지망',
    '2지망',
    '정기모임참석',
    '면접희망일정',
    '포트폴리오',
    '심사상태',
    '평가점수',
    '접수일시',
  ];

  const rows = applicants.map((app) => [
    `"${app.id}"`,
    `"${app.name}"`,
    `"${app.gender}"`,
    `"${app.birthDate}"`,
    `"${app.phone}"`,
    `"${app.email}"`,
    `"${app.university}"`,
    `"${app.major}"`,
    `"${app.studentId}"`,
    `"${app.academicYear} ${app.academicSemester}"`,
    `"${app.enrollmentStatus}"`,
    `"${app.primaryTrack}"`,
    `"${app.secondaryTrack}"`,
    `"${app.regularMeetingAttending}"`,
    `"${app.interviewSlots.join(' / ')}"`,
    `"${app.portfolioUrl || ''}"`,
    `"${app.status}"`,
    `"${app.score || 0}"`,
    `"${formatKoreanDate(app.createdAt)}"`,
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
