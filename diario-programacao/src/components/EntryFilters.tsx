import { Search, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface EntryFiltersProps {
  search: string
  onSearchChange: (value: string) => void
  tags: string[]
  selectedTag: string | null
  onTagSelect: (tag: string | null) => void
}

export function EntryFilters({
  search,
  onSearchChange,
  tags,
  selectedTag,
  onTagSelect,
}: EntryFiltersProps) {
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar por título, conteúdo ou tag..."
          className="pl-9"
        />
      </div>

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
          {selectedTag && (
            <Button variant="ghost" size="xs" onClick={() => onTagSelect(null)}>
              <X className="size-3" />
              Limpar
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
