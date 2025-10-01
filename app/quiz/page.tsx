import { supabase } from '@/lib/supabase'
import type { EnglishCategory } from '@/lib/supabase'
import QuizPageClient from './QuizPageClient'

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

  return <QuizPageClient categoriesByGrade={categoriesByGrade} />
}
