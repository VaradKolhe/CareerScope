import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";

const QuizU10 = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // --- STATE MANAGEMENT ---
  const [step, setStep] = useState(1); // 1: Profile, 2: Quiz, 3: Loading, 4: Result
  const [currentQIndex, setCurrentQIndex] = useState(0);

  const [profileData, setProfileData] = useState({
    subjects: [],
    hobbies: [],
    grade_level: "Under Class 10",
  });

  const [llmQuestions, setLlmQuestions] = useState([]);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [prediction, setPrediction] = useState(null);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [showLimitModal, setShowLimitModal] = useState(false);

  // --- GUEST QUOTA LOGIC ---
  const checkAndIncrementGuestUsage = () => {
    if (user) return true;

    const quotaStr = localStorage.getItem("guest_quota");
    let quota = quotaStr
      ? JSON.parse(quotaStr)
      : { count: 0, weekStart: Date.now() };

    const oneWeek = 7 * 24 * 60 * 60 * 1000;
    if (Date.now() - quota.weekStart > oneWeek) {
      quota = { count: 0, weekStart: Date.now() };
    }

    if (quota.count >= 2) {
      setShowLimitModal(true);
      return false;
    }
    return true;
  };

  // --- STAGE 1: GENERATE QUIZ ---
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!checkAndIncrementGuestUsage()) return;

    setStep(3);
    setLoadingMessage(
      "AI is synthesizing your interests and generating a diagnostic quiz..."
    );

    try {
      const payload = {
        subjects: profileData.subjects,
        hobbies: profileData.hobbies,
        grade_level: profileData.grade_level,
      };

      const res = await api.post("/generate_quiz", payload);

      // Validate response structure matches your LLM output
      if (res.data && res.data.questions && Array.isArray(res.data.questions)) {
        setLlmQuestions(res.data.questions);
        setQuizAnswers({});
        setCurrentQIndex(0);
        setStep(2);
      } else {
        throw new Error("Invalid quiz format received from AI");
      }
    } catch (error) {
      console.error("Quiz generation failed:", error);
      setLoadingMessage("Error: Could not generate quiz. Please try again.");
      setTimeout(() => setStep(1), 2000);
    }
  };

  // --- STAGE 3: EVALUATE QUIZ ---
  const handleFinalSubmit = async () => {
    if (Object.keys(quizAnswers).length < llmQuestions.length) {
      return;
    }

    setStep(3);
    setLoadingMessage(
      "Analyzing your responses and calculating confidence scores..."
    );

    try {
      // Format Responses exactly as Python expects
      const formattedResponses = llmQuestions.map((q) => ({
        question_text: q.question, // Mapped from LLM 'question' field
        selected_option: quizAnswers[q.id] || "No Answer",
      }));

      const payload = {
        profile: profileData,
        responses: formattedResponses,
      };

      const res = await api.post("/evaluate_quiz", payload);
      setPrediction(res.data);
      setStep(4);

      if (user) {
        try {
          // Extract the top result (index 0)
          const bestPath = res.data.suggestions[0];

          await api.post("/profile/history", {
            module: "U10",
            topPrediction: bestPath.role, // e.g. "Science (PCM)"
            confidence: bestPath.confidence, // e.g. 85
            summary: res.data.summary, // e.g. "Strong logic..."
          });
          console.log("✅ Result saved to history successfully");
        } catch (saveError) {
          console.error("❌ Failed to save history:", saveError);
        }
      } else {
        // Guest Logic
        let quota = JSON.parse(localStorage.getItem("guest_quota")) || {
          count: 0,
          weekStart: Date.now(),
        };
        quota.count += 1;
        localStorage.setItem("guest_quota", JSON.stringify(quota));
      }
    } catch (error) {
      console.error("Quiz evaluation failed:", error);
      setLoadingMessage("Evaluation Error. Please check backend connection.");
      setTimeout(() => setStep(1), 3000);
    }
  };

  // --- STAGE 2: QUIZ NAVIGATION ---
  const handleAnswerChange = (qId, answer) =>
    setQuizAnswers({ ...quizAnswers, [qId]: answer });

  const handleNext = () => {
    // Current question object based on index
    const currentQuestion = llmQuestions[currentQIndex];

    if (!quizAnswers[currentQuestion.id]) {
      alert("Please select an option before moving to the next question.");
      return;
    }

    if (currentQIndex < llmQuestions.length - 1) {
      setCurrentQIndex((prev) => prev + 1);
    } else {
      handleFinalSubmit();
    }
  };

  const handlePrev = () => {
    if (currentQIndex > 0) setCurrentQIndex((prev) => prev - 1);
  };

  // --- HELPER: Toggle Selection for Multi-select ---
  const toggleSelection = (category, value) => {
    setProfileData((prev) => {
      const current = prev[category];
      const updated = current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value].slice(0, 2); // Max 2 selections
      return { ...prev, [category]: updated };
    });
  };

  // --- RENDER HELPERS ---
  const VerticalProgressBar = () => {
    const progress = ((currentQIndex + 1) / llmQuestions.length) * 100;
    return (
      <div className="flex flex-col items-center justify-center h-full ml-6 hidden md:flex">
        <div className="w-3 h-64 bg-slate-700 rounded-full relative overflow-hidden shadow-inner">
          <div
            className="absolute bottom-0 w-full bg-cyan-500 transition-all duration-500 ease-out shadow-[0_0_15px_rgba(6,182,212,0.6)]"
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
      {/* Limit Modal */}
      {showLimitModal && (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 p-8 rounded-2xl shadow-2xl max-w-sm text-center">
            <h3 className="text-2xl font-bold text-white mb-2">
              Guest Limit Reached
            </h3>
            <p className="text-slate-400 mb-6">
              You have used your <strong>2 free predictions</strong> for this
              week.
            </p>
            <button
              onClick={() => navigate("/register")}
              className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold py-3 rounded-lg transition"
            >
              Create Free Account
            </button>
          </div>
        </div>
      )}

      {/* Main Card */}
      <div className="w-full max-w-3xl flex items-center justify-center">
        <div className="flex-1 bg-slate-800 shadow-2xl rounded-2xl overflow-hidden border border-slate-700 p-8 relative min-h-[500px] flex flex-col">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl -z-0 pointer-events-none"></div>

          {/* ================= STEP 1: PROFILE INPUT ================= */}
          {step === 1 && (
            <form
              onSubmit={handleProfileSubmit}
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

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-3">
                    Select Top 2 Favorite Subjects
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Maths",
                      "Science",
                      "Physics",
                      "Chemistry",
                      "Biology",
                      "Social Studies",
                      "English",
                      "Art",
                      "Computer Science",
                    ].map((sub) => (
                      <button
                        key={sub}
                        type="button"
                        onClick={() => toggleSelection("subjects", sub)}
                        className={`px-4 py-2 rounded-full text-sm font-semibold transition border ${
                          profileData.subjects.includes(sub)
                            ? "bg-cyan-500 text-slate-900 border-cyan-500 shadow-md shadow-cyan-500/20"
                            : "bg-slate-800 text-slate-400 border-slate-600 hover:border-slate-400"
                        }`}
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-3">
                    Select Top 2 Hobbies
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Gaming",
                      "Coding",
                      "Reading",
                      "Writing",
                      "Sports",
                      "Music",
                      "Drawing",
                      "Robotics",
                      "Debating",
                      "Photography",
                    ].map((hobby) => (
                      <button
                        key={hobby}
                        type="button"
                        onClick={() => toggleSelection("hobbies", hobby)}
                        className={`px-4 py-2 rounded-full text-sm font-semibold transition border ${
                          profileData.hobbies.includes(hobby)
                            ? "bg-purple-500 text-white border-purple-500 shadow-md shadow-purple-500/20"
                            : "bg-slate-800 text-slate-400 border-slate-600 hover:border-slate-400"
                        }`}
                      >
                        {hobby}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={
                  profileData.subjects.length === 0 ||
                  profileData.hobbies.length === 0
                }
                className={`w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold py-4 px-6 rounded-xl hover:shadow-lg hover:shadow-cyan-500/30 transition mt-6 transform active:scale-95 ${
                  profileData.subjects.length === 0 ||
                  profileData.hobbies.length === 0
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                Generate Personalized Quiz &rarr;
              </button>
            </form>
          )}

          {/* ================= STEP 2: DYNAMIC QUIZ CARD ================= */}
          {step === 2 && llmQuestions.length > 0 && (
            <div className="flex-1 flex flex-col justify-between relative z-10 animate-fadeIn">
              {/* Question Header & Badge */}
              <div key={currentQIndex} className="animate-slideIn">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-bold tracking-widest text-slate-500 uppercase">
                    Question {currentQIndex + 1} of {llmQuestions.length}
                  </span>
                  {/* TYPE BADGE (Aptitude/Personality) */}
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      llmQuestions[currentQIndex].type === "Aptitude"
                        ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                        : "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                    }`}
                  >
                    {llmQuestions[currentQIndex].type} Check
                  </span>
                </div>

                {/* Question Text */}
                <h3 className="text-xl md:text-2xl font-bold text-white mb-8 leading-snug min-h-[80px]">
                  {llmQuestions[currentQIndex].question}
                </h3>

                {/* Options Grid */}
                <div className="grid grid-cols-1 gap-3">
                  {llmQuestions[currentQIndex].options.map((opt, idx) => {
                    const isSelected =
                      quizAnswers[llmQuestions[currentQIndex].id] === opt;
                    return (
                      <label
                        key={idx}
                        className={`cursor-pointer p-4 rounded-xl flex items-center transition-all duration-200 border-2 ${
                          isSelected
                            ? "bg-cyan-900/20 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.1)]"
                            : "bg-slate-800 border-slate-700 hover:border-slate-500 hover:bg-slate-700/50"
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
                        {/* Custom Radio UI */}
                        <div
                          className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center flex-shrink-0 transition-colors ${
                            isSelected ? "border-cyan-400" : "border-slate-600"
                          }`}
                        >
                          {isSelected && (
                            <div className="w-3 h-3 bg-cyan-400 rounded-full shadow-sm"></div>
                          )}
                        </div>
                        <span
                          className={`font-medium ${
                            isSelected ? "text-cyan-50" : "text-slate-300"
                          }`}
                        >
                          {opt}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-between mt-8 pt-6 border-t border-slate-700/50">
                <button
                  onClick={handlePrev}
                  disabled={currentQIndex === 0}
                  className={`text-slate-400 font-semibold hover:text-white transition flex items-center gap-2 ${
                    currentQIndex === 0
                      ? "opacity-0 cursor-default"
                      : "opacity-100"
                  }`}
                >
                  &larr; Previous
                </button>

                <button
                  onClick={handleNext}
                  disabled={!quizAnswers[llmQuestions[currentQIndex].id]}
                  className={`bg-white text-slate-900 font-bold py-3 px-8 rounded-xl transition hover:bg-cyan-50 shadow-lg ${
                    !quizAnswers[llmQuestions[currentQIndex].id]
                      ? "opacity-50 cursor-not-allowed"
                      : "opacity-100 transform hover:scale-105 hover:shadow-cyan-500/20"
                  }`}
                >
                  {currentQIndex === llmQuestions.length - 1
                    ? "Finish & Evaluate"
                    : "Next Question"}
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 3 & 4: LOADING / RESULT ================= */}
          {(step === 3 || step === 4) && (
            <div className="flex flex-col items-center justify-center h-full text-center relative z-10 animate-fadeIn">
              {step === 3 && (
                <div className="py-12">
                  <div className="relative w-20 h-20 mx-auto mb-8">
                    <div className="absolute top-0 w-full h-full rounded-full border-4 border-slate-700"></div>
                    <div className="absolute top-0 w-full h-full rounded-full border-4 border-t-cyan-400 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2 animate-pulse">
                    {loadingMessage}
                  </h3>
                  <p className="text-slate-400">
                    Our AI is analyzing your patterns...
                  </p>
                </div>
              )}

              {step === 4 && prediction && (
                <div className="w-full">
                  <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700 shadow-inner mb-8 text-left">
                    <h4 className="text-cyan-400 uppercase tracking-widest text-xs font-bold mb-4">
                      AI Evaluation Summary
                    </h4>
                    <p className="text-slate-300 leading-relaxed mb-6 border-b border-slate-700 pb-6">
                      {prediction.summary}
                    </p>

                    <h5 className="text-lg font-bold text-white mb-4">
                      Top 3 Recommended Streams:
                    </h5>
                    <div className="space-y-4">
                      {prediction.suggestions?.map((s, index) => (
                        <div
                          key={index}
                          className="bg-slate-800 p-5 rounded-xl border border-slate-700 hover:border-cyan-500/50 transition group"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-xl font-bold text-white group-hover:text-cyan-300 transition">
                              {s.role}
                            </span>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-bold ${
                                s.confidence > 80
                                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                  : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                              }`}
                            >
                              {s.confidence}% Match
                            </span>
                          </div>
                          <p className="text-sm text-slate-400 mb-3">
                            {s.reason}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {s.required_skills?.map((skill) => (
                              <span
                                key={skill}
                                className="text-[10px] bg-slate-900 text-slate-400 px-2 py-1 rounded border border-slate-700"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setStep(1);
                      setQuizAnswers({});
                      setPrediction(null);
                      setCurrentQIndex(0);
                      setLlmQuestions([]);
                    }}
                    className="text-cyan-400 font-bold hover:text-cyan-300 hover:underline transition"
                  >
                    Start New Analysis
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar Progress Bar */}
        {step === 2 && <VerticalProgressBar />}
      </div>
    </div>
  );
};

export default QuizU10;
