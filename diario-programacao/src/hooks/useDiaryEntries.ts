import { useCallback, useEffect, useState } from 'react'
import type { DiaryEntry, EntryFormData } from '@/types/entry'

const STORAGE_KEY = 'diario-programacao-entries'

/** Valida se um objeto tem a estrutura mínima de DiaryEntry */
function isValidEntry(obj: unknown): obj is DiaryEntry {
  if (!obj || typeof obj !== 'object') return false
  const e = obj as Record<string, unknown>
  return (
    typeof e.id === 'string' &&
    typeof e.title === 'string' &&
    typeof e.content === 'string' &&
    typeof e.date === 'string' &&
    Array.isArray(e.tags) &&
    typeof e.mood === 'string' &&
    typeof e.hoursSpent === 'number' &&
    typeof e.createdAt === 'string' &&
    typeof e.updatedAt === 'string'
  )
}

function loadEntries(): DiaryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(isValidEntry)
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

  /** Exporta todas as entradas como JSON para download */
  const exportEntries = useCallback(() => {
    const json = JSON.stringify(entries, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `diario-programacao-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }, [entries])

  /** Importa entradas de um arquivo JSON (mescla com as existentes, sem duplicar IDs) */
  const importEntries = useCallback((file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target?.result as string)
        if (!Array.isArray(parsed)) return
        const valid = parsed.filter(isValidEntry)
        setEntries((prev) => {
          const existingIds = new Set(prev.map((entry) => entry.id))
          const newEntries = valid.filter((entry) => !existingIds.has(entry.id))
          return [...newEntries, ...prev].sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          )
        })
      } catch {
        // arquivo inválido — ignora silenciosamente
      }
    }
    reader.readAsText(file)
  }, [])

  return { entries, addEntry, updateEntry, deleteEntry, exportEntries, importEntries }
}

