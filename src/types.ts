export interface Question {
    id: number
    text: string
    type: "multiple-choice" | "integer"
    options?: string[]
    correctAnswer: string | number
  }
  
  export interface QuizAttempt {
    date: Date
    score: number
    totalQuestions: number
  }
  
  