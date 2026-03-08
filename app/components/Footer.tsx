// app/components/Footer.tsx

import React from 'react';

export default function Footer() {
  return (
    <footer className="mt-20 flex w-full flex-col items-center border-t border-slate-800/80 bg-gradient-to-b from-[#0f172a] to-slate-900/50 pb-16 pt-12">
      <div className="flex w-full max-w-4xl flex-col items-center justify-between gap-10 px-4 md:flex-row md:items-start">
        {/* 1. 프로젝트 정보 영역 */}
        <div className="flex flex-col items-center text-center md:items-start md:text-left">
          {/* ✨ 푸터 로고에도 Atmos 그라데이션 통일 */}
          <h2 className="mb-2 bg-gradient-to-r from-violet-400 via-cyan-400 to-teal-300 bg-clip-text text-3xl font-black tracking-tighter text-transparent drop-shadow-sm">
            Atmos
          </h2>
          <p className="mt-1 max-w-xs text-sm font-medium leading-relaxed text-slate-500">
            사진작가를 위한 날씨 및 채광 시뮬레이터.
            <br />
            정확한 데이터로 완벽한 셔터 찬스를 잡으세요.
          </p>
        </div>

        {/* 2. 개발자 프로필 명함 영역 */}
        <div className="flex w-full flex-col items-center rounded-2xl border border-slate-700/50 bg-slate-800/40 p-5 shadow-lg backdrop-blur-sm transition-all hover:border-slate-600 hover:bg-slate-800/60 md:w-auto md:items-end">
          <span className="mb-1 text-[10px] font-bold uppercase tracking-widest text-slate-500">
            Developed By
          </span>
          <h3 className="mb-4 text-lg font-extrabold tracking-tight text-slate-200">
            PARK KYOUNGSEO
          </h3>

          {/* 링크 버튼 그룹 */}
          <div className="flex flex-wrap justify-center gap-2.5 md:justify-end">
            <a
              href="http://kkyungvelyy.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-400 shadow-sm transition-all hover:border-teal-500 hover:text-teal-400"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                />
              </svg>
              Portfolio
            </a>

            <a
              href="https://github.com/aihoshistar"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-400 shadow-sm transition-all hover:border-slate-300 hover:text-white"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.379.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z"
                />
              </svg>
              GitHub
            </a>

            <a
              href="https://troublesome-dev.tistory.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-400 shadow-sm transition-all hover:border-orange-500 hover:text-orange-400"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                />
              </svg>
              Tech Blog
            </a>
          </div>
        </div>
      </div>

      {/* 3. 저작권 (Copyright) 영역 */}
      <div className="mt-12 w-full px-4 text-center">
        <p className="text-xs font-medium tracking-wide text-slate-600">
          {/* ✨ 카피라이트 텍스트 Atmos로 변경 */}© {new Date().getFullYear()}{' '}
          <span className="font-bold text-slate-500">Atmos</span>. Designed &
          Developed by PARK KYOUNGSEO.
        </p>
      </div>
    </footer>
  );
}
