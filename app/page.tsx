import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen p-4 sm:p-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-8 sm:mb-12 animate-fade-in">
          <div className="inline-block mb-4 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg">
            <span className="text-sm sm:text-base font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              ✨ English Learning App
            </span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-gray-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent leading-tight">
            英単語学習アプリ
          </h1>
          <p className="text-base sm:text-xl text-gray-700 font-medium">学年・カテゴリ別の単語学習とクイズ</p>
        </div>

        <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
          <Link
            href="/words"
            className="group relative p-6 sm:p-8 bg-white/90 backdrop-blur-sm border-2 border-gray-200 rounded-2xl hover:border-blue-400 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="text-5xl sm:text-6xl mb-3 sm:mb-4 transform group-hover:scale-110 transition-transform duration-300">📚</div>
              <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-gray-800 group-hover:text-blue-600 transition-colors">
                単語一覧
              </h2>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                学年・カテゴリ別に英単語を閲覧できます
              </p>
              <div className="mt-4 flex items-center text-blue-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-sm">詳しく見る</span>
                <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>

          <Link
            href="/quiz"
            className="group relative p-6 sm:p-8 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 border-2 border-blue-600 rounded-2xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 text-white overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.3),transparent)]"></div>
            </div>
            <div className="relative z-10">
              <div className="text-5xl sm:text-6xl mb-3 sm:mb-4 transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">🎯</div>
              <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 group-hover:scale-105 transition-transform">
                クイズに挑戦
              </h2>
              <p className="text-sm sm:text-base text-blue-50 leading-relaxed">
                英単語のスペルを当てるクイズで実力をチェック
              </p>
              <div className="mt-4 flex items-center text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-sm">今すぐ挑戦</span>
                <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </main>
  )
}
