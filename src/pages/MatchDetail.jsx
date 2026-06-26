import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

export default function MatchDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [match, setMatch] = useState(null);
  const [goals, setGoals] = useState([]);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [newGoal, setNewGoal] = useState({ playerId: '', minute: '' });
  const [goalSaving, setGoalSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [matchRes, goalsRes, playersRes] = await Promise.all([
          api.get(`/matches/${id}`),
          api.get(`/goals/match/${id}`).catch(() => ({ data: [] })),
          api.get('/players').catch(() => ({ data: [] })),
        ]);
        setMatch(matchRes.data);
        setGoals(goalsRes.data || []);
        setPlayers(playersRes.data || []);
      } catch (err) {
        setError('Failed to load match details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleAddGoal = async (e) => {
    e.preventDefault();
    if (!newGoal.playerId || !newGoal.minute) return;
    setGoalSaving(true);
    try {
      const selectedPlayer = players.find(p => p.id === parseInt(newGoal.playerId));
      const res = await api.post('/goals', {
        playerId: parseInt(newGoal.playerId),
        matchId: parseInt(id),
        minute: parseInt(newGoal.minute),
        goalScorer: selectedPlayer?.fullName || `Player #${newGoal.playerId}`,
      });
      setGoals([...goals, res.data]);
      setNewGoal({ playerId: '', minute: '' });
      setShowGoalForm(false);
    } catch (err) {
      console.error('Failed to add goal:', err);
    } finally {
      setGoalSaving(false);
    }
  };

  const handleToggleComplete = async () => {
    try {
      await api.put(`/matches/${id}`, {
        ...match,
        isCompleted: !match.isCompleted,
      });
      setMatch({ ...match, isCompleted: !match.isCompleted });
    } catch (err) {
      console.error('Failed to toggle match status:', err);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-6 max-w-2xl mx-auto">
        <div className="h-8 w-48 bg-gray-800 rounded"></div>
        <div className="bg-[#1a1a2e] border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-3">
              <div className="h-6 w-40 bg-gray-800 rounded"></div>
              <div className="h-4 w-24 bg-gray-800 rounded"></div>
            </div>
            <div className="h-12 w-24 bg-gray-800 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-secondary/20 border border-secondary/50 text-red-300 px-4 py-3 rounded-lg text-sm max-w-2xl mx-auto">{error}</div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link to="/matches" className="text-gray-400 hover:text-white text-sm flex items-center gap-1 mb-2">
            ← Back to Matches
          </Link>
          <h1 className="text-2xl font-bold text-white">Match Details</h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleToggleComplete}
            className={`px-4 py-2 text-sm rounded-lg transition-colors ${
              match?.isCompleted
                ? 'bg-yellow-900/50 text-yellow-400 border border-yellow-700 hover:bg-yellow-900/70'
                : 'bg-green-900/50 text-green-400 border border-green-700 hover:bg-green-900/70'
            }`}
          >
            {match?.isCompleted ? 'Mark as Upcoming' : 'Mark as Completed'}
          </button>
          <button
            onClick={() => navigate(`/matches/${id}/edit`)}
            className="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-[#357ab5] transition-colors"
          >
            Edit
          </button>
        </div>
      </div>

      {/* Match Card */}
      <div className="bg-[#1a1a2e] border border-gray-800 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">vs {match?.opponent}</h2>
            <p className="text-gray-400 mt-1">
              {match?.matchDate
                ? new Date(match.matchDate).toLocaleDateString('en-US', {
                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                  })
                : 'Date TBD'}
            </p>
          </div>
          <div className="text-right">
            {match?.isCompleted ? (
              <div>
                <span className="text-4xl font-bold text-white">
                  {match.homeScore} : {match.awayScore}
                </span>
                <div className="mt-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-bold border ${
                    match.homeScore > match.awayScore ? 'bg-green-900/50 text-green-400 border-green-700' :
                    match.homeScore < match.awayScore ? 'bg-red-900/50 text-red-400 border-red-700' :
                    'bg-yellow-900/50 text-yellow-400 border-yellow-700'
                  }`}>
                    {match.homeScore > match.awayScore ? 'W' : match.homeScore < match.awayScore ? 'L' : 'D'}
                  </span>
                </div>
              </div>
            ) : (
              <span className="text-sm bg-yellow-900/50 text-yellow-400 px-4 py-2 rounded-full">Upcoming</span>
            )}
          </div>
        </div>
      </div>

      {/* Goals Section */}
      <div className="bg-[#1a1a2e] border border-gray-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">⚽ Goals ({goals.length})</h3>
          <button
            onClick={() => setShowGoalForm(!showGoalForm)}
            className="px-3 py-1.5 bg-primary text-white text-sm rounded-lg hover:bg-[#357ab5] transition-colors"
          >
            + Add Goal
          </button>
        </div>

        {/* Goal Form */}
        {showGoalForm && (
          <form onSubmit={handleAddGoal} className="mb-4 p-4 bg-[#111111] rounded-lg border border-gray-700">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-400 text-xs font-medium mb-1">Player</label>
                <select
                  value={newGoal.playerId}
                  onChange={(e) => setNewGoal({ ...newGoal, playerId: e.target.value })}
                  className="w-full px-3 py-2 bg-[#1a1a2e] border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-primary"
                  required
                >
                  <option value="">Select player...</option>
                  {players.map((p) => (
                    <option key={p.id} value={p.id}>
                      #{p.shirtNumber || '?'} {p.fullName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-400 text-xs font-medium mb-1">Minute</label>
                <input
                  type="number"
                  value={newGoal.minute}
                  onChange={(e) => setNewGoal({ ...newGoal, minute: e.target.value })}
                  className="w-full px-3 py-2 bg-[#1a1a2e] border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-primary"
                  min="1" max="120" placeholder="e.g. 45" required
                />
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <button type="submit" disabled={goalSaving}
                className="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-[#357ab5] disabled:opacity-50 transition-colors"
              >
                {goalSaving ? 'Adding...' : 'Add Goal'}
              </button>
              <button type="button" onClick={() => setShowGoalForm(false)}
                className="px-4 py-2 border border-gray-700 text-gray-300 text-sm rounded-lg hover:border-gray-500 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Goals List */}
        {goals.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No goals recorded for this match</p>
        ) : (
          <div className="space-y-2">
            {goals.map((goal) => (
              <div key={goal.id} className="flex items-center justify-between p-3 bg-[#111111] rounded-lg hover:bg-[#222244] transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-xl">⚽</span>
                  <div>
                    <span className="text-white font-medium">{goal.goalScorer}</span>
                    {goal.playerId && (
                      <span className="text-gray-500 text-xs ml-2">(#{goal.playerId})</span>
                    )}
                  </div>
                </div>
                <span className="text-primary font-bold text-lg">{goal.minute}'</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}