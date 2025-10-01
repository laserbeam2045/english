import { supabase } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import QuizClient from './QuizClient'

async function getQuizWords(grade: number, category: number) {
  const { data, error } = await supabase
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
    .eq('grade', grade)
    .eq('category', category)
    .limit(20)

  if (error) throw error

  // Shuffle and format data
  const words = data.map((word: any) => ({
    id: word.id,
    spell: word.spell,
    meanings: word.english_relations.map((rel: any) => rel.english_means.mean)
  }))

  // Shuffle array
  return words.sort(() => Math.random() - 0.5)
}

async function getCategoryInfo(grade: number, category: number) {
  const { data, error } = await supabase
    .from('english_categories')
    .select('*')
    .eq('grade', grade)
    .eq('id', category)
    .single()

  if (error) throw error
  return data
}

export default async function QuizStartPage({
  searchParams,
}: {
  searchParams: Promise<{ grade?: string; category?: string }>
}) {
  const params = await searchParams
  const grade = params.grade ? parseInt(params.grade) : undefined
  const category = params.category ? parseInt(params.category) : undefined

  if (grade === undefined || category === undefined) {
    redirect('/quiz')
  }

  const [words, categoryInfo] = await Promise.all([
    getQuizWords(grade, category),
    getCategoryInfo(grade, category)
  ])

  if (words.length === 0) {
    return (
      <main className="min-h-screen p-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">クイズデータがありません</h1>
          <p className="text-gray-600 mb-4">このカテゴリには単語が登録されていません。</p>
          <a href="/quiz" className="text-blue-600 hover:underline">
            ← カテゴリ選択に戻る
          </a>
        </div>
      </main>
    )
  }

  return (
    <QuizClient
      words={words}
      categoryInfo={categoryInfo}
    />
  )
}
