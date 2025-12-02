import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
// import api from "../services/api";

const QuizU10 = () => {
  const { user } = useContext(AuthContext); // Check if user is logged in
  const navigate = useNavigate();

  // --- STATE MANAGEMENT ---
  const [step, setStep] = useState(1);
  const [interests, setInterests] = useState({ subject: "", hobby: "" });
  const [llmQuestions, setLlmQuestions] = useState([]);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [prediction, setPrediction] = useState(null);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [currentQIndex, setCurrentQIndex] = useState(0);

  // New State for Limit Reached Modal
  const [showLimitModal, setShowLimitModal] = useState(false);

  // --- CHECK QUOTA ON LOAD ---
  useEffect(() => {
    if (user) return; // Logged in users have no limits

    const checkQuota = () => {
      const quotaStr = localStorage.getItem("guest_quota");
      if (!quotaStr) return;

      const quota = JSON.parse(quotaStr);
      const oneWeek = 7 * 24 * 60 * 60 * 1000;

      // If a week has passed, reset the counter
      if (Date.now() - quota.weekStart > oneWeek) {
        localStorage.removeItem("guest_quota");
        return;
      }

      // If limit reached, warn user immediately (Optional, or wait till submit)
      // We will wait till submit to be less intrusive
    };
    checkQuota();
  }, [user]);

  // --- HELPER: UPDATE QUOTA ---
  const incrementGuestUsage = () => {
    if (user) return true; // Bypass for logged in users

    const quotaStr = localStorage.getItem("guest_quota");
    let quota = quotaStr
      ? JSON.parse(quotaStr)
      : { count: 0, weekStart: Date.now() };

    // Check if week expired
    const oneWeek = 7 * 24 * 60 * 60 * 1000;
    if (Date.now() - quota.weekStart > oneWeek) {
      quota = { count: 0, weekStart: Date.now() };
    }

    if (quota.count >= 2) {
      setShowLimitModal(true);
      return false; // Stop execution
    }

    // Increment and Save
    quota.count += 1;
    localStorage.setItem("guest_quota", JSON.stringify(quota));
    return true; // Continue
  };

  // --- STEP 1: HANDLE INTEREST SUBMISSION ---
  const handleInterestSubmit = async (e) => {
    e.preventDefault();

    // Check limit BEFORE calling AI API (Save resources)
    if (!incrementGuestUsage()) return;

    setStep(3);
    setLoadingMessage("AI is generating your personalized quiz...");

    try {
      setTimeout(() => {
        setLlmQuestions([
          {
            id: 1,
            text: "You enjoy solving puzzles. Do you prefer logic or words?",
            options: ["Logic", "Words"],
          },
          {
            id: 2,
            text: "If a machine breaks, do you fix it or call support?",
            options: ["Fix it", "Call support"],
          },
        ]);
        setStep(2);
        setCurrentQIndex(0);
      }, 2000);
    } catch (error) {
      console.error("Failed to generate quiz", error);
      setStep(1);
    }
  };

  // --- STEP 2 HANDLERS ---
  const handleAnswerChange = (qId, answer) =>
    setQuizAnswers({ ...quizAnswers, [qId]: answer });

  const handleNext = () => {
    if (currentQIndex < llmQuestions.length - 1) {
      setCurrentQIndex((prev) => prev + 1);
    } else {
      handleFinalSubmit();
    }
  };

  const handlePrev = () => {
    if (currentQIndex > 0) setCurrentQIndex((prev) => prev - 1);
  };

  const handleFinalSubmit = async () => {
    setStep(3);
    setLoadingMessage("Analyzing responses...");

    setTimeout(() => {
      setPrediction({
        recommended_stream: "Science (PCM)",
        reason: "Strong analytical skills detected.",
        careers: ["Software Engineering", "Data Science"],
      });
      setStep(4);
    }, 2000);
  };

  // --- PROGRESS BAR ---
  const VerticalProgressBar = () => {
    const progress = ((currentQIndex + 1) / llmQuestions.length) * 100;
    return (
      <div className="flex flex-col items-center justify-center h-full ml-6 hidden md:flex">
        <div className="w-3 h-64 bg-slate-700 rounded-full relative overflow-hidden shadow-inner">
          <div
            className="absolute bottom-0 w-full bg-cyan-500 transition-all duration-500 ease-out"
            style={{ height: `${progress}%` }}
          ></div>
        </div>
        <span className="mt-3 text-xs font-bold text-cyan-400">
          {currentQIndex + 1}/{llmQuestions.length}
        </span>
      </div>
    );
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-10 px-4 relative">
      {/* --- LIMIT REACHED MODAL --- */}
      {showLimitModal && (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 p-8 rounded-2xl shadow-2xl max-w-sm text-center transform scale-100 transition-all">
            <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
              🔒
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              Guest Limit Reached
            </h3>
            <p className="text-slate-400 mb-6">
              You have used your <strong>2 free predictions</strong> for this
              week. Please create a free account to continue exploring your
              career path.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => navigate("/register")}
                className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold py-3 rounded-lg transition"
              >
                Create Free Account
              </button>
              <button
                onClick={() => navigate("/login")}
                className="w-full border border-slate-600 text-slate-300 hover:bg-slate-700 font-bold py-3 rounded-lg transition"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MAIN CARD --- */}
      <div className="w-full max-w-3xl flex items-center justify-center">
        <div className="flex-1 bg-slate-800 shadow-2xl rounded-2xl overflow-hidden border border-slate-700 p-8 relative min-h-[400px] flex flex-col">
          {/* Background Decor */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl -z-0 pointer-events-none"></div>

          {/* STEP 1 */}
          {step === 1 && (
            <form
              onSubmit={handleInterestSubmit}
              className="space-y-6 relative z-10"
            >
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-white">
                  U10 Stream Selector
                </h2>
                {!user && (
                  <span className="inline-block bg-slate-700 text-cyan-400 text-xs px-2 py-1 rounded mt-2">
                    Guest Mode: 2 Free/Week
                  </span>
                )}
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">
                    Favorite Subject
                  </label>
                  <select
                    value={interests.subject}
                    onChange={(e) =>
                      setInterests({ ...interests, subject: e.target.value })
                    }
                    required
                    className="w-full p-4 bg-slate-900 border border-slate-600 rounded-xl text-slate-200 focus:ring-2 focus:ring-cyan-500 outline-none"
                  >
                    <option value="">Select...</option>
                    <option value="Maths">Mathematics</option>
                    <option value="History">History</option>
                    <option value="Arts">Arts</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">
                    Primary Hobby
                  </label>
                  <select
                    value={interests.hobby}
                    onChange={(e) =>
                      setInterests({ ...interests, hobby: e.target.value })
                    }
                    required
                    className="w-full p-4 bg-slate-900 border border-slate-600 rounded-xl text-slate-200 focus:ring-2 focus:ring-cyan-500 outline-none"
                  >
                    <option value="">Select...</option>
                    <option value="Gaming">Gaming</option>
                    <option value="Writing">Writing</option>
                  </select>
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-cyan-600 text-white font-bold py-4 px-6 rounded-xl hover:bg-cyan-500 transition mt-4"
              >
                Start Analysis &rarr;
              </button>
            </form>
          )}

          {/* STEP 2 (Question Cards) */}
          {step === 2 && llmQuestions.length > 0 && (
            <div className="flex-1 flex flex-col justify-between relative z-10 animate-fadeIn">
              <div key={currentQIndex} className="animate-slideIn">
                <span className="text-xs font-bold tracking-widest text-cyan-500 uppercase mb-2 block">
                  Question {currentQIndex + 1}
                </span>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-6">
                  {llmQuestions[currentQIndex].text}
                </h3>
                <div className="space-y-3">
                  {llmQuestions[currentQIndex].options.map((opt) => (
                    <label
                      key={opt}
                      className={`cursor-pointer border p-4 rounded-xl flex items-center transition-all duration-200 ${
                        quizAnswers[llmQuestions[currentQIndex].id] === opt
                          ? "bg-cyan-900/30 border-cyan-500 ring-1 ring-cyan-500"
                          : "bg-slate-900 border-slate-700 hover:bg-slate-800"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`q-${llmQuestions[currentQIndex].id}`}
                        value={opt}
                        onChange={() =>
                          handleAnswerChange(
                            llmQuestions[currentQIndex].id,
                            opt
                          )
                        }
                        className="hidden"
                      />
                      <span
                        className={`w-5 h-5 rounded-full border mr-4 flex items-center justify-center ${
                          quizAnswers[llmQuestions[currentQIndex].id] === opt
                            ? "border-cyan-400"
                            : "border-slate-600"
                        }`}
                      >
                        {quizAnswers[llmQuestions[currentQIndex].id] ===
                          opt && (
                          <div className="w-2.5 h-2.5 bg-cyan-400 rounded-full"></div>
                        )}
                      </span>
                      <span className="text-slate-200 font-medium">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex justify-between mt-8 pt-4 border-t border-slate-700">
                <button
                  onClick={handlePrev}
                  disabled={currentQIndex === 0}
                  className={`text-slate-400 font-semibold hover:text-white transition ${
                    currentQIndex === 0 ? "opacity-0" : "opacity-100"
                  }`}
                >
                  &larr; Back
                </button>
                <button
                  onClick={handleNext}
                  disabled={!quizAnswers[llmQuestions[currentQIndex].id]}
                  className={`bg-white text-slate-900 font-bold py-2 px-6 rounded-lg hover:bg-cyan-50 ${
                    !quizAnswers[llmQuestions[currentQIndex].id]
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {currentQIndex === llmQuestions.length - 1
                    ? "Finish Quiz"
                    : "Next"}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 & 4 (Loading & Results) */}
          {(step === 3 || step === 4) && (
            <div className="flex flex-col items-center justify-center h-full text-center relative z-10">
              {step === 3 && (
                <>
                  <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-cyan-400 mb-6"></div>
                  <h3 className="text-xl font-bold text-white animate-pulse">
                    {loadingMessage}
                  </h3>
                </>
              )}

              {step === 4 && prediction && (
                <div className="animate-fadeIn">
                  <div className="bg-emerald-900/20 p-8 rounded-2xl border border-emerald-500/30 shadow-inner mb-6">
                    <h4 className="text-emerald-400 uppercase tracking-widest text-xs font-bold mb-3">
                      Recommended Stream
                    </h4>
                    <h1 className="text-4xl font-black text-white mb-4">
                      {prediction.recommended_stream}
                    </h1>
                    <p className="text-slate-300 leading-relaxed mb-4">
                      {prediction.reason}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setStep(1);
                      setQuizAnswers({});
                      setPrediction(null);
                      setCurrentQIndex(0);
                    }}
                    className="text-cyan-400 font-bold hover:underline"
                  >
                    Start Over
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        {step === 2 && <VerticalProgressBar />}
      </div>
    </div>
  );
};

export default QuizU10;
