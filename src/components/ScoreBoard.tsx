import type React from "react";
import { useQuiz } from "../context/QuizContext";
import congratulations from '../../public/assets/congratulation.svg'
const ScoreBoard: React.FC = () => {
  const { score, questions } = useQuiz();
  const percentage = ((score / questions.length) * 100).toFixed(2);

  return (
    <div className="flex justify-between gap-8">
      <img 
        src={congratulations }
        alt="Congratulations" 
        className="w-[40%] max-w-sm mr-6 bg-gray-600"
      />
      <div className="">
        <h2 className="text-6xl font-semibold italic mb-4">Quiz Completed!</h2>
        <p className="text-xl">
          Your Score: {score} / {questions.length}
        </p>
        <p className="text-lg mt-2">Percentage: {percentage}%</p>
      </div>
    </div>
  );
};

export default ScoreBoard;
