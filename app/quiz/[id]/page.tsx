"use client"

import { use, useState } from "react"
import { Header } from "@/components/quiz/header"
import { QuizPlayer } from "@/components/quiz/quiz-player"
import { QuizResults } from "@/components/quiz/quiz-results"
import { QuizProvider, useQuiz } from "@/lib/quiz-context"
import { Button } from "@/components/ui/button"
import { Empty, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty"
import { ArrowLeft, BookOpen } from "lucide-react"
import Link from "next/link"
import type { QuizResult } from "@/lib/quiz-types"
import { useAuth } from "@/lib/auth-context"
import { saveScore } from "@/lib/leaderboard"

function QuizPageContent({ quizId }: { quizId: string }) {
  const { quizData } = useQuiz()
  const { user, isLoading: authLoading } = useAuth()
  const [result, setResult] = useState<QuizResult | null>(null)

  const quiz = quizData.quizzes.find((q) => q.id === quizId)
  const authRedirect = `/auth?redirect=${encodeURIComponent(`/quiz/${quizId}`)}`

  if (authLoading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="text-muted-foreground">Vérification de votre session…</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <Empty className="py-12">
          <EmptyMedia variant="icon">
            <BookOpen className="h-6 w-6" />
          </EmptyMedia>
          <EmptyTitle>Connexion requise</EmptyTitle>
          <EmptyDescription>
            Pour lancer ce quizz, connectez-vous ou créez un compte avec votre e-mail et votre mot de passe.
          </EmptyDescription>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href={authRedirect}>
              <Button className="gap-2">Se connecter ou s&apos;inscrire</Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Retour à l&apos;accueil
              </Button>
            </Link>
          </div>
        </Empty>
      </div>
    )
  }

  if (!quiz) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <Empty className="py-12">
          <EmptyMedia variant="icon">
            <BookOpen className="h-6 w-6" />
          </EmptyMedia>
          <EmptyTitle>Quizz introuvable</EmptyTitle>
          <EmptyDescription>
            Le quizz demande n&apos;existe pas ou a ete supprime.
          </EmptyDescription>
          <Link href="/" className="mt-4">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Retour a l&apos;accueil
            </Button>
          </Link>
        </Empty>
      </div>
    )
  }

  if (quiz.questions.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <Empty className="py-12">
          <EmptyMedia variant="icon">
            <BookOpen className="h-6 w-6" />
          </EmptyMedia>
          <EmptyTitle>Quizz vide</EmptyTitle>
          <EmptyDescription>
            Ce quizz ne contient pas encore de questions. Ajoutez-en via l&apos;administration.
          </EmptyDescription>
          <Link href="/" className="mt-4">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Retour a l&apos;accueil
            </Button>
          </Link>
        </Empty>
      </div>
    )
  }

  const handleComplete = async (quizResult: QuizResult) => {
    setResult(quizResult)

    if (!user?.email) {
      return
    }

    try {
      await saveScore({
        userEmail: user.email,
        quizId: quizResult.quiz.id,
        quizTitle: quizResult.quiz.title,
        score: quizResult.score,
        totalQuestions: quizResult.totalQuestions,
      })
    } catch {
      console.error("Failed to save score in leaderboard")
    }
  }

  const handleRestart = () => {
    setResult(null)
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      {result ? (
        <QuizResults result={result} onRestart={handleRestart} />
      ) : (
        <QuizPlayer quiz={quiz} onComplete={handleComplete} />
      )}
    </main>
  )
}

export default function QuizPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  
  return (
    <QuizProvider>
      <div className="min-h-screen bg-background">
        <Header />
        <QuizPageContent quizId={id} />
      </div>
    </QuizProvider>
  )
}
