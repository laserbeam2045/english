import { supabase } from '@/lib/supabase'
import type { EnglishCategory, EnglishSpell, EnglishMean } from '@/lib/supabase'
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

async function getWords(grade?: number, category?: number) {
  let query = supabase
    .from('english_spells')
    .select(`
      id,
      spell,
      grade,
      category,
      english_relations!inner (
        english_means!inner (
          id,
          mean
        )
      )
    `)
    .order('id', { ascending: true })
    .limit(50)

  if (grade !== undefined) {
    query = query.eq('grade', grade)
  }
  if (category !== undefined) {
    query = query.eq('category', category)
  }

  const { data, error } = await query

  if (error) throw error
  return data
}

export default async function WordsPage({
  searchParams,
}: {
  searchParams: Promise<{ grade?: string; category?: string }>
}) {
  const params = await searchParams
  const grade = params.grade ? parseInt(params.grade) : undefined
  const category = params.category ? parseInt(params.category) : undefined

  const categories = await getCategories()
  const words = await getWords(grade, category)

  // Group categories by grade
  const categoriesByGrade = categories.reduce((acc, cat) => {
    if (!acc[cat.grade]) {
      acc[cat.grade] = []
    }
    acc[cat.grade].push(cat)
    return acc
  }, {} as Record<number, EnglishCategory[]>)

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">
            ← ホームに戻る
          </Link>
          <h1 className="text-4xl font-bold">単語一覧</h1>
        </div>

        {/* Filter Section */}
        <div className="mb-8 p-6 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">フィルター</h2>

          <div className="space-y-4">
            {Object.entries(categoriesByGrade).map(([gradeNum, cats]) => (
              <div key={gradeNum}>
                <h3 className="font-medium mb-2">
                  {getGradeLabel(parseInt(gradeNum))}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {cats.map((cat) => {
                    const isActive = grade === cat.grade && category === cat.id
                    return (
                      <Link
                        key={`${cat.grade}-${cat.id}`}
                        href={`/words?grade=${cat.grade}&category=${cat.id}`}
                        className={`px-3 py-1 rounded text-sm transition ${
                          isActive
                            ? 'bg-blue-600 text-white'
                            : 'bg-white border hover:bg-gray-100'
                        }`}
                      >
                        {cat.label}
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          {(grade !== undefined || category !== undefined) && (
            <div className="mt-4">
              <Link
                href="/words"
                className="text-blue-600 hover:underline text-sm"
              >
                フィルターをクリア
              </Link>
            </div>
          )}
        </div>

        {/* Words List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">
            {words.length > 0
              ? `${words.length}件の単語（最大50件まで表示）`
              : '単語が見つかりません'}
          </h2>

          <div className="grid gap-4">
            {words.map((word: any) => (
              <div key={word.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-2xl font-bold">{word.spell}</h3>
                  <span className="text-sm text-gray-500">
                    {getGradeLabel(word.grade)} / {word.category}
                  </span>
                </div>
                <div className="space-y-1">
                  {word.english_relations.map((rel: any, idx: number) => (
                    <p key={idx} className="text-gray-700">
                      {rel.english_means.mean}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
