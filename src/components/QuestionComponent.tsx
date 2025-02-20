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
      <h2 className="text-5xl tracking-wide  font-bold mb-4">{question.text}</h2>
      {question.type === "multiple-choice" ? (
        <div className="grid grid-cols-2 gap-4">
          {question.options!.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(option)}
              className={`w-full text-left p-4 border-2 border-[#4ea1ce] hover:border-[#084c71] rounded-full ${
                userAnswer === option ? "bg-[#084c71] text-white" : "bg-gray-200 transition-colors"
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
          className="bg-[#1e78a9] text-white px-4 py-2 rounded-full hover:bg-[#084c71]"
        >
          {isLastQuestion ? "Finish Quiz" : "Next Question"}
        </button>
      </div>
    </div>


  )
}

export default QuestionComponent

