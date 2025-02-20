import type React from "react";
import { useQuiz } from "../context/QuizContext";

const ScoreBoard: React.FC = () => {
  const { score, questions } = useQuiz();
  const percentage = ((score / questions.length) * 100).toFixed(2);

  return (
    <div className="flex justify-between gap-8">
      <img 
        src="https://img.freepik.com/free-vector/graduates-wearing-medical-masks_52683-40014.jpg?t=st=1740047414~exp=1740051014~hmac=4d69fec09a9c0694db0a0b9b085bc3ae88f89447a0b292fb77612908311cd680&w=740"
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
