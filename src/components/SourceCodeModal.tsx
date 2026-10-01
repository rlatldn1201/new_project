import React, { useState } from 'react';
import JSZip from 'jszip';
import { Code2, Download, FileCode2, X } from 'lucide-react';
import packageJson from '../../package.json?raw';
import tsconfig from '../../tsconfig.json?raw';
import viteConfig from '../../vite.config.ts?raw';
import indexHtml from '../../index.html?raw';
import runBat from '../../run.bat?raw';

interface SourceCodeModalProps {
	isOpen: boolean;
	onClose: () => void;
}

const sourceFiles = import.meta.glob('/src/**/*.{ts,tsx,css}', {
	eager: true,
	query: '?raw',
	import: 'default',
}) as Record<string, string>;

const projectFiles: Record<string, string> = {
	...Object.fromEntries(
		Object.entries(sourceFiles).map(([path, content]) => [
			path.slice(1),
			content,
		])
	),
	'index.html': indexHtml,
	'package.json': packageJson,
	'run.bat': runBat,
	'tsconfig.json': tsconfig,
	'vite.config.ts': viteConfig,
	'README.txt': '동아리 모집 관리 앱\n\n1. Node.js를 설치합니다.\n2. 압축을 푼 폴더에서 npm install을 실행합니다.\n3. npm run dev를 실행해 개발 서버를 시작합니다.\n',
};

export const SourceCodeModal: React.FC<SourceCodeModalProps> = ({ isOpen, onClose }) => {
	const filePaths = Object.keys(projectFiles).sort();
	const [selectedFile, setSelectedFile] = useState(filePaths[0] ?? '');
	const [isDownloading, setIsDownloading] = useState(false);

	if (!isOpen) return null;

	const handleDownload = async () => {
		setIsDownloading(true);
		try {
			const zip = new JSZip();
			Object.entries(projectFiles).forEach(([path, content]) => zip.file(path, content));
			const blob = await zip.generateAsync({ type: 'blob' });
			const url = URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = url;
			link.download = 'club-recruitment-source.zip';
			link.click();
			URL.revokeObjectURL(url);
		} catch {
			alert('소스 코드 ZIP을 생성하지 못했습니다. 다시 시도해주세요.');
		} finally {
			setIsDownloading(false);
		}
	};

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-3 backdrop-blur-sm sm:p-6"
			onClick={onClose}
		>
			<section
				role="dialog"
				aria-modal="true"
				aria-labelledby="source-modal-title"
				className="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl"
				onClick={(event) => event.stopPropagation()}
			>
				<header className="flex items-center justify-between border-b border-slate-200 px-5 py-4 sm:px-6">
					<div className="flex items-center gap-3">
						<div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700">
							<Code2 className="h-5 w-5" />
						</div>
						<div>
							<h2 id="source-modal-title" className="text-base font-bold text-slate-900">프로젝트 소스 코드</h2>
							<p className="text-xs text-slate-500">{filePaths.length}개 파일 포함</p>
						</div>
					</div>
					<button
						type="button"
						onClick={onClose}
						aria-label="닫기"
						className="rounded-md p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
					>
						<X className="h-5 w-5" />
					</button>
				</header>

				<div className="grid min-h-0 flex-1 grid-cols-1 md:grid-cols-[220px_minmax(0,1fr)]">
					<nav aria-label="프로젝트 파일" className="max-h-36 overflow-y-auto border-b border-slate-200 p-2 md:max-h-none md:border-b-0 md:border-r">
						{filePaths.map((path) => (
							<button
								type="button"
								key={path}
								onClick={() => setSelectedFile(path)}
								className={`flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-xs transition-colors ${
									selectedFile === path
										? 'bg-indigo-50 font-semibold text-indigo-700'
										: 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
								}`}
							>
								<FileCode2 className="h-4 w-4 shrink-0" />
								<span className="truncate">{path}</span>
							</button>
						))}
					</nav>

					<div className="min-h-0 overflow-auto bg-slate-950">
						<div className="sticky top-0 border-b border-white/10 bg-slate-900 px-4 py-2.5 font-mono text-xs text-slate-300">
							{selectedFile}
						</div>
						<pre className="p-4 text-xs leading-5 text-slate-200 sm:p-5">
							<code>{projectFiles[selectedFile] ?? ''}</code>
						</pre>
					</div>
				</div>

				<footer className="flex flex-col-reverse items-stretch justify-between gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4 sm:flex-row sm:items-center sm:px-6">
					<p className="text-xs text-slate-500">압축 파일에 앱 소스와 실행 설정이 포함됩니다.</p>
					<button
						type="button"
						onClick={handleDownload}
						disabled={isDownloading}
						className="inline-flex items-center justify-center gap-2 rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:cursor-wait disabled:opacity-60"
					>
						<Download className="h-4 w-4" />
						{isDownloading ? 'ZIP 생성 중...' : '소스 ZIP 다운로드'}
					</button>
				</footer>
			</section>
		</div>
	);
};