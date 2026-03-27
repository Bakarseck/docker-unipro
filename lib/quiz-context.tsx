"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { QuizData, Quiz, Question } from "./quiz-types"
import { defaultQuizData } from "./quiz-data"
import { db, isFirebaseConfigured } from "./firebase"
import { doc, getDoc, setDoc } from "firebase/firestore"

const STORAGE_KEY = "docker-quiz-data"
const FIRESTORE_COLLECTION = "quiz"
const FIRESTORE_DOCUMENT = "main"

interface QuizContextType {
  quizData: QuizData
  // Admin functions
  addQuiz: (quiz: Quiz) => void
  updateQuiz: (quizId: string, quiz: Quiz) => void
  deleteQuiz: (quizId: string) => void
  addQuestion: (quizId: string, question: Question) => void
  updateQuestion: (quizId: string, questionId: string, question: Question) => void
  deleteQuestion: (quizId: string, questionId: string) => void
  resetToDefault: () => void
  // Export/Import
  exportData: () => string
  importData: (jsonString: string) => boolean
}

const QuizContext = createContext<QuizContextType | undefined>(undefined)

export function QuizProvider({ children }: { children: ReactNode }) {
  const [quizData, setQuizData] = useState<QuizData>(defaultQuizData)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load data from Firestore on mount, fallback localStorage
  useEffect(() => {
    const loadQuizData = async () => {
      if (isFirebaseConfigured && db) {
        try {
          const quizRef = doc(db, FIRESTORE_COLLECTION, FIRESTORE_DOCUMENT)
          const snapshot = await getDoc(quizRef)

          if (snapshot.exists()) {
            setQuizData(snapshot.data() as QuizData)
          } else {
            await setDoc(quizRef, defaultQuizData)
            setQuizData(defaultQuizData)
          }
          setIsLoaded(true)
          return
        } catch {
          console.error("Failed to load quiz data from Firestore, fallback to localStorage")
        }
      }

      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as QuizData
          setQuizData(parsed)
        } catch {
          console.error("Failed to parse stored quiz data")
        }
      }
      setIsLoaded(true)
    }

    void loadQuizData()
  }, [])

  // Save to Firestore when data changes, fallback localStorage
  useEffect(() => {
    if (!isLoaded) {
      return
    }

    const persistQuizData = async () => {
      if (isFirebaseConfigured && db) {
        try {
          await setDoc(doc(db, FIRESTORE_COLLECTION, FIRESTORE_DOCUMENT), quizData)
          return
        } catch {
          console.error("Failed to save quiz data to Firestore, fallback to localStorage")
        }
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(quizData))
    }

    void persistQuizData()
  }, [quizData, isLoaded])

  const addQuiz = (quiz: Quiz) => {
    setQuizData(prev => ({
      ...prev,
      quizzes: [...prev.quizzes, quiz]
    }))
  }

  const updateQuiz = (quizId: string, quiz: Quiz) => {
    setQuizData(prev => ({
      ...prev,
      quizzes: prev.quizzes.map(q => q.id === quizId ? quiz : q)
    }))
  }

  const deleteQuiz = (quizId: string) => {
    setQuizData(prev => ({
      ...prev,
      quizzes: prev.quizzes.filter(q => q.id !== quizId)
    }))
  }

  const addQuestion = (quizId: string, question: Question) => {
    setQuizData(prev => ({
      ...prev,
      quizzes: prev.quizzes.map(q => 
        q.id === quizId 
          ? { ...q, questions: [...q.questions, question] }
          : q
      )
    }))
  }

  const updateQuestion = (quizId: string, questionId: string, question: Question) => {
    setQuizData(prev => ({
      ...prev,
      quizzes: prev.quizzes.map(q => 
        q.id === quizId 
          ? { 
              ...q, 
              questions: q.questions.map(que => 
                que.id === questionId ? question : que
              )
            }
          : q
      )
    }))
  }

  const deleteQuestion = (quizId: string, questionId: string) => {
    setQuizData(prev => ({
      ...prev,
      quizzes: prev.quizzes.map(q => 
        q.id === quizId 
          ? { ...q, questions: q.questions.filter(que => que.id !== questionId) }
          : q
      )
    }))
  }

  const resetToDefault = () => {
    setQuizData(defaultQuizData)
  }

  const exportData = () => {
    return JSON.stringify(quizData, null, 2)
  }

  const importData = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString) as QuizData
      if (parsed.quizzes && Array.isArray(parsed.quizzes)) {
        setQuizData(prev => {
          // Merge quizzes: add new ones, update existing ones by id
          const existingIds = new Set(prev.quizzes.map(q => q.id))
          const newQuizzes = parsed.quizzes.filter(q => !existingIds.has(q.id))
          const updatedQuizzes = prev.quizzes.map(existing => {
            const updated = parsed.quizzes.find(q => q.id === existing.id)
            return updated || existing
          })
          return {
            ...prev,
            quizzes: [...updatedQuizzes, ...newQuizzes]
          }
        })
        return true
      }
      return false
    } catch {
      return false
    }
  }

  return (
    <QuizContext.Provider value={{
      quizData,
      addQuiz,
      updateQuiz,
      deleteQuiz,
      addQuestion,
      updateQuestion,
      deleteQuestion,
      resetToDefault,
      exportData,
      importData
    }}>
      {children}
    </QuizContext.Provider>
  )
}

export function useQuiz() {
  const context = useContext(QuizContext)
  if (context === undefined) {
    throw new Error("useQuiz must be used within a QuizProvider")
  }
  return context
}
