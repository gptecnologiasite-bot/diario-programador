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

export function EntryDialog({ open, onOpenChange, entry, onSubmit }: EntryDialogProps) {
  const [form, setForm] = useState<EntryFormData>(defaultForm)
  const [tagsInput, setTagsInput] = useState('')

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
    }
  }, [open, entry])

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!form.title.trim() || !form.content.trim()) return

    const tags = tagsInput
      .split(',')
      .map((tag) => tag.trim().toLowerCase())
      .filter(Boolean)

    onSubmit({ ...form, tags })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{entry ? 'Editar entrada' : 'Nova entrada'}</DialogTitle>
            <DialogDescription>
              Documente seu progresso, aprendizados e desafios do dia.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Ex: Aprendi hooks no React"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="content">Conteúdo</Label>
              <Textarea
                id="content"
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                placeholder="O que você estudou, praticou ou construiu hoje?"
                rows={6}
                required
              />
            </div>

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

            <div className="grid gap-2">
              <Label>Dificuldade</Label>
              <Select
                value={form.mood}
                onValueChange={(value) =>
                  setForm({ ...form, mood: value as EntryMood })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="facil">Fácil</SelectItem>
                  <SelectItem value="medio">Médio</SelectItem>
                  <SelectItem value="dificil">Difícil</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
              <Input
                id="tags"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="react, typescript, algoritmos"
              />
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
