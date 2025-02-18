import type React from "react"
import { useQuiz } from "../context/QuizContext"

const ScoreBoard: React.FC = () => {
  const { score, questions } = useQuiz()

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-4">Quiz Completed!</h2>
      <p className="text-xl">
        Your Score: {score} / {questions.length}
      </p>
      <p className="text-lg mt-2">Percentage: {((score / questions.length) * 100).toFixed(2)}%</p>
    </div>
  )
}

export default ScoreBoard

