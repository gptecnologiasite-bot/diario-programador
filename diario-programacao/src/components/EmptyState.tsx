import { Code2, NotebookPen } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface EmptyStateProps {
  onNewEntry: () => void
}

export function EmptyState({ onNewEntry }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed bg-muted/20 px-6 py-16 text-center">
      <div className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <NotebookPen className="size-8" />
      </div>
      <h2 className="text-lg font-semibold">Comece seu diário hoje</h2>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        Registre o que aprendeu, os desafios que enfrentou e quanto tempo dedicou
        à programação. Suas entradas ficam salvas no navegador.
      </p>
      <Button className="mt-6 gap-2" onClick={onNewEntry}>
        <Code2 className="size-4" />
        Criar primeira entrada
      </Button>
    </div>
  )
}
