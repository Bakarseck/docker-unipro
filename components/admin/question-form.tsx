"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save, X, Plus, Trash2, FileJson } from "lucide-react"
import type { Question } from "@/lib/quiz-types"

interface QuestionFormProps {
  question?: Question | null
  onSave: (question: Question) => void
  onSaveMultiple?: (questions: Question[]) => void
  onCancel: () => void
}

export function QuestionForm({ question, onSave, onSaveMultiple, onCancel }: QuestionFormProps) {
  const [mode, setMode] = useState<"form" | "json">("form")
  const [jsonInput, setJsonInput] = useState("")
  const [jsonError, setJsonError] = useState("")
  const [formData, setFormData] = useState({
    id: "",
    question: "",
    options: ["", "", "", ""],
    answerIndex: 0,
    explanation: "",
  })

  useEffect(() => {
    if (question) {
      setFormData({
        id: question.id,
        question: question.question,
        options: [...question.options],
        answerIndex: question.answerIndex,
        explanation: question.explanation,
      })
    }
  }, [question])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Filter out empty options
    const filteredOptions = formData.options.filter((opt) => opt.trim() !== "")
    
    if (filteredOptions.length < 2) {
      alert("Veuillez ajouter au moins 2 options de reponse")
      return
    }

    const newQuestion: Question = {
      id: formData.id || `q-${Date.now()}`,
      question: formData.question,
      options: filteredOptions,
      answerIndex: Math.min(formData.answerIndex, filteredOptions.length - 1),
      explanation: formData.explanation,
    }

    onSave(newQuestion)
  }

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...formData.options]
    newOptions[index] = value
    setFormData({ ...formData, options: newOptions })
  }

  const addOption = () => {
    if (formData.options.length < 6) {
      setFormData({ ...formData, options: [...formData.options, ""] })
    }
  }

  const removeOption = (index: number) => {
    if (formData.options.length > 2) {
      const newOptions = formData.options.filter((_, i) => i !== index)
      let newAnswerIndex = formData.answerIndex
      if (index === formData.answerIndex) {
        newAnswerIndex = 0
      } else if (index < formData.answerIndex) {
        newAnswerIndex = formData.answerIndex - 1
      }
      setFormData({ ...formData, options: newOptions, answerIndex: newAnswerIndex })
    }
  }

  const isEditing = !!question

  const validateQuestion = (q: unknown): q is Question => {
    if (!q || typeof q !== "object") return false
    const obj = q as Record<string, unknown>
    return (
      typeof obj.question === "string" &&
      Array.isArray(obj.options) &&
      obj.options.length >= 2 &&
      obj.options.every((o: unknown) => typeof o === "string") &&
      typeof obj.answerIndex === "number" &&
      obj.answerIndex >= 0 &&
      obj.answerIndex < obj.options.length &&
      typeof obj.explanation === "string"
    )
  }

  const handleJsonImport = () => {
    setJsonError("")
    try {
      const parsed = JSON.parse(jsonInput)
      
      // Check if it's an array of questions
      if (Array.isArray(parsed)) {
        const validQuestions: Question[] = []
        for (let i = 0; i < parsed.length; i++) {
          if (!validateQuestion(parsed[i])) {
            setJsonError(`Question ${i + 1} invalide. Verifiez le format.`)
            return
          }
          validQuestions.push({
            id: parsed[i].id || `q-${Date.now()}-${i}`,
            question: parsed[i].question,
            options: parsed[i].options,
            answerIndex: parsed[i].answerIndex,
            explanation: parsed[i].explanation,
          })
        }
        if (onSaveMultiple) {
          onSaveMultiple(validQuestions)
        } else {
          // If no onSaveMultiple, save one by one
          validQuestions.forEach((q) => onSave(q))
        }
        return
      }
      
      // Single question
      if (!validateQuestion(parsed)) {
        setJsonError("Format JSON invalide. Verifiez la structure de la question.")
        return
      }
      
      onSave({
        id: parsed.id || `q-${Date.now()}`,
        question: parsed.question,
        options: parsed.options,
        answerIndex: parsed.answerIndex,
        explanation: parsed.explanation,
      })
    } catch {
      setJsonError("JSON invalide. Verifiez la syntaxe.")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? "Modifier la question" : "Nouvelle question"}</CardTitle>
        <CardDescription>
          {isEditing 
            ? "Modifiez les informations de la question ci-dessous" 
            : "Remplissez les informations pour creer une nouvelle question"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!isEditing && (
          <Tabs value={mode} onValueChange={(v) => setMode(v as "form" | "json")} className="mb-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="form">Formulaire</TabsTrigger>
              <TabsTrigger value="json" className="gap-2">
                <FileJson className="h-4 w-4" />
                Importer JSON
              </TabsTrigger>
            </TabsList>
          </Tabs>
        )}

        {mode === "json" && !isEditing ? (
          <div className="space-y-4">
            <div className="rounded-lg border bg-muted/30 p-4">
              <p className="text-sm text-muted-foreground mb-2">
                Format attendu (une question ou un tableau de questions) :
              </p>
              <pre className="text-xs bg-background p-3 rounded border overflow-x-auto">
{`{
  "question": "Votre question ?",
  "options": ["Option 1", "Option 2", "Option 3"],
  "answerIndex": 0,
  "explanation": "Explication..."
}`}
              </pre>
            </div>
            
            <Field>
              <FieldLabel htmlFor="json-input">Collez votre JSON</FieldLabel>
              <Textarea
                id="json-input"
                value={jsonInput}
                onChange={(e) => {
                  setJsonInput(e.target.value)
                  setJsonError("")
                }}
                placeholder="Collez votre JSON ici..."
                className="font-mono text-sm min-h-[200px]"
              />
              {jsonError && (
                <p className="text-sm text-destructive mt-2">{jsonError}</p>
              )}
            </Field>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={onCancel}>
                <X className="mr-2 h-4 w-4" />
                Annuler
              </Button>
              <Button type="button" onClick={handleJsonImport} disabled={!jsonInput.trim()}>
                <Save className="mr-2 h-4 w-4" />
                Importer
              </Button>
            </div>
          </div>
        ) : (
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="question">Question</FieldLabel>
              <Textarea
                id="question"
                value={formData.question}
                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                placeholder="Ecrivez votre question ici..."
                rows={2}
                required
              />
            </Field>

            <Field>
              <FieldLabel>Options de reponse</FieldLabel>
              <p className="text-xs text-muted-foreground mb-3">
                Selectionnez la bonne reponse en cliquant sur le cercle correspondant
              </p>
              <RadioGroup
                value={formData.answerIndex.toString()}
                onValueChange={(value) => setFormData({ ...formData, answerIndex: parseInt(value) })}
                className="space-y-3"
              >
                {formData.options.map((option, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                    <Input
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                      className="flex-1"
                    />
                    {formData.options.length > 2 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeOption(index)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </RadioGroup>
              {formData.options.length < 6 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addOption}
                  className="mt-3 gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Ajouter une option
                </Button>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="explanation">Explication</FieldLabel>
              <Textarea
                id="explanation"
                value={formData.explanation}
                onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                placeholder="Expliquez pourquoi cette reponse est correcte..."
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
              {isEditing ? "Enregistrer" : "Ajouter la question"}
            </Button>
          </div>
        </form>
        )}
      </CardContent>
    </Card>
  )
}
