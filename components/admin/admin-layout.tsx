"use client"

import Link from "next/link"
import { Container, Home, Plus, Download, Upload, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AdminLayoutProps {
  children: React.ReactNode
  onExport?: () => void
  onImport?: () => void
  onReset?: () => void
}

export function AdminLayout({ children, onExport, onImport, onReset }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link href="/admin" className="flex items-center gap-3 transition-opacity hover:opacity-80">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Container className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Administration</h1>
              <p className="text-xs text-muted-foreground">Docker Quiz Lab</p>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            {onExport && (
              <Button variant="outline" size="sm" onClick={onExport} className="gap-2">
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Exporter</span>
              </Button>
            )}
            {onImport && (
              <Button variant="outline" size="sm" onClick={onImport} className="gap-2">
                <Upload className="h-4 w-4" />
                <span className="hidden sm:inline">Importer</span>
              </Button>
            )}
            {onReset && (
              <Button variant="outline" size="sm" onClick={onReset} className="gap-2 text-destructive hover:text-destructive">
                <RotateCcw className="h-4 w-4" />
                <span className="hidden sm:inline">Reset</span>
              </Button>
            )}
            <Link href="/">
              <Button variant="default" size="sm" className="gap-2">
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline">Accueil</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-4 py-8">
        {children}
      </main>
    </div>
  )
}
