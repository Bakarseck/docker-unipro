"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, BookOpen, LogIn } from "lucide-react"
import type { Quiz } from "@/lib/quiz-types"
import { useAuth } from "@/lib/auth-context"

interface QuizCardProps {
  quiz: Quiz
}

export function QuizCard({ quiz }: QuizCardProps) {
  const { user, isLoading } = useAuth()
  const quizPath = `/quiz/${quiz.id}`
  const authHref = `/auth?redirect=${encodeURIComponent(quizPath)}`

  return (
    <Card className="group relative overflow-hidden transition-all hover:shadow-lg hover:border-primary/30">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      <CardHeader className="relative">
        <div className="flex items-start justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <BookOpen className="h-5 w-5 text-primary" />
          </div>
          <Badge variant="secondary" className="text-xs">
            {quiz.questions.length} questions
          </Badge>
        </div>
        <CardTitle className="mt-4 text-lg">{quiz.title}</CardTitle>
        <CardDescription className="line-clamp-2">{quiz.description}</CardDescription>
      </CardHeader>
      <CardContent className="relative">
        {isLoading ? (
          <Button className="w-full" disabled>
            Vérification…
          </Button>
        ) : user ? (
          <Link href={quizPath}>
            <Button className="w-full gap-2 group-hover:bg-primary">
              Commencer le quizz
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        ) : (
          <Link href={authHref}>
            <Button className="w-full gap-2 group-hover:bg-primary" variant="default">
              <LogIn className="h-4 w-4" />
              Se connecter pour jouer
            </Button>
          </Link>
        )}
      </CardContent>
    </Card>
  )
}
