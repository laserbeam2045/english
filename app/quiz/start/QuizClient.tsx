'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import confetti from 'canvas-confetti'
import { getGradeLabel } from '@/lib/gradeLabels'

type QuizWord = {
  id: number
  spell: string
  meanings: string[]
}

type QuizResult = {
  word: QuizWord
  userAnswer: string
  isCorrect: boolean
}

type Props = {
  words: QuizWord[]
  categoryInfo: {
    grade: number
    id: number
    label: string
  }
}

export default function QuizClient({ words, categoryInfo }: Props) {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [results, setResults] = useState<QuizResult[]>([])
  const [showResult, setShowResult] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  const [showQuitConfirm, setShowQuitConfirm] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Detect if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
    }
    checkMobile()
  }, [])

  const currentWord = words[currentIndex]

  // Hide the answer word in the meaning text
  const hideMeaningWord = (meaning: string, spell: string): string => {
    // Simple case-insensitive replacement
    const regex = new RegExp(spell, 'gi')
    return meaning.replace(regex, '___')
  }

  // Remove auto-focus effect entirely

  // Trigger confetti for high scores
  useEffect(() => {
    if (isFinished) {
      const correctCount = results.filter(r => r.isCorrect).length
      const score = Math.round((correctCount / results.length) * 100)

      if (score >= 80) {
        const duration = 3000
        const end = Date.now() + duration

        const frame = () => {
          confetti({
            particleCount: 3,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#4F46E5', '#06B6D4', '#10B981', '#F59E0B']
          })
          confetti({
            particleCount: 3,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#4F46E5', '#06B6D4', '#10B981', '#F59E0B']
          })

          if (Date.now() < end) {
            requestAnimationFrame(frame)
          }
        }

        frame()
      }
    }
  }, [isFinished, results])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const isCorrect = userAnswer.trim().toLowerCase() === currentWord.spell.toLowerCase()

    const result: QuizResult = {
      word: currentWord,
      userAnswer: userAnswer.trim(),
      isCorrect
    }

    setResults([...results, result])
    setShowResult(true)

    // Blur input on mobile to hide keyboard
    if (isMobile) {
      inputRef.current?.blur()
    }

    // Smooth scroll to top with ease-out
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  const handleNext = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setUserAnswer('')
      setShowResult(false)
    } else {
      setIsFinished(true)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (showResult && e.key === 'Enter') {
      handleNext()
    }
  }

  const handleQuit = () => {
    setShowQuitConfirm(true)
  }

  const confirmQuit = () => {
    router.push('/quiz')
  }

  const cancelQuit = () => {
    setShowQuitConfirm(false)
    inputRef.current?.focus()
  }

  if (isFinished) {
    const correctCount = results.filter(r => r.isCorrect).length
    const score = Math.round((correctCount / results.length) * 100)

    return (
      <main className="min-h-screen p-4 sm:p-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 right-10 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-6 sm:mb-8 bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 sm:p-12 border-2 border-white/50 animate-scale-in">
            <div className="text-6xl sm:text-8xl mb-4 animate-bounce-in">
              {score >= 80 ? '🎉' : score >= 60 ? '👍' : '💪'}
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              クイズ完了！
            </h1>
            <div className={`text-7xl sm:text-9xl font-black mb-6 animate-pop-in ${
              score >= 80 ? 'text-green-600' : score >= 60 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {score}
              <span className="text-4xl sm:text-5xl">点</span>
            </div>
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full">
              <span className="text-2xl">{score >= 80 ? '🏆' : score >= 60 ? '⭐' : '📝'}</span>
              <p className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
                {correctCount} / {results.length} 問正解
              </p>
            </div>
            {score >= 80 && (
              <p className="mt-4 text-lg sm:text-xl font-semibold text-green-600 animate-fade-in">
                素晴らしい！完璧です！
              </p>
            )}
            {score >= 60 && score < 80 && (
              <p className="mt-4 text-lg sm:text-xl font-semibold text-yellow-600 animate-fade-in">
                よくできました！
              </p>
            )}
            {score < 60 && (
              <p className="mt-4 text-lg sm:text-xl font-semibold text-gray-600 animate-fade-in">
                復習して再挑戦しましょう！
              </p>
            )}
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/50 p-5 sm:p-7 mb-6 animate-slide-up">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl font-bold">📋</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-800 to-blue-800 bg-clip-text text-transparent">
                結果詳細
              </h2>
            </div>
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
              {results.map((result, index) => (
                <div
                  key={index}
                  className={`p-4 sm:p-5 rounded-2xl border-l-4 transform hover:scale-102 transition-all duration-200 shadow-md ${
                    result.isCorrect
                      ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-500'
                      : 'bg-gradient-to-r from-red-50 to-rose-50 border-red-500'
                  }`}
                  style={{animationDelay: `${index * 50}ms`}}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="font-bold mb-2 text-base sm:text-lg break-words text-gray-800">
                        {result.word.meanings[0]}
                      </div>
                      <div className="text-sm sm:text-base space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600 font-medium">正解:</span>
                          <span className="font-bold text-green-700">{result.word.spell}</span>
                        </div>
                        {!result.isCorrect && (
                          <div className="flex items-center gap-2">
                            <span className="text-gray-600 font-medium">回答:</span>
                            <span className="font-bold text-red-600">{result.userAnswer || '(未入力)'}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className={`text-3xl sm:text-4xl flex-shrink-0 ${result.isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                      {result.isCorrect ? '✓' : '✗'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{animationDelay: '200ms'}}>
            <Link
              href="/quiz"
              className="group px-8 py-4 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-2xl hover:from-gray-700 hover:to-gray-800 active:scale-95 transition-all text-center font-bold shadow-xl hover:shadow-2xl text-lg"
            >
              <span className="flex items-center justify-center gap-2">
                <span>別のクイズを選ぶ</span>
                <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </Link>
            <button
              onClick={() => window.location.reload()}
              className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl hover:from-blue-700 hover:to-indigo-700 active:scale-95 transition-all font-bold shadow-xl hover:shadow-2xl text-lg"
            >
              <span className="flex items-center justify-center gap-2">
                <span>もう一度挑戦</span>
                <span className="text-xl transform group-hover:rotate-180 transition-transform">🔄</span>
              </span>
            </button>
          </div>
        </div>

        <style jsx>{`
          @keyframes scale-in {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
          }
          @keyframes pop-in {
            0% { opacity: 0; transform: scale(0.5); }
            50% { transform: scale(1.1); }
            100% { opacity: 1; transform: scale(1); }
          }
          @keyframes bounce-in {
            0% { transform: translateY(-100px) scale(0); opacity: 0; }
            50% { transform: translateY(0) scale(1.2); }
            100% { transform: translateY(0) scale(1); opacity: 1; }
          }
          @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slide-up {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-scale-in {
            animation: scale-in 0.5s ease-out;
          }
          .animate-pop-in {
            animation: pop-in 0.6s ease-out;
          }
          .animate-bounce-in {
            animation: bounce-in 0.8s ease-out;
          }
          .animate-fade-in {
            animation: fade-in 0.8s ease-out 0.5s forwards;
            opacity: 0;
          }
          .animate-slide-up {
            animation: slide-up 0.5s ease-out forwards;
            opacity: 0;
          }
        `}</style>
      </main>
    )
  }

  return (
    <main className="min-h-screen p-4 sm:p-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '1.5s'}}></div>
      </div>

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Header with quit button */}
        <div className="mb-4 sm:mb-6">
          <div className="flex justify-between items-center mb-3 bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/50">
            <div className="flex-1">
              <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {categoryInfo.label}
              </h2>
              <p className="text-xs sm:text-sm text-gray-600">{getGradeLabel(categoryInfo.grade)}</p>
            </div>
            <button
              onClick={handleQuit}
              className="px-4 py-2 text-sm sm:text-base text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all font-medium border border-gray-200 hover:border-red-200"
            >
              中断
            </button>
          </div>

          {/* Progress bar */}
          <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/50">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm sm:text-base shadow-md">
                {currentIndex + 1}
              </div>
              <span className="text-sm sm:text-base text-gray-600 font-medium">/ {words.length}</span>
            </div>
            <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
              <div
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-500 shadow-lg"
                style={{ width: `${((currentIndex + 1) / words.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/50 p-6 sm:p-10 animate-scale-in">
          {!showResult ? (
            <>
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full mb-4">
                  <span className="text-2xl">💡</span>
                  <span className="text-sm sm:text-base font-semibold text-blue-700">問題 {currentIndex + 1}</span>
                </div>
                <h2 className="text-base sm:text-xl text-gray-700 font-medium">
                  次の意味の英単語を入力してください
                </h2>
              </div>

              <div className="mb-6 sm:mb-8 p-6 sm:p-10 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl border-2 border-blue-200 shadow-lg transform hover:scale-105 transition-transform duration-300">
                <p className="text-xl sm:text-2xl text-center font-bold bg-gradient-to-r from-gray-800 to-blue-800 bg-clip-text text-transparent leading-relaxed">
                  {hideMeaningWord(currentWord.meanings[0], currentWord.spell)}
                </p>
                {currentWord.meanings.length > 1 && (
                  <div className="mt-4 text-xs sm:text-sm text-gray-600 text-center font-medium">
                    他の意味: {currentWord.meanings.slice(1).map(m => hideMeaningWord(m, currentWord.spell)).join(' / ')}
                  </div>
                )}
              </div>

              <form onSubmit={handleSubmit}>
                <input
                  ref={inputRef}
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  className="w-full text-lg sm:text-xl p-4 sm:p-5 border-2 border-gray-300 rounded-xl text-center focus:border-blue-500 focus:ring-4 focus:ring-blue-200 focus:outline-none transition-all shadow-lg font-semibold"
                  placeholder="英単語を入力してEnter"
                  autoComplete="off"
                />
              </form>
            </>
          ) : (
            <div className="text-center py-4 animate-pop-in" onKeyPress={handleKeyPress} tabIndex={0}>
              <div className={`text-8xl sm:text-9xl mb-6 animate-bounce-in ${results[results.length - 1].isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                {results[results.length - 1].isCorrect ? '○' : '✗'}
              </div>
              <div className="text-3xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-800 to-blue-800 bg-clip-text text-transparent">
                {currentWord.spell}
              </div>
              {!results[results.length - 1].isCorrect && (
                <div className="text-base sm:text-xl text-gray-600 mb-6 p-4 bg-red-50 rounded-xl border border-red-200">
                  あなたの回答: <span className="text-red-600 font-bold">{userAnswer || '(未入力)'}</span>
                </div>
              )}
              <div className="text-base sm:text-xl text-gray-700 mb-8 px-4 font-medium">
                {currentWord.meanings[0]}
              </div>
              <button
                onClick={handleNext}
                className="px-8 sm:px-12 py-4 sm:py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl text-base sm:text-xl font-bold hover:from-blue-700 hover:to-indigo-700 active:scale-95 transition-all shadow-xl hover:shadow-2xl"
              >
                {currentIndex < words.length - 1 ? '次へ (Enter)' : '結果を見る (Enter)'}
              </button>
            </div>
          )}
        </div>

        {/* Quit confirmation modal */}
        {showQuitConfirm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl border-2 border-gray-100 animate-scale-in">
              <div className="text-center mb-4">
                <div className="text-5xl mb-3">⚠️</div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800">クイズを中断しますか？</h3>
              </div>
              <p className="text-gray-600 mb-6 text-center">
                現在の進捗は保存されません。
              </p>
              <div className="flex gap-3">
                <button
                  onClick={cancelQuit}
                  className="flex-1 py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 rounded-xl font-bold hover:from-gray-200 hover:to-gray-300 transition-all shadow-md hover:shadow-lg"
                >
                  続ける
                </button>
                <button
                  onClick={confirmQuit}
                  className="flex-1 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-bold hover:from-red-700 hover:to-red-800 transition-all shadow-md hover:shadow-lg"
                >
                  中断する
                </button>
              </div>
            </div>
          </div>
        )}

        <style jsx>{`
          @keyframes scale-in {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
          @keyframes pop-in {
            0% { opacity: 0; transform: scale(0.8); }
            50% { transform: scale(1.05); }
            100% { opacity: 1; transform: scale(1); }
          }
          @keyframes bounce-in {
            0% { transform: scale(0); }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); }
          }
          @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          .animate-scale-in {
            animation: scale-in 0.3s ease-out;
          }
          .animate-pop-in {
            animation: pop-in 0.4s ease-out;
          }
          .animate-bounce-in {
            animation: bounce-in 0.5s ease-out;
          }
          .animate-fade-in {
            animation: fade-in 0.3s ease-out;
          }
        `}</style>
      </div>
    </main>
  )
}
