import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#111111] flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
            IS
          </div>
          <span className="text-white font-bold text-xl">
            Implant <span className="text-primary">Swiss</span> FC
          </span>
        </div>
        <div className="flex gap-3">
          <Link
            to="/login"
            className="px-5 py-2 text-sm text-gray-300 hover:text-white border border-gray-700 rounded-lg hover:border-gray-500 transition-colors"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-5 py-2 text-sm bg-primary text-white rounded-lg hover:bg-[#357ab5] transition-colors"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="mb-8">
          <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6 border-2 border-primary">
            <span className="text-3xl">⚽</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
            Implant <span className="text-primary">Swiss</span> FC
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
            The ultimate football club management platform. Manage your players, matches, and goals — all in one place.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/register"
              className="px-8 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-[#357ab5] transition-colors text-lg"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="px-8 py-3 border border-gray-700 text-gray-300 font-semibold rounded-lg hover:border-gray-500 hover:text-white transition-colors text-lg"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
          <FeatureCard
            icon="👥"
            title="Player Management"
            description="Manage your squad — from starters to substitutes. Track positions, shirt numbers, and player status."
          />
          <FeatureCard
            icon="⚽"
            title="Match Tracking"
            description="Record match results, track scores, and manage your season schedule with ease."
          />
          <FeatureCard
            icon="🎯"
            title="Goal Analytics"
            description="Track every goal scored. Know who's scoring, when, and against which opponent."
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 px-6 py-4 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Implant Swiss FC. All rights reserved.
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-[#1a1a2e] border border-gray-800 rounded-xl p-6 text-left hover:border-primary/30 transition-colors">
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="text-white font-semibold text-lg mb-2">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
    </div>
  );
}
