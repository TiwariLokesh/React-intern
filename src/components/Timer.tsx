"use client"

import type React from "react"
import { useEffect } from "react"
import { useQuiz } from "../context/QuizContext"

const Timer: React.FC = () => {
  const { timeRemaining, setTimeRemaining } = useQuiz()

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prevTime) => (prevTime > 0 ? prevTime - 1 : 0))
    }, 1000)

    return () => clearInterval(timer)
  }, [setTimeRemaining])

  const minutes = Math.floor(timeRemaining / 60)
  const seconds = timeRemaining % 60

  return (
    <div className="text-xl font-bold mb-4">
      Time Remaining: {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
    </div>
  )
}

export default Timer
