import { useState } from 'react';
import api from '../services/api';

const QuizU10 = () => {
  // --- STATE MANAGEMENT ---
  const [step, setStep] = useState(1); // 1: Interests, 2: LLM Quiz, 3: Loading, 4: Result
  const [interests, setInterests] = useState({ subject: '', hobby: '' });
  const [llmQuestions, setLlmQuestions] = useState([]);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [prediction, setPrediction] = useState(null);

  // --- STEP 1: HANDLE INTEREST SUBMISSION ---
  const handleInterestSubmit = async (e) => {
    e.preventDefault();
    setStep(3); // Show loading
    try {
      // API CALL: Send interests to Backend -> Backend asks LLM -> Returns Questions
      // Mocking the response structure for now:
      /* const res = await api.post('/generate-quiz', interests);
         setLlmQuestions(res.data.questions);
      */
      
      // TEMPORARY MOCK (Remove this when backend is ready)
      setTimeout(() => {
        setLlmQuestions([
          { id: 1, text: "You enjoy solving puzzles. Do you prefer logic puzzles (Math) or word puzzles (Language)?", options: ["Logic", "Word"] },
          { id: 2, text: "If a machine breaks, is your instinct to fix it or buy a new one?", options: ["Fix it", "Buy new"] }
        ]);
        setStep(2);
      }, 1500);
      
    } catch (error) {
      console.error("Failed to generate quiz", error);
      alert("Error generating quiz. Please try again.");
      setStep(1);
    }
  };

  // --- STEP 2: HANDLE QUIZ ANSWERS ---
  const handleAnswerChange = (qId, answer) => {
    setQuizAnswers({ ...quizAnswers, [qId]: answer });
  };

  const handleFinalSubmit = async () => {
    setStep(3); // Show loading
    try {
      // API CALL: Send all data to AI Model
      const payload = {
        interests: interests,
        quiz_responses: quizAnswers
      };
      
      const res = await api.post('/predict-u10', payload);
      setPrediction(res.data); // Expecting { recommended_stream: "Science", reason: "..." }
      setStep(4);
      
    } catch (error) {
      console.error("Prediction failed", error);
      // Fallback for testing UI without backend
      setPrediction({ recommended_stream: "Science (PCM)", reason: "High logical aptitude detected." });
      setStep(4);
    }
  };

  // --- RENDER UI BASED ON STEP ---
  return (
    <div style={{ maxWidth: '600px', margin: 'auto' }}>
      <h2>U10 Career Discovery</h2>
      
      {/* STEP 1: INTEREST INPUT */}
      {step === 1 && (
        <form onSubmit={handleInterestSubmit}>
          <label>Favorite Subject:</label>
          <select 
            value={interests.subject} 
            onChange={(e) => setInterests({...interests, subject: e.target.value})}
            required
            style={{ display: 'block', margin: '10px 0', width: '100%', padding: '8px' }}
          >
            <option value="">Select...</option>
            <option value="Maths">Mathematics</option>
            <option value="Biology">Biology</option>
            <option value="History">History/Civics</option>
            <option value="Art">Arts/Design</option>
          </select>

          <label>Primary Hobby:</label>
          <select 
            value={interests.hobby} 
            onChange={(e) => setInterests({...interests, hobby: e.target.value})}
            required
            style={{ display: 'block', margin: '10px 0', width: '100%', padding: '8px' }}
          >
            <option value="">Select...</option>
            <option value="Gaming">Gaming/Coding</option>
            <option value="Writing">Writing/Reading</option>
            <option value="Sports">Sports</option>
            <option value="Mechanics">Building/Fixing things</option>
          </select>

          <button type="submit" style={{ marginTop: '20px', padding: '10px 20px' }}>
            Generate My Quiz
          </button>
        </form>
      )}

      {/* STEP 2: LLM GENERATED QUIZ */}
      {step === 2 && (
        <div>
          <p>Based on your interests, answer these specific questions:</p>
          {llmQuestions.map((q) => (
            <div key={q.id} style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd' }}>
              <p><strong>{q.text}</strong></p>
              {q.options.map(opt => (
                <label key={opt} style={{ display: 'block', margin: '5px 0' }}>
                  <input 
                    type="radio" 
                    name={`q-${q.id}`} 
                    value={opt} 
                    onChange={() => handleAnswerChange(q.id, opt)}
                  /> {opt}
                </label>
              ))}
            </div>
          ))}
          <button onClick={handleFinalSubmit} style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white' }}>
            Analyze Career Path
          </button>
        </div>
      )}

      {/* STEP 3: LOADING */}
      {step === 3 && <h3>AI is analyzing your profile...</h3>}

      {/* STEP 4: RESULTS */}
      {step === 4 && prediction && (
        <div style={{ textAlign: 'center', padding: '20px', border: '2px solid #007bff' }}>
          <h3>Recommended Stream:</h3>
          <h1 style={{ color: '#007bff' }}>{prediction.recommended_stream}</h1>
          <p>{prediction.reason}</p>
          <small>Standard Indian Curriculum (CBSE/ICSE)</small>
          <br />
          <button onClick={() => setStep(1)} style={{ marginTop: '20px' }}>Start Over</button>
        </div>
      )}
    </div>
  );
};

export default QuizU10;