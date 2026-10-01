@echo off
chcp 65001 > nul
title 동아리 회원 모집 지원서 실행기
echo ===================================================
echo [1/2] 필수 패키지 설치 진행 중... (npm install)
echo ===================================================
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [오류] Node.js가 설치되어 있지 않거나 설치 중 문제가 발생했습니다.
    echo '동아리_지원서_무설치_실행.html' 파일을 더블클릭하시면 설치 없이 바로 실행됩니다.
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo ===================================================
echo [2/2] 개발 서버 시작 중... (npm run dev)
echo ===================================================
call npm run dev
pause
