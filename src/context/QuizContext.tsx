"use client"

import type React from "react"
import { createContext, useState, useContext, type ReactNode } from "react"
import type { Question, QuizAttempt } from "../types"
import quizData from "../data/quizData"

interface QuizContextType {
  questions: Question[]
  currentQuestionIndex: number
  setCurrentQuestionIndex: React.Dispatch<React.SetStateAction<number>>
  userAnswers: (string | number)[]
  setUserAnswers: React.Dispatch<React.SetStateAction<(string | number)[]>>
  score: number
  setScore: React.Dispatch<React.SetStateAction<number>>
  quizCompleted: boolean
  setQuizCompleted: React.Dispatch<React.SetStateAction<boolean>>
  timeRemaining: number
  setTimeRemaining: React.Dispatch<React.SetStateAction<number>>
  attempts: QuizAttempt[]
  setAttempts: React.Dispatch<React.SetStateAction<QuizAttempt[]>>
}

const QuizContext = createContext<QuizContextType | undefined>(undefined)

export const QuizProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [questions] = useState<Question[]>(quizData)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState<(string | number)[]>([])
  const [score, setScore] = useState(0)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(30 * 60) // 30 minutes in seconds
  const [attempts, setAttempts] = useState<QuizAttempt[]>([])

  return (
    <QuizContext.Provider
      value={{
        questions,
        currentQuestionIndex,
        setCurrentQuestionIndex,
        userAnswers,
        setUserAnswers,
        score,
        setScore,
        quizCompleted,
        setQuizCompleted,
        timeRemaining,
        setTimeRemaining,
        attempts,
        setAttempts,
      }}
    >
      {children}
    </QuizContext.Provider>
  )
}

export const useQuiz = () => {
  const context = useContext(QuizContext)
  if (context === undefined) {
    throw new Error("useQuiz must be used within a QuizProvider")
  }
  return context
}