import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function Matches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // all, upcoming, completed

  const fetchMatches = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/matches');
      setMatches(res.data);
    } catch (err) {
      setError('Failed to load matches. Make sure the backend server is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const filteredMatches = matches.filter((m) => {
    if (filter === 'upcoming') return !m.isCompleted;
    if (filter === 'completed') return m.isCompleted;
    return true;
  });

  const getResultBadge = (match) => {
    if (!match.isCompleted) return null;
    if (match.homeScore > match.awayScore) return { text: 'W', color: 'bg-green-900/50 text-green-400 border-green-700' };
    if (match.homeScore < match.awayScore) return { text: 'L', color: 'bg-red-900/50 text-red-400 border-red-700' };
    return { text: 'D', color: 'bg-yellow-900/50 text-yellow-400 border-yellow-700' };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Matches</h1>
          <p className="text-gray-400 mt-1">Track your fixtures and results</p>
        </div>
        <Link
          to="/matches/new"
          className="px-5 py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-[#357ab5] transition-colors flex items-center gap-2"
        >
          <span>+</span>
          <span>New Match</span>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        {[
          { value: 'all', label: 'All' },
          { value: 'upcoming', label: 'Upcoming' },
          { value: 'completed', label: 'Completed' },
        ].map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              filter === f.value
                ? 'bg-primary text-white border-primary'
                : 'bg-[#1a1a2e] text-gray-400 border-gray-700 hover:border-gray-500'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="bg-secondary/20 border border-secondary/50 text-red-300 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-[#1a1a2e] border border-gray-800 rounded-xl p-5 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-800 rounded-full"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-800 rounded w-32"></div>
                    <div className="h-3 bg-gray-800 rounded w-24"></div>
                  </div>
                </div>
                <div className="h-8 w-16 bg-gray-800 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Match List */}
      {!loading && !error && (
        <>
          {filteredMatches.length === 0 ? (
            <div className="bg-[#1a1a2e] border border-gray-800 rounded-xl p-12 text-center">
              <div className="text-4xl mb-4">⚽</div>
              <h3 className="text-white text-lg font-medium mb-2">No matches found</h3>
              <p className="text-gray-400 mb-4">
                {filter !== 'all'
                  ? `No ${filter} matches`
                  : 'Schedule your first match to get started'}
              </p>
              <Link
                to="/matches/new"
                className="inline-flex px-5 py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-[#357ab5] transition-colors"
              >
                Schedule Match
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredMatches.map((match) => {
                const badge = getResultBadge(match);
                return (
                  <Link
                    key={match.id}
                    to={`/matches/${match.id}`}
                    className="block bg-[#1a1a2e] border border-gray-800 rounded-xl p-5 hover:border-primary/30 transition-colors group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center">
                          <span className="text-lg">⚽</span>
                        </div>
                        <div>
                          <h3 className="text-white font-semibold">
                            vs {match.opponent}
                          </h3>
                          <p className="text-gray-400 text-sm">
                            {match.matchDate
                              ? new Date(match.matchDate).toLocaleDateString('en-US', {
                                  weekday: 'short',
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                })
                              : 'Date TBD'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {match.isCompleted ? (
                          <>
                            {badge && (
                              <span className={`text-xs px-2 py-0.5 rounded-full border font-bold ${badge.color}`}>
                                {badge.text}
                              </span>
                            )}
                            <span className="text-white text-xl font-bold">
                              {match.homeScore} : {match.awayScore}
                            </span>
                          </>
                        ) : (
                          <span className="text-xs bg-yellow-900/50 text-yellow-400 px-3 py-1 rounded-full">
                            Upcoming
                          </span>
                        )}
                        <span className="text-gray-600 group-hover:text-gray-400 transition-colors text-lg">
                          →
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}