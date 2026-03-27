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
import { Plus, Edit, Trash2, ChevronRight, BookOpen } from "lucide-react"
import { QuizForm } from "./quiz-form"
import type { Quiz } from "@/lib/quiz-types"

interface QuizManagerProps {
  onSelectQuiz: (quiz: Quiz) => void
}

export function QuizManager({ onSelectQuiz }: QuizManagerProps) {
  const { quizData, addQuiz, updateQuiz, deleteQuiz } = useQuiz()
  const [isCreating, setIsCreating] = useState(false)
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null)
  const [deletingQuiz, setDeletingQuiz] = useState<Quiz | null>(null)

  const handleSave = (quiz: Quiz) => {
    if (editingQuiz) {
      updateQuiz(editingQuiz.id, quiz)
      setEditingQuiz(null)
    } else {
      addQuiz(quiz)
      setIsCreating(false)
    }
  }

  const handleDelete = () => {
    if (deletingQuiz) {
      deleteQuiz(deletingQuiz.id)
      setDeletingQuiz(null)
    }
  }

  if (isCreating || editingQuiz) {
    return (
      <QuizForm
        quiz={editingQuiz}
        onSave={handleSave}
        onCancel={() => {
          setIsCreating(false)
          setEditingQuiz(null)
        }}
      />
    )
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Gestion des Quizz</h2>
          <p className="text-muted-foreground">Ajoutez, modifiez ou supprimez vos quizz</p>
        </div>
        <Button onClick={() => setIsCreating(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Nouveau quizz
        </Button>
      </div>

      {quizData.quizzes.length === 0 ? (
        <Empty className="py-12">
          <EmptyMedia variant="icon">
            <BookOpen className="h-6 w-6" />
          </EmptyMedia>
          <EmptyTitle>Aucun quizz</EmptyTitle>
          <EmptyDescription>
            Creez votre premier quizz pour commencer.
          </EmptyDescription>
          <Button onClick={() => setIsCreating(true)} className="mt-4 gap-2">
            <Plus className="h-4 w-4" />
            Creer un quizz
          </Button>
        </Empty>
      ) : (
        <div className="grid gap-4">
          {quizData.quizzes.map((quiz) => (
            <Card key={quiz.id} className="group transition-all hover:shadow-md">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{quiz.title}</CardTitle>
                    <CardDescription className="mt-1">{quiz.description}</CardDescription>
                  </div>
                  <Badge variant="secondary">
                    {quiz.questions.length} question{quiz.questions.length !== 1 ? "s" : ""}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <code className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                    ID: {quiz.id}
                  </code>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingQuiz(quiz)}
                      className="gap-2"
                    >
                      <Edit className="h-4 w-4" />
                      Modifier
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeletingQuiz(quiz)}
                      className="gap-2 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                      Supprimer
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => onSelectQuiz(quiz)}
                      className="gap-2"
                    >
                      Gerer les questions
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingQuiz} onOpenChange={() => setDeletingQuiz(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer le quizz ?</AlertDialogTitle>
            <AlertDialogDescription>
              Etes-vous sur de vouloir supprimer le quizz &quot;{deletingQuiz?.title}&quot; ? 
              Cette action est irreversible et supprimera egalement toutes les questions associees.
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
