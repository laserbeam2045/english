import { supabase } from '@/lib/supabase'
import type { EnglishCategory } from '@/lib/supabase'
import Link from 'next/link'
import { getGradeLabel } from '@/lib/gradeLabels'

async function getCategories() {
  const { data, error } = await supabase
    .from('english_categories')
    .select('*')
    .order('grade', { ascending: true })
    .order('id', { ascending: true })

  if (error) throw error

  // Filter out unwanted categories
  const filtered = (data as EnglishCategory[]).filter(cat => {
    // Exclude grade=0 or category=0
    if (cat.grade === 0 || cat.id === 0) return false
    // Exclude grade=6 with category 16, 17, or 18
    if (cat.grade === 6 && (cat.id === 16 || cat.id === 17 || cat.id === 18)) return false
    return true
  })

  return filtered
}

export default async function QuizPage() {
  const categories = await getCategories()

  // Group categories by grade
  const categoriesByGrade = categories.reduce((acc, cat) => {
    if (!acc[cat.grade]) {
      acc[cat.grade] = []
    }
    acc[cat.grade].push(cat)
    return acc
  }, {} as Record<number, EnglishCategory[]>)

  return (
    <main className="min-h-screen p-4 sm:p-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <Link href="/" className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center text-sm sm:text-base">
            <span className="mr-1">←</span> ホームに戻る
          </Link>
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-800 mt-2">英単語クイズ</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2">学年とカテゴリを選択してクイズを開始</p>
        </div>

        <div className="space-y-4 sm:space-y-6">
          {Object.entries(categoriesByGrade).map(([gradeNum, cats]) => (
            <div key={gradeNum} className="p-4 sm:p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
              <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-gray-800">
                {getGradeLabel(parseInt(gradeNum))}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
                {cats.map((cat) => (
                  <Link
                    key={`${cat.grade}-${cat.id}`}
                    href={`/quiz/start?grade=${cat.grade}&category=${cat.id}`}
                    className="p-3 sm:p-4 border-2 border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-500 active:scale-95 transition text-center group"
                  >
                    <div className="font-medium text-sm sm:text-base text-gray-700 group-hover:text-blue-600 transition">
                      {cat.label}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
