'use client'

import Link from 'next/link'
import { getGradeLabel } from '@/lib/gradeLabels'
import type { EnglishCategory } from '@/lib/supabase'

type Props = {
  categoriesByGrade: Record<number, EnglishCategory[]>
}

export default function QuizPageClient({ categoriesByGrade }: Props) {
  return (
    <main className="min-h-screen p-4 sm:p-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="mb-6 sm:mb-8 animate-fade-in">
          <Link href="/" className="inline-flex items-center text-sm sm:text-base text-blue-600 hover:text-blue-800 mb-4 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:shadow-md transition-all group">
            <svg className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            ホームに戻る
          </Link>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-lg border border-white/50">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl sm:text-4xl">🎯</span>
              <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">英単語クイズ</h1>
            </div>
            <p className="text-sm sm:text-base text-gray-600 ml-12 sm:ml-14">学年とカテゴリを選択してクイズを開始しましょう</p>
          </div>
        </div>

        <div className="space-y-4 sm:space-y-6">
          {Object.entries(categoriesByGrade).map(([gradeNum, cats], idx) => (
            <div
              key={gradeNum}
              className="p-5 sm:p-7 bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 animate-slide-in"
              style={{animationDelay: `${idx * 100}ms`}}
            >
              <div className="flex items-center gap-3 mb-4 sm:mb-5">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg sm:text-xl shadow-md">
                  {gradeNum}
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                  {getGradeLabel(parseInt(gradeNum))}
                </h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
                {cats.map((cat) => (
                  <Link
                    key={`${cat.grade}-${cat.id}`}
                    href={`/quiz/start?grade=${cat.grade}&category=${cat.id}`}
                    className="group relative p-4 sm:p-5 border-2 border-gray-200 rounded-xl hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 hover:border-blue-400 active:scale-95 transition-all duration-200 text-center overflow-hidden shadow-sm hover:shadow-md"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400/0 to-indigo-400/0 group-hover:from-blue-400/10 group-hover:to-indigo-400/10 transition-all duration-300"></div>
                    <div className="relative z-10">
                      <div className="font-semibold text-sm sm:text-base text-gray-700 group-hover:text-blue-700 transition-colors mb-1">
                        {cat.label}
                      </div>
                      <div className="text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                        <span>始める</span>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-in {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        :global(.animate-fade-in) {
          animation: fade-in 0.6s ease-out;
        }
        :global(.animate-slide-in) {
          animation: slide-in 0.5s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </main>
  )
}
