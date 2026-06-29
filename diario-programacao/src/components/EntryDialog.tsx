import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { ENTRY_MOODS, moodLabels } from '@/lib/format'
import type { DiaryEntry, EntryFormData, EntryMood } from '@/types/entry'

interface EntryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  entry?: DiaryEntry | null
  onSubmit: (data: EntryFormData) => void
}

const defaultForm: EntryFormData = {
  title: '',
  content: '',
  date: new Date().toISOString().slice(0, 10),
  tags: [],
  mood: 'medio',
  hoursSpent: 1,
}

const MIN_TITLE = 3
const MIN_CONTENT = 10

export function EntryDialog({ open, onOpenChange, entry, onSubmit }: EntryDialogProps) {
  const [form, setForm] = useState<EntryFormData>(defaultForm)
  const [tagsInput, setTagsInput] = useState('')
  const [touched, setTouched] = useState({ title: false, content: false })

  useEffect(() => {
    if (open) {
      if (entry) {
        setForm({
          title: entry.title,
          content: entry.content,
          date: entry.date,
          tags: entry.tags,
          mood: entry.mood,
          hoursSpent: entry.hoursSpent,
        })
        setTagsInput(entry.tags.join(', '))
      } else {
        setForm({ ...defaultForm, date: new Date().toISOString().slice(0, 10) })
        setTagsInput('')
      }
      setTouched({ title: false, content: false })
    }
  }, [open, entry])

  const titleError =
    touched.title && form.title.trim().length < MIN_TITLE
      ? `Mínimo ${MIN_TITLE} caracteres`
      : null

  const contentError =
    touched.content && form.content.trim().length < MIN_CONTENT
      ? `Mínimo ${MIN_CONTENT} caracteres`
      : null

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    setTouched({ title: true, content: true })
    if (form.title.trim().length < MIN_TITLE || form.content.trim().length < MIN_CONTENT) return

    // Remove tags duplicadas e normaliza
    const tags = Array.from(
      new Set(
        tagsInput
          .split(',')
          .map((tag) => tag.trim().toLowerCase())
          .filter(Boolean),
      ),
    )

    onSubmit({ ...form, tags })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <form onSubmit={handleSubmit} noValidate>
          <DialogHeader>
            <DialogTitle>{entry ? 'Editar entrada' : 'Nova entrada'}</DialogTitle>
            <DialogDescription>
              Documente seu progresso, aprendizados e desafios do dia.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Título */}
            <div className="grid gap-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                onBlur={() => setTouched((t) => ({ ...t, title: true }))}
                placeholder="Ex: Aprendi hooks no React"
                aria-invalid={!!titleError}
                aria-describedby={titleError ? 'title-error' : undefined}
              />
              {titleError && (
                <p id="title-error" className="text-xs text-destructive">
                  {titleError}
                </p>
              )}
            </div>

            {/* Conteúdo */}
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="content">Conteúdo</Label>
                <span className="text-xs text-muted-foreground">
                  {form.content.length} caracteres
                </span>
              </div>
              <Textarea
                id="content"
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                onBlur={() => setTouched((t) => ({ ...t, content: true }))}
                placeholder="O que você estudou, praticou ou construiu hoje?"
                rows={6}
                aria-invalid={!!contentError}
                aria-describedby={contentError ? 'content-error' : undefined}
              />
              {contentError && (
                <p id="content-error" className="text-xs text-destructive">
                  {contentError}
                </p>
              )}
            </div>

            {/* Data + Horas */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="date">Data</Label>
                <Input
                  id="date"
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="hours">Horas dedicadas</Label>
                <Input
                  id="hours"
                  type="number"
                  min={0.5}
                  max={24}
                  step={0.5}
                  value={form.hoursSpent}
                  onChange={(e) =>
                    setForm({ ...form, hoursSpent: Number(e.target.value) })
                  }
                  required
                />
              </div>
            </div>

            {/* Dificuldade */}
            <div className="grid gap-2">
              <Label>Dificuldade</Label>
              <Select
                value={form.mood}
                onValueChange={(value) => setForm({ ...form, mood: value as EntryMood })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {ENTRY_MOODS.map((mood) => (
                    <SelectItem key={mood} value={mood}>
                      {moodLabels[mood]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Tags */}
            <div className="grid gap-2">
              <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
              <Input
                id="tags"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="react, typescript, algoritmos"
              />
              <p className="text-xs text-muted-foreground">
                Duplicatas são removidas automaticamente.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">{entry ? 'Salvar' : 'Adicionar'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
