import LinkButton from "../components/LinkButton";

const LandingPage = () => {
  return (
    // 1. Base Background Color (Dark)
    <div className="flex flex-col min-h-screen font-sans bg-slate-900 text-slate-100">
      {/* === HERO SECTION === */}
      <header className="relative pt-24 pb-40 px-6 overflow-hidden">
        {/* Background Glow (Accent Color) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-cyan-500/20 rounded-full blur-[120px] -z-10 opacity-30"></div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-full px-4 py-1.5 mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span className="text-xs font-bold tracking-wide uppercase text-slate-300">
              New: Resume Analysis
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tight leading-tight">
            Map Your Future with <br className="hidden md:block" />
            {/* Accent Color Text */}
            <span className="text-cyan-400 drop-shadow-lg">
              AI-Powered Clarity
            </span>
          </h1>

          <p className="text-lg md:text-xl mb-12 text-slate-400 max-w-2xl mx-auto leading-relaxed font-normal">
            The only platform tailored specifically for{" "}
            <strong>Indian Students</strong>. From choosing your 11th Stream to
            decoding your Engineering Branch and landing that first job.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-5">
            {/* Primary Button: Uses Accent Color */}
            <div className="shadow-[0_0_20px_rgba(6,182,212,0.3)] rounded-lg">
              <LinkButton to="/quiz-u10" primary={true}>
                🚀 Start Stream Quiz
              </LinkButton>
            </div>
            {/* Secondary Button: Outline Style */}
            <div className="bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors">
              <LinkButton to="/login">View Dashboard</LinkButton>
            </div>
          </div>
        </div>

        {/* Divider Line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>
      </header>

      {/* === STATS BAR === */}
      <section className="relative px-6 py-12 border-b border-slate-800">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <StatItem number="10k+" label="Students Guided" />
          <StatItem number="95%" label="Accuracy Rate" />
          <StatItem number="50+" label="Career Paths" />
          <StatItem number="24/7" label="AI Availability" />
        </div>
      </section>

      {/* === FEATURES SECTION === */}
      <main className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-cyan-400 font-bold tracking-widest uppercase text-xs mb-3">
              Our Core Modules
            </h2>
            <h3 className="text-3xl md:text-4xl font-extrabold text-white">
              Guidance for Every Milestone
            </h3>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<CompassIcon />}
              title="Class 10: Stream Selector"
              description="Science, Commerce, or Arts? Analyze your interests against CBSE/ICSE patterns to find your perfect fit."
              link="/quiz-u10"
              linkText="Take Stream Quiz"
            />
            <FeatureCard
              icon={<CpuIcon />}
              title="Class 12: Branch Finder"
              description="Don't just follow the crowd. Find the Engineering branch (CS, Mech, Civil) that matches your actual aptitude."
              link="/quiz-u12-placeholder"
              linkText="Find My Branch"
            />
            <FeatureCard
              icon={<FileTextIcon />}
              title="Graduates: Resume AI"
              description="Upload your resume. Our NLP engine extracts skills and predicts the specific job roles you are most likely to crack."
              link="/resume-analyzer-placeholder"
              linkText="Analyze Resume"
            />
          </div>
        </div>
      </main>

      {/* === HOW IT WORKS === */}
      <section className="bg-slate-800/50 py-24 px-6 border-y border-slate-800">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16 text-white">
            Three Steps to Clarity
          </h2>
          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-8 left-[16%] right-[16%] h-0.5 bg-slate-700 -z-0"></div>

            <Step
              number="1"
              title="Input Data"
              desc="Answer a simple quiz or upload your resume PDF."
            />
            <Step
              number="2"
              title="AI Processing"
              desc="Our Python engine analyzes patterns & market trends."
            />
            <Step
              number="3"
              title="Get Roadmap"
              desc="Receive a detailed report with career predictions."
            />
          </div>
        </div>
      </section>

      {/* === FOOTER === */}
      <footer className="bg-slate-950 text-slate-400 py-16 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h3 className="text-2xl font-bold text-white mb-6">
            Ready to shape your future?
          </h3>
          <p className="mb-10 text-slate-400">
            Join the smartest students making data-driven career decisions
            today.
          </p>
          <div className="inline-block shadow-[0_0_15px_rgba(6,182,212,0.4)] rounded-lg">
            <LinkButton to="/login" primary={true}>
              Create Free Account
            </LinkButton>
          </div>
          <div className="mt-16 pt-8 border-t border-slate-900 text-sm text-slate-600">
            <p>
              &copy; 2025 CareerScope AI Project. Built with MERN Stack &
              Python.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

/* --- SUB-COMPONENTS (Refined for Dark Theme) --- */

const FeatureCard = ({ icon, title, description, link, linkText }) => {
  return (
    <div className="group bg-slate-800 p-8 rounded-2xl border border-slate-700 hover:border-cyan-500/50 hover:bg-slate-800/80 transition-all duration-300 hover:-translate-y-2 flex flex-col relative overflow-hidden">
      {/* Icon Area */}
      <div className="w-14 h-14 rounded-xl bg-slate-900 border border-slate-700 text-cyan-400 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-cyan-500/30 transition-all duration-300">
        {icon}
      </div>

      <h3 className="text-xl font-bold mb-3 text-white">{title}</h3>
      <p className="text-slate-400 mb-8 flex-grow leading-relaxed text-sm">
        {description}
      </p>

      <a
        href={link}
        className="inline-flex items-center text-cyan-400 font-bold text-sm hover:text-cyan-300 hover:underline mt-auto group-hover:gap-2 transition-all"
      >
        {linkText} <span className="ml-1 text-lg">&rarr;</span>
      </a>
    </div>
  );
};

const StatItem = ({ number, label }) => (
  <div className="flex flex-col items-center">
    <div className="text-3xl md:text-4xl font-black mb-2 text-white">
      {number}
    </div>
    <div className="text-cyan-500 text-xs font-bold uppercase tracking-widest">
      {label}
    </div>
  </div>
);

const Step = ({ number, title, desc }) => (
  <div className="relative flex flex-col items-center text-center z-10">
    <div className="w-16 h-16 bg-slate-900 border-2 border-slate-700 text-cyan-400 rounded-2xl rotate-3 flex items-center justify-center text-2xl font-bold mb-6 group-hover:rotate-6 transition-transform shadow-lg shadow-black/50">
      <span className="-rotate-3">{number}</span>
    </div>
    <h4 className="text-lg font-bold mb-2 text-white">{title}</h4>
    <p className="text-slate-400 text-sm leading-relaxed max-w-xs">{desc}</p>
  </div>
);

/* --- SVG ICONS --- */
const CompassIcon = () => (
  <svg
    className="w-8 h-8"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
    ></path>
  </svg>
);
const CpuIcon = () => (
  <svg
    className="w-8 h-8"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
    ></path>
  </svg>
);
const FileTextIcon = () => (
  <svg
    className="w-8 h-8"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    ></path>
  </svg>
);

export default LandingPage;
