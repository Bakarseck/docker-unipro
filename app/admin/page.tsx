"use client"

import { useState, useRef } from "react"
import { QuizProvider, useQuiz } from "@/lib/quiz-context"
import { AdminLayout } from "@/components/admin/admin-layout"
import { QuizManager } from "@/components/admin/quiz-manager"
import { QuestionManager } from "@/components/admin/question-manager"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import type { Quiz } from "@/lib/quiz-types"

function AdminContent() {
  const { exportData, importData, resetToDefault } = useQuiz()
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null)
  const [showResetDialog, setShowResetDialog] = useState(false)
  const [showImportDialog, setShowImportDialog] = useState(false)
  const [importText, setImportText] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleExport = () => {
    const data = exportData()
    const blob = new Blob([data], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "docker-quiz-data.json"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success("Donnees exportees avec succes !")
  }

  const handleImport = () => {
    setImportText("")
    setShowImportDialog(true)
  }

  const handleImportConfirm = () => {
    if (importData(importText)) {
      toast.success("Donnees importees avec succes !")
      setShowImportDialog(false)
      setImportText("")
    } else {
      toast.error("Format JSON invalide. Verifiez vos donnees.")
    }
  }

  const handleReset = () => {
    setShowResetDialog(true)
  }

  const handleResetConfirm = () => {
    resetToDefault()
    setShowResetDialog(false)
    setSelectedQuiz(null)
    toast.success("Donnees reinitalisees avec succes !")
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const content = event.target?.result as string
        setImportText(content)
      }
      reader.readAsText(file)
    }
  }

  return (
    <>
      <AdminLayout
        onExport={handleExport}
        onImport={handleImport}
        onReset={handleReset}
      >
        {selectedQuiz ? (
          <QuestionManager quiz={selectedQuiz} onBack={() => setSelectedQuiz(null)} />
        ) : (
          <QuizManager onSelectQuiz={setSelectedQuiz} />
        )}
      </AdminLayout>

      {/* Reset Confirmation Dialog */}
      <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reinitialiser les donnees ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cela supprimera toutes vos modifications et restaurera les donnees par defaut. 
              Cette action est irreversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleResetConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Reinitialiser
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Import Dialog */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>Importer des donnees</DialogTitle>
            <DialogDescription>
              Collez vos donnees JSON ci-dessous ou importez un fichier. Les nouveaux quizz seront ajoutes aux existants.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 min-h-0 space-y-4 overflow-y-auto">
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="w-full"
              >
                Choisir un fichier JSON
              </Button>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">ou coller le JSON</span>
              </div>
            </div>

            <Textarea
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder='{"quizzes": [...]}'
              className="font-mono text-sm min-h-[200px] max-h-[300px] resize-y"
            />
          </div>

          <DialogFooter className="flex-shrink-0 border-t pt-4">
            <Button variant="outline" onClick={() => setShowImportDialog(false)}>
              Annuler
            </Button>
            <Button onClick={handleImportConfirm} disabled={!importText.trim()}>
              Importer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default function AdminPage() {
  return (
    <QuizProvider>
      <AdminContent />
    </QuizProvider>
  )
}
