// Standalone single-file HTML version that runs immediately by double clicking in ANY browser without Node.js or npm!
export const STANDALONE_HTML = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>동아리 회원 모집 지원서 & 엑셀 관리자 (단일 실행본)</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdn.sheetjs.com/xlsx-0.20.1/package/dist/xlsx.full.min.js"></script>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" />
  <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <style>
    body { font-family: "Pretendard", -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif; }
  </style>
</head>
<body class="bg-slate-50 text-slate-900 min-h-screen">
  <div id="root"></div>

  <script type="text/babel">
    const { useState, useEffect, useMemo } = React;

    const INITIAL_APPLICANTS = [
      {
        id: 'APP-2026-001',
        createdAt: '2026-03-02 14:20',
        name: '김서연',
        gender: '여성',
        birthDate: '2004-05-18',
        phone: '010-3849-1928',
        email: 'seoyeon.kim@univ.ac.kr',
        university: '연세대학교',
        major: '컴퓨터과학과',
        studentId: '2023142055',
        academicYear: '2학년 1학기',
        enrollmentStatus: '재학',
        primaryTrack: '프론트엔드 개발',
        secondaryTrack: 'UI/UX 디자인',
        regularMeetingAttending: '가능',
        interviewSlots: ['2026-03-24 (화) 저녁'],
        portfolioUrl: 'https://github.com/seoyeon-dev',
        answers: {
          motivation: '웹 서비스를 기획부터 개발, 런칭까지 동료들과 완주해보고 싶어 지원했습니다.',
          collaborativeExperience: '해커톤에서 프레임워크 선정 이견을 표와 데이터로 조율해 우수상을 수상했습니다.',
          technicalStrengths: 'React와 TypeScript, Tailwind CSS를 이용한 반응형 UI 개발에 능숙합니다.'
        },
        status: '서류합격',
        score: 92,
        adminNotes: '포트폴리오 완성도 높음'
      },
      {
        id: 'APP-2026-002',
        createdAt: '2026-03-03 18:30',
        name: '이도현',
        gender: '남성',
        birthDate: '2002-11-09',
        phone: '010-8271-9482',
        email: 'dohyun.lee@korea.ac.kr',
        university: '고려대학교',
        major: '경영학과',
        studentId: '2021180324',
        academicYear: '3학년 1학기',
        enrollmentStatus: '재학',
        primaryTrack: '기획/PM',
        secondaryTrack: '마케팅/대외협력',
        regularMeetingAttending: '가능',
        interviewSlots: ['2026-03-25 (수) 저녁'],
        portfolioUrl: 'https://notion.so/dohyun-pm',
        answers: {
          motivation: '캠퍼스 라이프 페인포인트를 해결하는 IT 프로덕트 로드맵을 설계하고 싶습니다.',
          collaborativeExperience: '플리마켓 예약 서비스 기획 시 핵심 기능 우선순위를 조정해 런칭했습니다.',
          technicalStrengths: 'Figma 와이어프레임 설계와 유저 저니 맵 작성에 강점이 있습니다.'
        },
        status: '면접대기',
        score: 88,
        adminNotes: '기획서 논리 우수'
      }
    ];

    function App() {
      const [tab, setTab] = useState('apply'); // 'apply' | 'admin'
      const [applicants, setApplicants] = useState(() => {
        const saved = localStorage.getItem('standalone_club_applicants');
        return saved ? JSON.parse(saved) : INITIAL_APPLICANTS;
      });

      // Form States
      const [name, setName] = useState('');
      const [birthDate, setBirthDate] = useState('');
      const [phone, setPhone] = useState('');
      const [email, setEmail] = useState('');
      const [university, setUniversity] = useState('');
      const [major, setMajor] = useState('');
      const [studentId, setStudentId] = useState('');
      const [track, setTrack] = useState('프론트엔드 개발');
      const [motivation, setMotivation] = useState('');
      const [collaboration, setCollaboration] = useState('');
      const [strengths, setStrengths] = useState('');
      const [portfolioUrl, setPortfolioUrl] = useState('');
      const [lastSubmitted, setLastSubmitted] = useState(null);

      // Search & Filters for Admin
      const [search, setSearch] = useState('');

      useEffect(() => {
        localStorage.setItem('standalone_club_applicants', JSON.stringify(applicants));
      }, [applicants]);

      const handleFillSample = () => {
        setName('박지민');
        setBirthDate('2004-03-15');
        setPhone('010-9876-5432');
        setEmail('jimin.park@univ.ac.kr');
        setUniversity('성균관대학교');
        setMajor('소프트웨어학과');
        setStudentId('2023314050');
        setTrack('백엔드 개발');
        setMotivation('실제 동작하는 대용량 API 서버와 데이터베이스 아키텍처를 동아리 팀원들과 구축하고 싶습니다.');
        setCollaboration('팀 과제 시 스키마 변경 충돌을 깃허브 PR과 롤백 스크립트로 신속히 해결했습니다.');
        setStrengths('Spring Boot, Java, MySQL 기반 REST API 구축 경험이 있습니다.');
        setPortfolioUrl('https://github.com/jimin-backend');
      };

      const handleSubmit = (e) => {
        e.preventDefault();
        if (!name || !phone || !university || !major || !studentId) {
          alert('필수 정보를 입력해주세요.');
          return;
        }

        const newId = 'APP-2026-' + String(applicants.length + 1).padStart(3, '0');
        const now = new Date();
        const dateStr = now.getFullYear() + '-' + String(now.getMonth()+1).padStart(2,'0') + '-' + String(now.getDate()).padStart(2,'0') + ' ' + String(now.getHours()).padStart(2,'0') + ':' + String(now.getMinutes()).padStart(2,'0');

        const newApp = {
          id: newId,
          createdAt: dateStr,
          name,
          gender: '선택',
          birthDate,
          phone,
          email,
          university,
          major,
          studentId,
          academicYear: '2학년',
          enrollmentStatus: '재학',
          primaryTrack: track,
          secondaryTrack: '없음',
          regularMeetingAttending: '가능',
          interviewSlots: ['조율 가능'],
          portfolioUrl,
          answers: { motivation, collaborativeExperience: collaboration, technicalStrengths: strengths },
          status: '접수완료',
          score: 0,
          adminNotes: ''
        };

        const updated = [newApp, ...applicants];
        setApplicants(updated);
        setLastSubmitted(newApp);

        // Auto Export Excel immediately!
        exportSingleToExcel(newApp);
      };

      // Export ALL to Excel (.xlsx)
      const exportAllToExcel = () => {
        const wb = XLSX.utils.book_new();

        // Sheet 1: 지원자 명단
        const rows1 = applicants.map((a, idx) => ({
          '연번': idx + 1,
          '접수번호': a.id,
          '성명': a.name,
          '대학교': a.university,
          '학과/전공': a.major,
          '학번': a.studentId,
          '연락처': a.phone,
          '이메일': a.email,
          '1지망 파트': a.primaryTrack,
          '심사 상태': a.status,
          '평가 점수': a.score || 0,
          '접수일시': a.createdAt
        }));
        const ws1 = XLSX.utils.json_to_sheet(rows1);
        XLSX.utils.book_append_sheet(wb, ws1, '01_지원자_명단');

        // Sheet 2: 자기소개서
        const rows2 = applicants.map((a, idx) => ({
          '접수번호': a.id,
          '성명': a.name,
          '지원분야': a.primaryTrack,
          '지원동기': a.answers?.motivation || '',
          '협업경험': a.answers?.collaborativeExperience || '',
          '직무강점': a.answers?.technicalStrengths || '',
          '포트폴리오': a.portfolioUrl || ''
        }));
        const ws2 = XLSX.utils.json_to_sheet(rows2);
        XLSX.utils.book_append_sheet(wb, ws2, '02_자기소개서_상세');

        XLSX.writeFile(wb, '동아리_지원자_전체명단_' + new Date().toISOString().slice(0,10) + '.xlsx');
      };

      // Export Single to Excel (.xlsx)
      const exportSingleToExcel = (app) => {
        const wb = XLSX.utils.book_new();
        const data = [
          { '항목': '접수번호', '내용': app.id },
          { '항목': '성명', '내용': app.name },
          { '항목': '대학교', '내용': app.university },
          { '항목': '학과/학번', '내용': app.major + ' (' + app.studentId + ')' },
          { '항목': '연락처', '내용': app.phone },
          { '항목': '이메일', '내용': app.email },
          { '항목': '지원 파트', '내용': app.primaryTrack },
          { '항목': '포트폴리오', '내용': app.portfolioUrl || '없음' },
          { '항목': '---', '내용': '------------------------------' },
          { '항목': '[문항 1] 지원 동기', '내용': app.answers?.motivation || '' },
          { '항목': '[문항 2] 협업 경험', '내용': app.answers?.collaborativeExperience || '' },
          { '항목': '[문항 3] 직무 강점', '내용': app.answers?.technicalStrengths || '' }
        ];
        const ws = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(wb, ws, '지원서_상세');
        XLSX.writeFile(wb, '지원서_' + app.name + '_' + app.id + '.xlsx');
      };

      const filtered = applicants.filter(a =>
        a.name.includes(search) || a.university.includes(search) || a.major.includes(search) || a.primaryTrack.includes(search)
      );

      return (
        <div>
          {/* Header */}
          <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center">C</div>
                <span className="font-bold text-lg text-slate-900">대학생 동아리 회원 모집 지원서</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setTab('apply')}
                  className={'px-3.5 py-1.5 rounded-lg text-xs font-semibold ' + (tab === 'apply' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700')}
                >
                  지원서 작성
                </button>
                <button
                  onClick={() => setTab('admin')}
                  className={'px-3.5 py-1.5 rounded-lg text-xs font-semibold ' + (tab === 'admin' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700')}
                >
                  운영진 관리자 ({applicants.length}명)
                </button>
                <button
                  onClick={exportAllToExcel}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white ml-2 flex items-center gap-1 shadow-xs"
                >
                  <span>📊 엑셀 전체 다운로드 (.xlsx)</span>
                </button>
              </div>
            </div>
          </header>

          {/* Main Body */}
          <main className="max-w-4xl mx-auto px-4 py-8">
            {tab === 'apply' ? (
              <div>
                {lastSubmitted ? (
                  <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm text-center space-y-4">
                    <div className="text-emerald-600 text-5xl">✅</div>
                    <h2 className="text-2xl font-bold">지원서가 성공적으로 접수되었습니다!</h2>
                    <p className="text-slate-600 text-sm">접수번호: <strong className="font-mono text-indigo-600">{lastSubmitted.id}</strong></p>
                    <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-left text-sm space-y-2">
                      <p className="font-bold text-emerald-900">⚡ 엑셀(.xlsx) 파일이 자동으로 다운로드되었습니다.</p>
                      <p className="text-emerald-800 text-xs">브라우저 다운로드 폴더에서 즉시 엑셀 파일을 열어보실 수 있습니다.</p>
                      <button
                        onClick={() => exportSingleToExcel(lastSubmitted)}
                        className="mt-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg"
                      >
                        내 지원서 엑셀 파일 다시 받기
                      </button>
                    </div>
                    <button
                      onClick={() => setLastSubmitted(null)}
                      className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg"
                    >
                      새로운 지원서 추가 작성
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
                    <div className="flex items-center justify-between border-b pb-4">
                      <div>
                        <h2 className="text-xl font-bold text-slate-900">2026학년도 신입 부원 지원서</h2>
                        <p className="text-xs text-slate-500 mt-0.5">입력 후 제출하시면 실시간으로 엑셀(.xlsx) 파일로 변환 저장됩니다.</p>
                      </div>
                      <button
                        type="button"
                        onClick={handleFillSample}
                        className="px-3 py-1.5 text-xs bg-indigo-50 text-indigo-700 font-semibold rounded-lg hover:bg-indigo-100 border border-indigo-200"
                      >
                        ⚡ 예시 데이터 자동 채우기
                      </button>
                    </div>

                    {/* Section 1: 인적사항 */}
                    <div className="space-y-4">
                      <h3 className="text-sm font-bold text-slate-800 border-l-4 border-indigo-600 pl-2">01. 기본 인적사항</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold mb-1">성명 *</label>
                          <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="홍길동" className="w-full px-3 py-2 border rounded-lg text-sm" />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold mb-1">생년월일</label>
                          <input type="date" value={birthDate} onChange={e => setBirthDate(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold mb-1">휴대폰 번호 *</label>
                          <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} required placeholder="010-0000-0000" className="w-full px-3 py-2 border rounded-lg text-sm" />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold mb-1">이메일 주소 *</label>
                          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="univ@example.com" className="w-full px-3 py-2 border rounded-lg text-sm" />
                        </div>
                      </div>
                    </div>

                    {/* Section 2: 학적 */}
                    <div className="space-y-4 pt-2">
                      <h3 className="text-sm font-bold text-slate-800 border-l-4 border-indigo-600 pl-2">02. 학적 정보</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-semibold mb-1">소속 대학교 *</label>
                          <input type="text" value={university} onChange={e => setUniversity(e.target.value)} required placeholder="예: 한국대학교" className="w-full px-3 py-2 border rounded-lg text-sm" />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold mb-1">전공 / 학과 *</label>
                          <input type="text" value={major} onChange={e => setMajor(e.target.value)} required placeholder="컴퓨터공학과" className="w-full px-3 py-2 border rounded-lg text-sm" />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold mb-1">학번 *</label>
                          <input type="text" value={studentId} onChange={e => setStudentId(e.target.value)} required placeholder="202412345" className="w-full px-3 py-2 border rounded-lg text-sm" />
                        </div>
                      </div>
                    </div>

                    {/* Section 3: 지원 파트 */}
                    <div className="space-y-4 pt-2">
                      <h3 className="text-sm font-bold text-slate-800 border-l-4 border-indigo-600 pl-2">03. 지원 파트 & 포트폴리오</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold mb-1">희망 지원 파트 *</label>
                          <select value={track} onChange={e => setTrack(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm bg-white">
                            <option value="프론트엔드 개발">프론트엔드 개발</option>
                            <option value="백엔드 개발">백엔드 개발</option>
                            <option value="UI/UX 디자인">UI/UX 디자인</option>
                            <option value="기획/PM">기획/PM</option>
                            <option value="마케팅/대외협력">마케팅/대외협력</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold mb-1">포트폴리오 URL (선택)</label>
                          <input type="url" value={portfolioUrl} onChange={e => setPortfolioUrl(e.target.value)} placeholder="https://github.com/..." className="w-full px-3 py-2 border rounded-lg text-sm" />
                        </div>
                      </div>
                    </div>

                    {/* Section 4: 자기소개서 */}
                    <div className="space-y-4 pt-2">
                      <h3 className="text-sm font-bold text-slate-800 border-l-4 border-indigo-600 pl-2">04. 자기소개서 문항</h3>
                      <div>
                        <label className="block text-xs font-bold mb-1">[문항 1] 지원 동기 및 동아리에서 달성하고 싶은 목표</label>
                        <textarea rows={3} value={motivation} onChange={e => setMotivation(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="자유롭게 작성해주세요." />
                      </div>
                      <div>
                        <label className="block text-xs font-bold mb-1">[문항 2] 협업 및 갈등 해결 경험</label>
                        <textarea rows={3} value={collaboration} onChange={e => setCollaboration(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="팀 프로젝트 경험을 기술해주세요." />
                      </div>
                      <div>
                        <label className="block text-xs font-bold mb-1">[문항 3] 직무적 강점 및 프로젝트 몰입 경험</label>
                        <textarea rows={3} value={strengths} onChange={e => setStrengths(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="자신만의 강점을 적어주세요." />
                      </div>
                    </div>

                    <div className="pt-4 border-t flex justify-end">
                      <button
                        type="submit"
                        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-sm text-sm"
                      >
                        지원서 제출 & 엑셀(.xlsx)로 저장하기
                      </button>
                    </div>
                  </form>
                )}
              </div>
            ) : (
              /* Admin Dashboard */
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">운영진 관리자 콘솔</h2>
                    <p className="text-xs text-slate-500">총 {applicants.length}명의 지원서가 등록되어 있습니다.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={exportAllToExcel}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs"
                    >
                      엑셀 전체 다운로드 (.xlsx)
                    </button>
                  </div>
                </div>

                <input
                  type="text"
                  placeholder="이름, 대학교, 전공, 파트 검색..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b">
                        <th className="p-2.5">접수번호</th>
                        <th className="p-2.5">성명</th>
                        <th className="p-2.5">대학교/학과</th>
                        <th className="p-2.5">학번</th>
                        <th className="p-2.5">지원 파트</th>
                        <th className="p-2.5">상태</th>
                        <th className="p-2.5">엑셀</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {filtered.map(app => (
                        <tr key={app.id} className="hover:bg-slate-50">
                          <td className="p-2.5 font-mono text-indigo-600 font-bold">{app.id}</td>
                          <td className="p-2.5 font-bold">{app.name}</td>
                          <td className="p-2.5">{app.university} {app.major}</td>
                          <td className="p-2.5 font-mono">{app.studentId}</td>
                          <td className="p-2.5 font-semibold text-slate-700">{app.primaryTrack}</td>
                          <td className="p-2.5">
                            <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-semibold">{app.status}</span>
                          </td>
                          <td className="p-2.5">
                            <button
                              onClick={() => exportSingleToExcel(app)}
                              className="px-2 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded font-semibold border border-emerald-200"
                            >
                              개별 엑셀
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </main>
        </div>
      );
    }

    ReactDOM.createRoot(document.getElementById('root')).render(<App />);
  </script>
</body>
</html>
`;
