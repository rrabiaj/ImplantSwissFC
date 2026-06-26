import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

const POSITION_COLORS = {
  GK: 'bg-yellow-600',
  DF: 'bg-blue-600',
  MF: 'bg-green-600',
  FW: 'bg-red-600',
};

const POSITION_NAMES = { GK: 'Goalkeeper', DF: 'Defender', MF: 'Midfielder', FW: 'Forward' };

export default function PlayerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [player, setPlayer] = useState(null);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [playerRes, goalsRes] = await Promise.all([
          api.get(`/players/${id}`),
          api.get(`/goals/player/${id}`).catch(() => ({ data: [] })),
        ]);
        setPlayer(playerRes.data);
        setGoals(goalsRes.data || []);
      } catch (err) {
        setError('Failed to load player');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this player?')) return;
    try {
      await api.delete(`/players/${id}`);
      navigate('/players');
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 w-48 bg-gray-800 rounded"></div>
        <div className="bg-[#1a1a2e] border border-gray-800 rounded-xl p-6">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-gray-800 rounded-full"></div>
            <div className="space-y-3">
              <div className="h-6 w-40 bg-gray-800 rounded"></div>
              <div className="h-4 w-24 bg-gray-800 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-secondary/20 border border-secondary/50 text-red-300 px-4 py-3 rounded-lg text-sm">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link to="/players" className="text-gray-400 hover:text-white text-sm flex items-center gap-1 mb-2">
            ← Back to Players
          </Link>
          <h1 className="text-2xl font-bold text-white">Player Details</h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/players/${id}/edit`)}
            className="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-[#357ab5] transition-colors"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-secondary text-white text-sm rounded-lg hover:bg-[#8a2222] transition-colors"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Player Card */}
      <div className="bg-[#1a1a2e] border border-gray-800 rounded-xl p-6">
        <div className="flex items-center gap-6">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-bold ${POSITION_COLORS[player?.position] || 'bg-gray-600'}`}>
            {player?.shirtNumber || '?'}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white">{player?.fullName}</h2>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-sm px-3 py-1 rounded-full bg-primary/20 text-primary border border-primary/30">
                {POSITION_NAMES[player?.position] || player?.position}
              </span>
              <span className="text-sm px-3 py-1 rounded-full bg-gray-700 text-gray-300">
                #{player?.shirtNumber}
              </span>
              <span className={`text-sm px-3 py-1 rounded-full ${
                player?.isActive ? 'bg-green-900/50 text-green-400' : 'bg-gray-700 text-gray-400'
              }`}>
                {player?.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Goals Section */}
      <div className="bg-[#1a1a2e] border border-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">⚽ Goals Scored ({goals.length})</h3>
        {goals.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No goals recorded yet</p>
        ) : (
          <div className="space-y-2">
            {goals.map((goal) => (
              <div key={goal.id} className="flex items-center justify-between p-3 bg-[#111111] rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-lg">⚽</span>
                  <span className="text-white font-medium">{goal.goalScorer || player?.fullName}</span>
                </div>
                <span className="text-gray-400 text-sm">
                  Minute {goal.minute}'
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}