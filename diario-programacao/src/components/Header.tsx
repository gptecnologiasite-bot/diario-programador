import { BookOpen, Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/hooks/useTheme'

interface HeaderProps {
  entryCount: number
  onNewEntry: () => void
}

export function Header({ entryCount, onNewEntry }: HeaderProps) {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <BookOpen className="size-5" />
          </div>
          <div className="text-left">
            <h1 className="text-lg font-semibold tracking-tight sm:text-xl">
              Diário de Programação
            </h1>
            <p className="text-xs text-muted-foreground sm:text-sm">
              {entryCount === 0
                ? 'Nenhuma entrada ainda'
                : `${entryCount} ${entryCount === 1 ? 'entrada' : 'entradas'}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Modo claro' : 'Modo escuro'}
          >
            {theme === 'dark' ? <Sun /> : <Moon />}
          </Button>
          <Button onClick={onNewEntry}>Nova entrada</Button>
        </div>
      </div>
    </header>
  )
}
