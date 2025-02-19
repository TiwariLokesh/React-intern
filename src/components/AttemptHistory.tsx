import type React from "react"
import { useQuiz } from "../context/QuizContext"

const AttemptHistory: React.FC = () => {
  const { attempts } = useQuiz()

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold mb-2">Attempt History</h3>
      {attempts.length === 0 ? (
        <p>No previous attempts</p>
      ) : (
        <div className="max-h-60 overflow-y-auto border border-gray-300 rounded p-2">
          <ul className="space-y-2">
            {attempts.map((attempt, index) => (
              <li key={index} className="bg-gray-100 p-2 rounded">
                <span className="font-semibold">Attempt {index + 1}:</span> Score: {attempt.score}/
                {attempt.totalQuestions} ({((attempt.score / attempt.totalQuestions) * 100).toFixed(2)}
                %) - Date: {attempt.date.toLocaleString()}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default AttemptHistory

