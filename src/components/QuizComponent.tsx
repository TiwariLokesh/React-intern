"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useQuiz } from "../context/QuizContext"
import QuestionComponent from "./QuestionComponent"
import Timer from "./Timer"
import ScoreBoard from "./ScoreBoard"
import AttemptHistory from "./AttemptHistory"

interface QuizAttempt {
  date: Date
  score: number
  totalQuestions: number
}

const QuizComponent: React.FC = () => {
  const {
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
  } = useQuiz()

  const [feedback, setFeedback] = useState<string | null>(null)

  // Reset timer to 30 seconds on every question change
  useEffect(() => {
    setTimeRemaining(30)
  }, [currentQuestionIndex])

  useEffect(() => {
    if (timeRemaining === 0) {
      handleNext()
    }
  }, [timeRemaining])

  const handleAnswer = (answer: string | number) => {
    const newUserAnswers = [...userAnswers]
    newUserAnswers[currentQuestionIndex] = answer
    setUserAnswers(newUserAnswers)
  }

  const handleNext = () => {
    if (userAnswers[currentQuestionIndex] === undefined) {
      setFeedback("Please select an answer.")
      return
    }

    // Check if the selected answer is correct
    if (userAnswers[currentQuestionIndex] === questions[currentQuestionIndex].correctAnswer) {
      setFeedback("✅ Correct!")
    } else {
      setFeedback(`❌ Incorrect! The correct answer was: ${questions[currentQuestionIndex].correctAnswer}`)
    }

    // Wait 1.5 seconds before moving to the next question
    setTimeout(() => {
      setFeedback(null)

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1)
      } else {
        endQuiz()
      }
    }, 1500)
  }

  const endQuiz = () => {
    setQuizCompleted(true)
    const newScore = calculateScore()
    setScore(newScore)
    saveAttempt(newScore)
  }

  const calculateScore = () => {
    return userAnswers.reduce((total, answer, index) => {
      if (answer === questions[index].correctAnswer) {
        return total + 1
      }
      return total
    }, 0)
  }

  const saveAttempt = (newScore: number) => {
    const newAttempt: QuizAttempt = {
      date: new Date(),
      score: newScore,
      totalQuestions: questions.length,
    }
    setAttempts([...attempts, newAttempt])
    saveAttemptToIndexedDB(newAttempt)
  }

  const restartQuiz = () => {
    setCurrentQuestionIndex(0)
    setUserAnswers([])
    setScore(0)
    setQuizCompleted(false)
    setTimeRemaining(30)
  }

  if (quizCompleted) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl w-full">
        <ScoreBoard />
        <AttemptHistory />
        <button
          onClick={restartQuiz}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Restart Quiz
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl w-full">
      <Timer />
      <QuestionComponent
        question={questions[currentQuestionIndex]}
        onAnswer={handleAnswer}
        onNext={handleNext}
        userAnswer={userAnswers[currentQuestionIndex]}
        isLastQuestion={currentQuestionIndex === questions.length - 1}
      />
      {feedback && (
        <div className="mt-4 p-3 text-white rounded bg-gray-700 text-center">
          {feedback}
        </div>
      )}
    </div>
  )
}

export default QuizComponent

// Function to save attempt to IndexedDB
function saveAttemptToIndexedDB(attempt: QuizAttempt) {
  const request = indexedDB.open("QuizDatabase", 1)

  request.onerror = (event) => {
    console.error("IndexedDB error:", event)
  }

  request.onsuccess = (event) => {
    const db = (event.target as IDBOpenDBRequest).result
    const transaction = db.transaction(["attempts"], "readwrite")
    const store = transaction.objectStore("attempts")
    store.add(attempt)
  }

  request.onupgradeneeded = (event) => {
    const db = (event.target as IDBOpenDBRequest).result
    db.createObjectStore("attempts", { keyPath: "date" })
  }
}
