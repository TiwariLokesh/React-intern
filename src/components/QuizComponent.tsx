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
      handleTimeout() // Skip question when time runs out
    }
  }, [timeRemaining])

  const handleAnswer = (answer: string | number) => {
    const newUserAnswers = [...userAnswers]
    newUserAnswers[currentQuestionIndex] = answer
    setUserAnswers(newUserAnswers)
  }

  const handleNext = () => {
    if (userAnswers[currentQuestionIndex] === undefined) {
      setFeedback("⚠️ Please select an answer.")
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
      goToNextQuestion()
    }, 800)
  }

  const handleTimeout = () => {
    setFeedback("⏳ Time's up! Question skipped.")

    setTimeout(() => {
      setFeedback(null)
      goToNextQuestion()
    }, 1500)
  }

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      endQuiz()
    }
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
      <div className="bg-gray-300 p-8 my-4 max-w-2xl w-full"
      >
        <ScoreBoard />
        <AttemptHistory />
        <button
          onClick={restartQuiz}
          className="mt-4 bg-[#1e78a9] text-white px-4 py-2 rounded-full hover:bg-[#084c71]"
        >
          Restart Quiz
        </button>
      </div>
    )
  }

  return (
   

    <div className="bg-gray-200 p-8 gap-10 w-5/6 h-[600px] flex flex-col">
      <div className="flex flex-col md:flex-row gap-8 ">
        <div className="w-[40%] h-auto bg-gray-600 border-[#084c71] p-2 flex justify-center items-center">
          <img
            src="https://img.freepik.com/free-vector/thoughtful-woman-with-laptop-looking-big-question-mark_1150-39362.jpg?t=st=1740047312~exp=1740050912~hmac=fa92298acc33b181dc3806b03256a404cd3224c2b9254e62d595e8049f4dcb51&w=740"
            alt="Quiz Illustration"
            className="rounded-lg w-[80%]"
          />
        </div>
        
        <div className="flex-1 pl-6">
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
      </div>

      {/* Progress Bar */}
      <div className="mt-4 w-full bg-gray-300 rounded-full h-4 overflow-hidden relative">
        <div
          className="bg-blue-500 h-full transition-all text-white flex items-center justify-center text-xs font-bold"
          style={{
            width: `${((currentQuestionIndex + 0) / questions.length) * 100}%`,
          }}
        >
          {/* {`${Math.round(((currentQuestionIndex + 0) / questions.length) * 100)}%`} */}
        </div>
      </div>

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
