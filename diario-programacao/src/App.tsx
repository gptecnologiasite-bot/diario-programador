import { useMemo, useState } from 'react'
import { EntryCard } from '@/components/EntryCard'
import { EntryDialog } from '@/components/EntryDialog'
import { EntryFilters } from '@/components/EntryFilters'
import { EmptyState } from '@/components/EmptyState'
import { Header } from '@/components/Header'
import { useDiaryEntries } from '@/hooks/useDiaryEntries'
import type { DiaryEntry } from '@/types/entry'

export default function App() {
  const { entries, addEntry, updateEntry, deleteEntry } = useDiaryEntries()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingEntry, setEditingEntry] = useState<DiaryEntry | null>(null)
  const [search, setSearch] = useState('')
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  const allTags = useMemo(() => {
    const tagSet = new Set<string>()
    entries.forEach((entry) => entry.tags.forEach((tag) => tagSet.add(tag)))
    return Array.from(tagSet).sort()
  }, [entries])

  const filteredEntries = useMemo(() => {
    const query = search.trim().toLowerCase()

    return entries.filter((entry) => {
      const matchesTag = !selectedTag || entry.tags.includes(selectedTag)
      const matchesSearch =
        !query ||
        entry.title.toLowerCase().includes(query) ||
        entry.content.toLowerCase().includes(query) ||
        entry.tags.some((tag) => tag.includes(query))

      return matchesTag && matchesSearch
    })
  }, [entries, search, selectedTag])

  const totalHours = useMemo(
    () => entries.reduce((sum, entry) => sum + entry.hoursSpent, 0),
    [entries],
  )

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

  return (
    <div className="min-h-svh bg-background">
      <Header entryCount={entries.length} onNewEntry={openCreateDialog} />

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        {entries.length > 0 && (
          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            <StatCard label="Entradas" value={String(entries.length)} />
            <StatCard label="Horas registradas" value={`${totalHours}h`} />
            <StatCard label="Tags únicas" value={String(allTags.length)} />
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
