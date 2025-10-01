import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen p-4 sm:p-8 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-5xl font-bold mb-3 sm:mb-4 text-gray-800">英単語学習アプリ</h1>
          <p className="text-base sm:text-lg text-gray-600">学年・カテゴリ別の単語学習とクイズ</p>
        </div>

        <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
          <Link
            href="/words"
            className="p-6 sm:p-8 bg-white border-2 border-gray-200 rounded-xl hover:border-blue-400 hover:shadow-lg transition-all group"
          >
            <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">📚</div>
            <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-gray-800 group-hover:text-blue-600 transition">
              単語一覧
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              学年・カテゴリ別に英単語を閲覧できます
            </p>
          </Link>

          <Link
            href="/quiz"
            className="p-6 sm:p-8 bg-gradient-to-br from-blue-600 to-indigo-600 border-2 border-blue-600 rounded-xl hover:shadow-xl transition-all group text-white"
          >
            <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">🎯</div>
            <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 group-hover:scale-105 transition">
              クイズに挑戦
            </h2>
            <p className="text-sm sm:text-base text-blue-100">
              英単語のスペルを当てるクイズで実力をチェック
            </p>
          </Link>
        </div>
      </div>
    </main>
  )
}
