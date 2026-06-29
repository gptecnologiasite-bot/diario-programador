import { Clock, Pencil, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { formatDate, moodColors, moodLabels } from '@/lib/format'
import type { DiaryEntry } from '@/types/entry'

interface EntryCardProps {
  entry: DiaryEntry
  onEdit: (entry: DiaryEntry) => void
  onDelete: (id: string) => void
}

export function EntryCard({ entry, onEdit, onDelete }: EntryCardProps) {
  return (
    <Card className="text-left transition-shadow hover:shadow-md">
      <CardHeader className="gap-2">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <CardTitle className="text-base leading-snug">{entry.title}</CardTitle>
          <Badge className={moodColors[entry.mood]}>{moodLabels[entry.mood]}</Badge>
        </div>
        <CardDescription>{formatDate(entry.date)}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-3">
        <p className="line-clamp-4 text-sm leading-relaxed whitespace-pre-wrap">
          {entry.content}
        </p>

        {entry.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {entry.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="justify-between gap-2 border-t bg-muted/30">
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="size-3.5" />
          {entry.hoursSpent}h de estudo
        </span>

        <div className="flex gap-1">
          <Button variant="ghost" size="icon-sm" onClick={() => onEdit(entry)}>
            <Pencil />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onDelete(entry.id)}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
