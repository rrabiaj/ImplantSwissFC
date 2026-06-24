import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function Dashboard() {
  const { user } = useAuth();
  const [players, setPlayers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [playersRes, matchesRes] = await Promise.all([
          api.get('/players').catch(() => ({ data: [] })),
          api.get('/matches').catch(() => ({ data: [] })),
        ]);
        setPlayers(playersRes.data || []);
        setMatches(matchesRes.data || []);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const completedMatches = matches.filter((m) => m.isCompleted);
  const totalGoals = completedMatches.reduce(
    (sum, m) => sum + (m.homeScore || 0) + (m.awayScore || 0),
    0
  );

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">
          Welcome, {user?.username || 'Manager'}!
        </h1>
        <p className="text-gray-400 mt-1">Here's your team overview</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon="👥"
          label="Total Players"
          value={players.length}
          color="border-l-primary"
          loading={loading}
        />
        <StatCard
          icon="⚽"
          label="Total Matches"
          value={matches.length}
          color="border-l-secondary"
          loading={loading}
        />
        <StatCard
          icon="✅"
          label="Completed"
          value={completedMatches.length}
          color="border-l-green-500"
          loading={loading}
        />
        <StatCard
          icon="🎯"
          label="Total Goals"
          value={totalGoals}
          color="border-l-yellow-500"
          loading={loading}
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Players */}
        <div className="bg-[#1a1a2e] border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Recent Players</h2>
            <Link to="/players" className="text-primary text-sm hover:underline">
              View All
            </Link>
          </div>
          {loading ? (
            <div className="animate-pulse space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 bg-gray-800 rounded-lg"></div>
              ))}
            </div>
          ) : players.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No players yet</p>
              <Link
                to="/players/new"
                className="inline-block mt-2 text-primary text-sm hover:underline"
              >
                Add your first player
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {players.slice(0, 5).map((player) => (
                <Link
                  key={player.id}
                  to={`/players/${player.id}`}
                  className="flex items-center justify-between p-3 bg-[#111111] rounded-lg hover:bg-[#222244] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                      player.position === 'GK' ? 'bg-yellow-600' :
                      player.position === 'DF' ? 'bg-blue-600' :
                      player.position === 'MF' ? 'bg-green-600' :
                      'bg-red-600'
                    }`}>
                      {player.shirtNumber || '?'}
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">{player.fullName}</p>
                      <p className="text-gray-500 text-xs">{player.position}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    player.isActive ? 'bg-green-900/50 text-green-400' : 'bg-gray-700 text-gray-400'
                  }`}>
                    {player.isActive ? 'Active' : 'Inactive'}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent Matches */}
        <div className="bg-[#1a1a2e] border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Recent Matches</h2>
            <Link to="/matches" className="text-primary text-sm hover:underline">
              View All
            </Link>
          </div>
          {loading ? (
            <div className="animate-pulse space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 bg-gray-800 rounded-lg"></div>
              ))}
            </div>
          ) : matches.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No matches yet</p>
              <Link
                to="/matches/new"
                className="inline-block mt-2 text-primary text-sm hover:underline"
              >
                Schedule your first match
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {matches.slice(0, 5).map((match) => (
                <Link
                  key={match.id}
                  to={`/matches/${match.id}`}
                  className="flex items-center justify-between p-3 bg-[#111111] rounded-lg hover:bg-[#222244] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                      <span className="text-sm">⚽</span>
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">vs {match.opponent}</p>
                      <p className="text-gray-500 text-xs">
                        {match.matchDate ? new Date(match.matchDate).toLocaleDateString() : 'TBD'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    {match.isCompleted ? (
                      <span className="text-white font-bold">
                        {match.homeScore} - {match.awayScore}
                      </span>
                    ) : (
                      <span className="text-xs bg-yellow-900/50 text-yellow-400 px-2 py-1 rounded-full">
                        Upcoming
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color, loading }) {
  return (
    <div className={`bg-[#1a1a2e] border border-gray-800 rounded-xl p-5 border-l-4 ${color}`}>
      {loading ? (
        <div className="animate-pulse">
          <div className="h-8 w-8 bg-gray-800 rounded mb-3"></div>
          <div className="h-4 w-20 bg-gray-800 rounded mb-2"></div>
          <div className="h-8 w-12 bg-gray-800 rounded"></div>
        </div>
      ) : (
        <>
          <div className="text-2xl mb-2">{icon}</div>
          <p className="text-gray-400 text-sm">{label}</p>
          <p className="text-white text-3xl font-bold">{value}</p>
        </>
      )}
    </div>
  );
}
