import type React from "react"
import type { Question } from "../types"

interface QuestionComponentProps {
  question: Question
  onAnswer: (answer: string | number) => void
  onNext: () => void
  userAnswer: string | number | undefined
  isLastQuestion: boolean
}

const QuestionComponent: React.FC<QuestionComponentProps> = ({
  question,
  onAnswer,
  onNext,
  userAnswer,
  isLastQuestion,
}) => {
  const handleAnswer = (answer: string | number) => {
    onAnswer(answer)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === "" || !isNaN(Number(value))) {
      handleAnswer(value === "" ? "" : Number(value))
    }
  }

  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold mb-4">{question.text}</h2>
      {question.type === "multiple-choice" ? (
        <div className="space-y-2">
          {question.options!.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(option)}
              className={`w-full text-left p-2 rounded ${
                userAnswer === option ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300 transition-colors"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      ) : (
        <input
          type="text"
          value={userAnswer === undefined ? "" : userAnswer}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
          placeholder="Enter your answer"
        />
      )}
      <div className="mt-4 flex justify-between">
        <button
          onClick={onNext}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          {isLastQuestion ? "Finish Quiz" : "Next Question"}
        </button>
      </div>
    </div>
  )
}

export default QuestionComponent

