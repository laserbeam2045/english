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
  const inputRef = useRef<HTMLInputElement>(null)

  const currentWord = words[currentIndex]

  useEffect(() => {
    if (!isFinished && !showResult) {
      inputRef.current?.focus()
    }
  }, [currentIndex, showResult, isFinished])

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
      <main className="min-h-screen p-4 sm:p-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6 sm:mb-8 bg-white rounded-xl shadow-lg p-6 sm:p-8">
            <h1 className="text-2xl sm:text-4xl font-bold mb-4 text-gray-800">クイズ完了！</h1>
            <div className={`text-5xl sm:text-7xl font-bold mb-4 ${
              score >= 80 ? 'text-green-600' : score >= 60 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {score}点
            </div>
            <p className="text-lg sm:text-2xl text-gray-600">
              {correctCount} / {results.length} 問正解
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 sm:p-6 mb-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">結果詳細</h2>
            <div className="space-y-2 sm:space-y-3 max-h-[60vh] overflow-y-auto">
              {results.map((result, index) => (
                <div
                  key={index}
                  className={`p-3 sm:p-4 rounded-lg border-l-4 ${
                    result.isCorrect
                      ? 'bg-green-50 border-green-500'
                      : 'bg-red-50 border-red-500'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium mb-1 text-sm sm:text-base break-words">
                        {result.word.meanings[0]}
                      </div>
                      <div className="text-xs sm:text-sm">
                        <div className="mb-1">
                          <span className="text-gray-600">正解: </span>
                          <span className="font-semibold">{result.word.spell}</span>
                        </div>
                        {!result.isCorrect && (
                          <div>
                            <span className="text-gray-600">あなたの回答: </span>
                            <span className="text-red-600 font-semibold">{result.userAnswer || '(未入力)'}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-xl sm:text-2xl flex-shrink-0">
                      {result.isCorrect ? '✓' : '✗'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link
              href="/quiz"
              className="px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 active:scale-95 transition text-center font-semibold shadow-md"
            >
              別のクイズを選ぶ
            </Link>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 active:scale-95 transition font-semibold shadow-md"
            >
              もう一度挑戦
            </button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen p-4 sm:p-8 bg-gray-50">
      <div className="max-w-3xl mx-auto">
        {/* Header with quit button */}
        <div className="mb-4 sm:mb-6">
          <div className="flex justify-between items-center mb-3">
            <div className="flex-1">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                {categoryInfo.label}
              </h2>
              <p className="text-sm text-gray-500">{getGradeLabel(categoryInfo.grade)}</p>
            </div>
            <button
              onClick={handleQuit}
              className="px-4 py-2 text-sm sm:text-base text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition"
            >
              中断
            </button>
          </div>

          {/* Progress bar */}
          <div className="flex items-center gap-3">
            <span className="text-sm sm:text-base text-gray-600 whitespace-nowrap">
              {currentIndex + 1} / {words.length}
            </span>
            <div className="flex-1 bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / words.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 sm:p-8">
          {!showResult ? (
            <>
              <h2 className="text-base sm:text-xl text-gray-700 mb-4 sm:mb-6 text-center font-medium">
                次の意味の英単語を入力してください
              </h2>
              <div className="mb-6 sm:mb-8 p-6 sm:p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                <p className="text-xl sm:text-3xl text-center font-medium text-gray-800 leading-relaxed">
                  {currentWord.meanings[0]}
                </p>
                {currentWord.meanings.length > 1 && (
                  <div className="mt-4 text-xs sm:text-sm text-gray-500 text-center">
                    他の意味: {currentWord.meanings.slice(1).join(' / ')}
                  </div>
                )}
              </div>

              <form onSubmit={handleSubmit}>
                <input
                  ref={inputRef}
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  className="w-full text-xl sm:text-3xl p-4 sm:p-6 border-2 border-gray-200 rounded-xl mb-4 text-center focus:border-blue-500 focus:outline-none transition"
                  placeholder="英単語を入力"
                  autoComplete="off"
                  autoFocus
                />
                <button
                  type="submit"
                  className="w-full py-3 sm:py-4 bg-blue-600 text-white rounded-xl text-base sm:text-lg font-semibold hover:bg-blue-700 active:scale-95 transition shadow-md"
                >
                  回答する (Enter)
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-4" onKeyPress={handleKeyPress} tabIndex={0}>
              <div className={`text-6xl sm:text-8xl mb-6 ${results[results.length - 1].isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                {results[results.length - 1].isCorrect ? '○' : '✗'}
              </div>
              <div className="text-2xl sm:text-4xl font-bold mb-4 text-gray-800">
                {currentWord.spell}
              </div>
              {!results[results.length - 1].isCorrect && (
                <div className="text-base sm:text-xl text-gray-600 mb-4">
                  あなたの回答: <span className="text-red-600 font-semibold">{userAnswer || '(未入力)'}</span>
                </div>
              )}
              <div className="text-sm sm:text-lg text-gray-600 mb-8 px-4">
                {currentWord.meanings[0]}
              </div>
              <button
                onClick={handleNext}
                className="px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 text-white rounded-xl text-base sm:text-lg font-semibold hover:bg-blue-700 active:scale-95 transition shadow-md"
                autoFocus
              >
                {currentIndex < words.length - 1 ? '次へ (Enter)' : '結果を見る (Enter)'}
              </button>
            </div>
          )}
        </div>

        {/* Quit confirmation modal */}
        {showQuitConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 sm:p-8 max-w-md w-full shadow-2xl">
              <h3 className="text-xl sm:text-2xl font-bold mb-4">クイズを中断しますか？</h3>
              <p className="text-gray-600 mb-6">
                現在の進捗は保存されません。
              </p>
              <div className="flex gap-3">
                <button
                  onClick={cancelQuit}
                  className="flex-1 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition"
                >
                  続ける
                </button>
                <button
                  onClick={confirmQuit}
                  className="flex-1 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
                >
                  中断する
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
