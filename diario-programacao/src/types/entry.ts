export type EntryMood = 'facil' | 'medio' | 'dificil'

export interface DiaryEntry {
  id: string
  title: string
  content: string
  date: string
  tags: string[]
  mood: EntryMood
  hoursSpent: number
  createdAt: string
  updatedAt: string
}

export type EntryFormData = Omit<DiaryEntry, 'id' | 'createdAt' | 'updatedAt'>
