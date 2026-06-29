import { useCallback, useEffect, useState } from 'react'
import type { DiaryEntry, EntryFormData } from '@/types/entry'

const STORAGE_KEY = 'diario-programacao-entries'

function loadEntries(): DiaryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as DiaryEntry[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveEntries(entries: DiaryEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
}

export function useDiaryEntries() {
  const [entries, setEntries] = useState<DiaryEntry[]>(() => loadEntries())

  useEffect(() => {
    saveEntries(entries)
  }, [entries])

  const addEntry = useCallback((data: EntryFormData) => {
    const now = new Date().toISOString()
    const entry: DiaryEntry = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    }
    setEntries((prev) => [entry, ...prev])
  }, [])

  const updateEntry = useCallback((id: string, data: EntryFormData) => {
    setEntries((prev) =>
      prev.map((entry) =>
        entry.id === id
          ? { ...entry, ...data, updatedAt: new Date().toISOString() }
          : entry,
      ),
    )
  }, [])

  const deleteEntry = useCallback((id: string) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== id))
  }, [])

  return { entries, addEntry, updateEntry, deleteEntry }
}
