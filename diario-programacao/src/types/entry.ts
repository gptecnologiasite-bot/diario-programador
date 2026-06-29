export const ENTRY_MOODS = ['facil', 'medio', 'dificil'] as const
export type EntryMood = (typeof ENTRY_MOODS)[number]

export const SORT_OPTIONS = ['newest', 'oldest', 'hours-desc', 'hours-asc'] as const
export type SortOption = (typeof SORT_OPTIONS)[number]

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

