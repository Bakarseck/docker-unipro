"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { Save, X } from "lucide-react"
import type { Quiz } from "@/lib/quiz-types"

interface QuizFormProps {
  quiz?: Quiz | null
  onSave: (quiz: Quiz) => void
  onCancel: () => void
}

export function QuizForm({ quiz, onSave, onCancel }: QuizFormProps) {
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    description: "",
  })

  useEffect(() => {
    if (quiz) {
      setFormData({
        id: quiz.id,
        title: quiz.title,
        description: quiz.description,
      })
    }
  }, [quiz])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const newQuiz: Quiz = {
      id: formData.id || formData.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
      title: formData.title,
      description: formData.description,
      questions: quiz?.questions || [],
    }

    onSave(newQuiz)
  }

  const isEditing = !!quiz

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? "Modifier le quizz" : "Nouveau quizz"}</CardTitle>
        <CardDescription>
          {isEditing 
            ? "Modifiez les informations du quizz ci-dessous" 
            : "Remplissez les informations pour creer un nouveau quizz"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="title">Titre du quizz</FieldLabel>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ex: Fondamentaux de Docker"
                required
              />
            </Field>
            
            <Field>
              <FieldLabel htmlFor="id">Identifiant (slug)</FieldLabel>
              <Input
                id="id"
                value={formData.id}
                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                placeholder="Ex: docker-fundamentaux (genere automatiquement si vide)"
                disabled={isEditing}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {"L'identifiant unique du quizz (utilise dans l'URL)"}
              </p>
            </Field>

            <Field>
              <FieldLabel htmlFor="description">Description</FieldLabel>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Decrivez brievement le contenu du quizz..."
                rows={3}
                required
              />
            </Field>
          </FieldGroup>

          <div className="mt-6 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onCancel}>
              <X className="mr-2 h-4 w-4" />
              Annuler
            </Button>
            <Button type="submit">
              <Save className="mr-2 h-4 w-4" />
              {isEditing ? "Enregistrer" : "Creer le quizz"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
