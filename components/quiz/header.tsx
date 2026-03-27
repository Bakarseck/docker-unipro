"use client"

import Link from "next/link"
import { Container, Settings, BookOpen, LogIn, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"

export function Header() {
  const { user, logout } = useAuth()

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Container className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Docker Quiz Lab</h1>
            <p className="text-xs text-muted-foreground">Cours Docker & Conteneurisation</p>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          {user ? (
            <Button variant="outline" size="sm" className="gap-2" onClick={() => void logout()}>
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Deconnexion</span>
            </Button>
          ) : (
            <Link href="/auth">
              <Button variant="outline" size="sm" className="gap-2">
                <LogIn className="h-4 w-4" />
                <span className="hidden sm:inline">Connexion</span>
              </Button>
            </Link>
          )}
          <Link href="/cours">
            <Button variant="outline" size="sm" className="gap-2">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Cours</span>
            </Button>
          </Link>
          <Link href="/admin">
            <Button variant="outline" size="sm" className="gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Administration</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
