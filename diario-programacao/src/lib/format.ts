import { format, formatDistanceToNow, isValid, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ENTRY_MOODS } from '@/types/entry'
import type { EntryMood } from '@/types/entry'

export { ENTRY_MOODS }

export function formatDate(date: string) {
  const parsed = parseISO(date)
  if (!isValid(parsed)) return date
  return format(parsed, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
}

export function formatShortDate(date: string) {
  const parsed = parseISO(date)
  if (!isValid(parsed)) return date
  return format(parsed, 'dd/MM/yyyy')
}

/** Retorna "há 2 dias", "há 1 hora", etc. */
export function formatRelativeDate(isoString: string) {
  const parsed = parseISO(isoString)
  if (!isValid(parsed)) return isoString
  return formatDistanceToNow(parsed, { addSuffix: true, locale: ptBR })
}

export const moodLabels: Record<EntryMood, string> = {
  facil: 'Fácil',
  medio: 'Médio',
  dificil: 'Difícil',
}

export const moodColors: Record<EntryMood, string> = {
  facil: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300',
  medio: 'bg-amber-500/15 text-amber-700 dark:text-amber-300',
  dificil: 'bg-rose-500/15 text-rose-700 dark:text-rose-300',
}

