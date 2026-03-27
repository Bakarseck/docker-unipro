// =====================================================
// TYPES POUR LES QUIZZ
// =====================================================

export interface Question {
  id: string
  question: string
  options: string[]
  answerIndex: number
  explanation: string
}

export interface Quiz {
  id: string
  title: string
  description: string
  questions: Question[]
}

export interface QuizData {
  quizzes: Quiz[]
}

export interface UserAnswer {
  questionId: string
  selectedIndex: number | null
}

export interface QuizResult {
  quiz: Quiz
  userAnswers: UserAnswer[]
  score: number
  totalQuestions: number
}
