import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type { EntryMood } from '@/types/entry'

export function formatDate(date: string) {
  return format(parseISO(date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
}

export function formatShortDate(date: string) {
  return format(parseISO(date), 'dd/MM/yyyy')
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
