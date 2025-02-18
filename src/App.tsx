import QuizComponent from "./components/QuizComponent"
import { QuizProvider } from "./context/QuizContext"

function App() {
  return (
    <QuizProvider>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <QuizComponent />
      </div>
    </QuizProvider>
  )
}

export default App

