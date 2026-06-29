import { Search, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { moodColors, moodLabels, ENTRY_MOODS } from '@/lib/format'
import type { EntryMood } from '@/types/entry'

interface EntryFiltersProps {
  search: string
  onSearchChange: (value: string) => void
  tags: string[]
  selectedTag: string | null
  onTagSelect: (tag: string | null) => void
  selectedMood: EntryMood | null
  onMoodSelect: (mood: EntryMood | null) => void
  filteredCount: number
  totalCount: number
}

export function EntryFilters({
  search,
  onSearchChange,
  tags,
  selectedTag,
  onTagSelect,
  selectedMood,
  onMoodSelect,
  filteredCount,
  totalCount,
}: EntryFiltersProps) {
  const hasActiveFilter = search.trim() || selectedTag || selectedMood

  return (
    <div className="space-y-4">
      {/* Busca */}
      <div className="relative">
        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar por título, conteúdo ou tag..."
          className="pl-9"
          aria-label="Buscar entradas"
        />
      </div>

      {/* Filtro por dificuldade */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-muted-foreground">Dificuldade:</span>
        <Button
          variant={selectedMood === null ? 'default' : 'outline'}
          size="xs"
          onClick={() => onMoodSelect(null)}
        >
          Todas
        </Button>
        {ENTRY_MOODS.map((mood) => (
          <Badge
            key={mood}
            variant={selectedMood === mood ? 'default' : 'outline'}
            className={`cursor-pointer px-2.5 py-1 ${selectedMood !== mood ? moodColors[mood] : ''}`}
            onClick={() => onMoodSelect(selectedMood === mood ? null : mood)}
          >
            {moodLabels[mood]}
          </Badge>
        ))}
      </div>

      {/* Filtro por tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">Tags:</span>
          <Button
            variant={selectedTag === null ? 'default' : 'outline'}
            size="xs"
            onClick={() => onTagSelect(null)}
          >
            Todas
          </Button>
          {tags.map((tag) => (
            <Badge
              key={tag}
              variant={selectedTag === tag ? 'default' : 'outline'}
              className="cursor-pointer px-2.5 py-1"
              onClick={() => onTagSelect(selectedTag === tag ? null : tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
      )}

      {/* Resultado + limpar filtros */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          {hasActiveFilter
            ? `${filteredCount} de ${totalCount} ${totalCount === 1 ? 'entrada' : 'entradas'}`
            : `${totalCount} ${totalCount === 1 ? 'entrada' : 'entradas'} no total`}
        </p>
        {hasActiveFilter && (
          <Button
            variant="ghost"
            size="xs"
            onClick={() => {
              onSearchChange('')
              onTagSelect(null)
              onMoodSelect(null)
            }}
          >
            <X className="size-3" />
            Limpar filtros
          </Button>
        )}
      </div>
    </div>
  )
}
