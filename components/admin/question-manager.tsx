"use client"

import { useState } from "react"
import { useQuiz } from "@/lib/quiz-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Empty, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Plus, Edit, Trash2, ArrowLeft, HelpCircle, CheckCircle } from "lucide-react"
import { QuestionForm } from "./question-form"
import type { Quiz, Question } from "@/lib/quiz-types"

interface QuestionManagerProps {
  quiz: Quiz
  onBack: () => void
}

export function QuestionManager({ quiz, onBack }: QuestionManagerProps) {
  const { quizData, addQuestion, updateQuestion, deleteQuestion } = useQuiz()
  const [isCreating, setIsCreating] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null)
  const [deletingQuestion, setDeletingQuestion] = useState<Question | null>(null)

  // Get fresh quiz data
  const currentQuiz = quizData.quizzes.find((q) => q.id === quiz.id)
  const questions = currentQuiz?.questions || []

  const handleSave = (question: Question) => {
    if (editingQuestion) {
      updateQuestion(quiz.id, editingQuestion.id, question)
      setEditingQuestion(null)
    } else {
      addQuestion(quiz.id, question)
      setIsCreating(false)
    }
  }

  const handleSaveMultiple = (questions: Question[]) => {
    questions.forEach((question) => {
      addQuestion(quiz.id, question)
    })
    setIsCreating(false)
  }

  const handleDelete = () => {
    if (deletingQuestion) {
      deleteQuestion(quiz.id, deletingQuestion.id)
      setDeletingQuestion(null)
    }
  }

  if (isCreating || editingQuestion) {
    return (
      <QuestionForm
        question={editingQuestion}
        onSave={handleSave}
        onSaveMultiple={handleSaveMultiple}
        onCancel={() => {
          setIsCreating(false)
          setEditingQuestion(null)
        }}
      />
    )
  }

  return (
    <>
      <div className="mb-6">
        <Button variant="ghost" onClick={onBack} className="mb-4 gap-2 -ml-2">
          <ArrowLeft className="h-4 w-4" />
          Retour aux quizz
        </Button>
        
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">{quiz.title}</h2>
            <p className="text-muted-foreground">{quiz.description}</p>
          </div>
          <Button onClick={() => setIsCreating(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Nouvelle question
          </Button>
        </div>
      </div>

      {questions.length === 0 ? (
        <Empty className="py-12">
          <EmptyMedia variant="icon">
            <HelpCircle className="h-6 w-6" />
          </EmptyMedia>
          <EmptyTitle>Aucune question</EmptyTitle>
          <EmptyDescription>
            Ce quizz ne contient pas encore de questions. Ajoutez-en pour commencer.
          </EmptyDescription>
          <Button onClick={() => setIsCreating(true)} className="mt-4 gap-2">
            <Plus className="h-4 w-4" />
            Ajouter une question
          </Button>
        </Empty>
      ) : (
        <div className="space-y-4">
          {questions.map((question, index) => (
            <Card key={question.id} className="group transition-all hover:shadow-md">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs">
                        Question {index + 1}
                      </Badge>
                    </div>
                    <CardTitle className="text-base leading-relaxed">
                      {question.question}
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  {question.options.map((option, optIndex) => (
                    <div
                      key={optIndex}
                      className={`flex items-center gap-2 rounded-lg p-2 text-sm ${
                        optIndex === question.answerIndex
                          ? "bg-success/10 border border-success/30"
                          : "bg-secondary/50"
                      }`}
                    >
                      {optIndex === question.answerIndex && (
                        <CheckCircle className="h-4 w-4 text-success shrink-0" />
                      )}
                      <span className={optIndex === question.answerIndex ? "font-medium" : ""}>
                        {option}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="rounded-lg bg-muted/50 p-3">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                    Explication
                  </p>
                  <p className="text-sm text-muted-foreground">{question.explanation}</p>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingQuestion(question)}
                    className="gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    Modifier
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeletingQuestion(question)}
                    className="gap-2 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                    Supprimer
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingQuestion} onOpenChange={() => setDeletingQuestion(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer la question ?</AlertDialogTitle>
            <AlertDialogDescription>
              Etes-vous sur de vouloir supprimer cette question ? Cette action est irreversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
