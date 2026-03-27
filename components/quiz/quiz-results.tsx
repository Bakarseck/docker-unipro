"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Home, RotateCcw, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import type { QuizResult } from "@/lib/quiz-types"

interface QuizResultsProps {
  result: QuizResult
  onRestart: () => void
}

export function QuizResults({ result, onRestart }: QuizResultsProps) {
  const { quiz, userAnswers, score, totalQuestions } = result
  const percentage = Math.round((score / totalQuestions) * 100)

  const getScoreColor = () => {
    if (percentage >= 80) return "text-success"
    if (percentage >= 60) return "text-chart-4"
    return "text-destructive"
  }

  const getScoreMessage = () => {
    if (percentage >= 80) return "Excellent travail !"
    if (percentage >= 60) return "Bien joue !"
    return "Continuez a reviser !"
  }

  const getScoreIcon = () => {
    if (percentage >= 80) return <CheckCircle className="h-12 w-12 text-success" />
    if (percentage >= 60) return <AlertCircle className="h-12 w-12 text-chart-4" />
    return <XCircle className="h-12 w-12 text-destructive" />
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Score Card */}
      <Card className="border-2 text-center">
        <CardHeader className="pb-2">
          <div className="flex justify-center mb-4">
            {getScoreIcon()}
          </div>
          <CardTitle className="text-2xl">{getScoreMessage()}</CardTitle>
          <CardDescription>{quiz.title}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`text-5xl font-bold ${getScoreColor()}`}>
            {percentage}%
          </div>
          <p className="text-muted-foreground">
            Vous avez obtenu <span className="font-semibold text-foreground">{score}</span> bonnes reponses sur{" "}
            <span className="font-semibold text-foreground">{totalQuestions}</span> questions
          </p>
        </CardContent>
      </Card>

      {/* Detailed Results */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Detail des reponses</CardTitle>
          <CardDescription>Consultez vos reponses et les explications</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {quiz.questions.map((question, index) => {
              const userAnswer = userAnswers.find((a) => a.questionId === question.id)
              const isCorrect = userAnswer?.selectedIndex === question.answerIndex
              const wasAnswered = userAnswer?.selectedIndex !== null

              return (
                <AccordionItem key={question.id} value={question.id}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3 text-left">
                      {isCorrect ? (
                        <CheckCircle className="h-5 w-5 shrink-0 text-success" />
                      ) : (
                        <XCircle className="h-5 w-5 shrink-0 text-destructive" />
                      )}
                      <span className="text-sm">
                        <span className="font-medium">Q{index + 1}.</span>{" "}
                        {question.question.length > 60
                          ? question.question.slice(0, 60) + "..."
                          : question.question}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-2">
                    <p className="text-sm text-foreground font-medium">{question.question}</p>
                    
                    <div className="space-y-2">
                      {question.options.map((option, optIndex) => {
                        const isThisCorrect = optIndex === question.answerIndex
                        const isThisSelected = userAnswer?.selectedIndex === optIndex

                        return (
                          <div
                            key={optIndex}
                            className={`flex items-center gap-2 rounded-lg p-3 text-sm ${
                              isThisCorrect
                                ? "bg-success/10 border border-success/30"
                                : isThisSelected
                                ? "bg-destructive/10 border border-destructive/30"
                                : "bg-secondary/50 border border-transparent"
                            }`}
                          >
                            {isThisCorrect && (
                              <Badge variant="outline" className="border-success text-success shrink-0">
                                Correct
                              </Badge>
                            )}
                            {isThisSelected && !isThisCorrect && (
                              <Badge variant="outline" className="border-destructive text-destructive shrink-0">
                                Votre reponse
                              </Badge>
                            )}
                            <span className={isThisCorrect ? "font-medium" : ""}>{option}</span>
                          </div>
                        )
                      })}
                      {!wasAnswered && (
                        <p className="text-sm text-muted-foreground italic">Vous n&apos;avez pas repondu a cette question.</p>
                      )}
                    </div>

                    <div className="rounded-lg bg-primary/5 border border-primary/20 p-3">
                      <p className="text-xs font-medium text-primary uppercase tracking-wide mb-1">Explication</p>
                      <p className="text-sm text-muted-foreground">{question.explanation}</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )
            })}
          </Accordion>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button onClick={onRestart} variant="outline" className="gap-2">
          <RotateCcw className="h-4 w-4" />
          Recommencer le quizz
        </Button>
        <Link href="/">
          <Button className="w-full gap-2 sm:w-auto">
            <Home className="h-4 w-4" />
            Retour a l&apos;accueil
          </Button>
        </Link>
      </div>
    </div>
  )
}
