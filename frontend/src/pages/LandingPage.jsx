import LinkButton from '../components/LinkButton';

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen font-sans">
      
      {/* === HERO SECTION === */}
      <header className="bg-gradient-to-r from-brandBlue to-blue-500 text-white py-20 px-6 text-center shadow-xl relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight leading-tight">
            Find Your Clarity with <span className="text-yellow-300">CareerScope AI</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            The intelligent career guidance platform for students, powered by AI. From 10th grade to your first job.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <LinkButton to="/quiz-u10" primary={true}>
              Start U10 Stream Quiz
            </LinkButton>
            <LinkButton to="/login">
              Login / View Profile
            </LinkButton>
          </div>
        </div>
        {/* Decorative background shape */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gray-50 rounded-t-[50%]" style={{ transform: 'scaleX(1.5)' }}></div>
      </header>

      {/* === FEATURES SECTION === */}
      <main className="flex-grow py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Tailored Guidance for Every Stage
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature Card 1: U10 */}
            <FeatureCard 
              title="U10: Stream Selection"
              emoji="🧭"
              description="Confused between Science, Commerce, or Arts? Take our interest-based quiz aligned with CBSE/ICSE curriculums to find your perfect stream."
              link="/quiz-u10"
              linkText="Explore U10 Quiz →"
            />
            {/* Feature Card 2: U12 */}
            <FeatureCard 
              title="U12: Branch Selector"
              emoji="⚙️"
              description="Finished 12th? Discover which Engineering branch (CSE, Mech, Civil, etc.) matches your aptitude and technical interests."
              link="/quiz-u12-placeholder"
              linkText="Explore U12 Quiz →"
            />
             {/* Feature Card 3: UGrad */}
            <FeatureCard 
              title="UGrad: Job Role AI"
              emoji="📄"
              description="Engineering student looking for a job? Upload your resume and let our AI NLP engine recommend the best job roles for your skills."
              link="/resume-analyzer-placeholder"
              linkText="Analyze Resume →"
            />
          </div>
        </div>
      </main>

      {/* === FOOTER CALL TO ACTION === */}
      <footer className="bg-gray-800 text-white py-12 text-center">
        <h3 className="text-2xl font-bold mb-4">Ready to define your future?</h3>
        <p className="mb-6 text-gray-400">Join thousands of Indian students making smarter career decisions.</p>
        <LinkButton to="/login" primary={true}>
          Create Free Account
        </LinkButton>
        <p className="mt-8 text-sm text-gray-500">
          © 2025 CareerScope AI Project. Built with MERN Stack & Python.
        </p>
      </footer>
    </div>
  );
};

// Internal helper component for cards to keep code clean
const FeatureCard = ({ title, emoji, description, link, linkText }) => {
  return (
    <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 border-t-4 border-brandBlue flex flex-col">
      <div className="text-5xl mb-4">{emoji}</div>
      <h3 className="text-2xl font-bold mb-3 text-gray-800">{title}</h3>
      <p className="text-gray-600 mb-6 flex-grow leading-relaxed">
        {description}
      </p>
      <a href={link} className="text-brandBlue font-semibold hover:underline mt-auto">
        {linkText}
      </a>
    </div>
  );
};

export default LandingPage;