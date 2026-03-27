"use client"

import { useQuiz } from "@/lib/quiz-context"
import { QuizCard } from "./quiz-card"
import { Empty, EmptyDescription, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { BookOpen } from "lucide-react"

export function QuizList() {
  const { quizData } = useQuiz()

  if (quizData.quizzes.length === 0) {
    return (
      <Empty className="py-12">
        <EmptyMedia variant="icon">
          <BookOpen className="h-10 w-10" />
        </EmptyMedia>
        <EmptyTitle>Aucun quizz disponible</EmptyTitle>
        <EmptyDescription>
          {"Il n'y a pas encore de quizz. Ajoutez-en via l'administration."}
        </EmptyDescription>
      </Empty>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {quizData.quizzes.map((quiz) => (
        <QuizCard key={quiz.id} quiz={quiz} />
      ))}
    </div>
  )
}
