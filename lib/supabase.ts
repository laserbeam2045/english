import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  db: {
    schema: 'english'
  }
})

// Type definitions for database tables
export type EnglishCategory = {
  grade: number
  id: number
  label: string
}

export type EnglishMean = {
  id: number
  flag: number
  mean: string
  created: string
  modified: string
}

export type EnglishSpell = {
  id: number
  spell: string
  grade: number
  category: number
  created: string
  modified: string
}

export type EnglishRelation = {
  spell_id: number
  mean_id: number
  created: string
  modified: string
}
