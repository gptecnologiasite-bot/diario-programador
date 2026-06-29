import { useMemo, useState } from 'react'
import { EntryCard } from '@/components/EntryCard'
import { EntryDialog } from '@/components/EntryDialog'
import { EntryFilters } from '@/components/EntryFilters'
import { EmptyState } from '@/components/EmptyState'
import { Header } from '@/components/Header'
import { useDiaryEntries } from '@/hooks/useDiaryEntries'
import type { DiaryEntry, EntryMood, SortOption } from '@/types/entry'

const sortLabels: Record<SortOption, string> = {
  newest: 'Mais recentes',
  oldest: 'Mais antigas',
  'hours-desc': 'Mais horas',
  'hours-asc': 'Menos horas',
}

export default function App() {
  const { entries, addEntry, updateEntry, deleteEntry, exportEntries, importEntries } =
    useDiaryEntries()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingEntry, setEditingEntry] = useState<DiaryEntry | null>(null)
  const [search, setSearch] = useState('')
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [selectedMood, setSelectedMood] = useState<EntryMood | null>(null)
  const [sortBy, setSortBy] = useState<SortOption>('newest')

  const allTags = useMemo(() => {
    const tagSet = new Set<string>()
    entries.forEach((entry) => entry.tags.forEach((tag) => tagSet.add(tag)))
    return Array.from(tagSet).sort()
  }, [entries])

  const totalHours = useMemo(
    () => entries.reduce((sum, entry) => sum + entry.hoursSpent, 0),
    [entries],
  )

  const filteredEntries = useMemo(() => {
    const query = search.trim().toLowerCase()

    const filtered = entries.filter((entry) => {
      const matchesTag = !selectedTag || entry.tags.includes(selectedTag)
      const matchesMood = !selectedMood || entry.mood === selectedMood
      const matchesSearch =
        !query ||
        entry.title.toLowerCase().includes(query) ||
        entry.content.toLowerCase().includes(query) ||
        entry.tags.some((tag) => tag.includes(query))

      return matchesTag && matchesMood && matchesSearch
    })

    // Ordenação
    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case 'hours-desc':
          return b.hoursSpent - a.hoursSpent
        case 'hours-asc':
          return a.hoursSpent - b.hoursSpent
        default:
          return 0
      }
    })
  }, [entries, search, selectedTag, selectedMood, sortBy])

  const openCreateDialog = () => {
    setEditingEntry(null)
    setDialogOpen(true)
  }

  const openEditDialog = (entry: DiaryEntry) => {
    setEditingEntry(entry)
    setDialogOpen(true)
  }

  const handleSubmit = (data: Parameters<typeof addEntry>[0]) => {
    if (editingEntry) {
      updateEntry(editingEntry.id, data)
    } else {
      addEntry(data)
    }
  }

  const handleImport = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) importEntries(file)
    }
    input.click()
  }

  return (
    <div className="min-h-svh bg-background">
      <Header
        entryCount={entries.length}
        onNewEntry={openCreateDialog}
        onExport={exportEntries}
        onImport={handleImport}
      />

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        {entries.length > 0 && (
          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            <StatCard label="Entradas" value={String(entries.length)} />
            <StatCard label="Horas registradas" value={`${totalHours}h`} />
            <StatCard label="Tags únicas" value={String(allTags.length)} />
          </div>
        )}

        {entries.length > 0 && (
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Ordenação */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground">Ordenar:</span>
              <div className="flex flex-wrap gap-1">
                {(Object.keys(sortLabels) as SortOption[]).map((option) => (
                  <button
                    key={option}
                    onClick={() => setSortBy(option)}
                    className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                      sortBy === option
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {sortLabels[option]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {entries.length > 0 && (
          <div className="mb-8">
            <EntryFilters
              search={search}
              onSearchChange={setSearch}
              tags={allTags}
              selectedTag={selectedTag}
              onTagSelect={setSelectedTag}
              selectedMood={selectedMood}
              onMoodSelect={setSelectedMood}
              filteredCount={filteredEntries.length}
              totalCount={entries.length}
            />
          </div>
        )}

        {entries.length === 0 ? (
          <EmptyState onNewEntry={openCreateDialog} />
        ) : filteredEntries.length === 0 ? (
          <div className="rounded-xl border border-dashed px-6 py-12 text-center text-sm text-muted-foreground">
            Nenhuma entrada encontrada com os filtros atuais.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {filteredEntries.map((entry) => (
              <EntryCard
                key={entry.id}
                entry={entry}
                onEdit={openEditDialog}
                onDelete={deleteEntry}
              />
            ))}
          </div>
        )}
      </main>

      <EntryDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        entry={editingEntry}
        onSubmit={handleSubmit}
      />
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border bg-card p-4 text-left shadow-sm">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-semibold tracking-tight">{value}</p>
    </div>
  )
}
