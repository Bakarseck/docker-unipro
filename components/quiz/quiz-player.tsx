"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react"
import type { Quiz, UserAnswer, QuizResult } from "@/lib/quiz-types"

interface QuizPlayerProps {
  quiz: Quiz
  onComplete: (result: QuizResult) => void
}

export function QuizPlayer({ quiz, onComplete }: QuizPlayerProps) {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<UserAnswer[]>(
    quiz.questions.map((q) => ({ questionId: q.id, selectedIndex: null }))
  )

  const currentQuestion = quiz.questions[currentIndex]
  const progress = ((currentIndex + 1) / quiz.questions.length) * 100
  const currentAnswer = answers.find((a) => a.questionId === currentQuestion.id)

  const handleAnswerChange = (value: string) => {
    const selectedIndex = parseInt(value, 10)
    setAnswers((prev) =>
      prev.map((a) =>
        a.questionId === currentQuestion.id ? { ...a, selectedIndex } : a
      )
    )
  }

  const handleNext = () => {
    if (currentIndex < quiz.questions.length - 1) {
      setCurrentIndex((prev) => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1)
    }
  }

  const handleSubmit = () => {
    const score = answers.reduce((acc, answer) => {
      const question = quiz.questions.find((q) => q.id === answer.questionId)
      if (question && answer.selectedIndex === question.answerIndex) {
        return acc + 1
      }
      return acc
    }, 0)

    onComplete({
      quiz,
      userAnswers: answers,
      score,
      totalQuestions: quiz.questions.length,
    })
  }

  const isLastQuestion = currentIndex === quiz.questions.length - 1
  const hasAnsweredCurrent = currentAnswer?.selectedIndex !== null

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Progress Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Question {currentIndex + 1} sur {quiz.questions.length}</span>
          <span className="font-medium text-primary">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question Card */}
      <Card className="border-2">
        <CardHeader>
          <CardDescription className="text-xs uppercase tracking-wide text-primary">
            {quiz.title}
          </CardDescription>
          <CardTitle className="text-xl leading-relaxed">
            {currentQuestion.question}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={currentAnswer?.selectedIndex?.toString() ?? ""}
            onValueChange={handleAnswerChange}
            className="space-y-3"
          >
            {currentQuestion.options.map((option, index) => (
              <div
                key={index}
                className={`flex items-center space-x-3 rounded-lg border p-4 transition-all cursor-pointer hover:bg-secondary/50 ${
                  currentAnswer?.selectedIndex === index
                    ? "border-primary bg-primary/5"
                    : "border-border"
                }`}
                onClick={() => handleAnswerChange(index.toString())}
              >
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <Label
                  htmlFor={`option-${index}`}
                  className="flex-1 cursor-pointer text-sm leading-relaxed"
                >
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={currentIndex === 0 ? () => router.push("/") : handlePrevious}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          {currentIndex === 0 ? "Accueil" : "Precedent"}
        </Button>

        {isLastQuestion ? (
          <Button
            onClick={handleSubmit}
            disabled={!hasAnsweredCurrent}
            className="gap-2"
          >
            <CheckCircle className="h-4 w-4" />
            Terminer le quizz
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            disabled={!hasAnsweredCurrent}
            className="gap-2"
          >
            Suivant
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
