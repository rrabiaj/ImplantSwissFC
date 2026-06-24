import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const POSITIONS = ['GK', 'DF', 'MF', 'FW'];
const POSITION_NAMES = { GK: 'Goalkeeper', DF: 'Defender', MF: 'Midfielder', FW: 'Forward' };
const POSITION_COLORS = {
  GK: 'bg-yellow-900/50 text-yellow-400 border-yellow-700',
  DF: 'bg-blue-900/50 text-blue-400 border-blue-700',
  MF: 'bg-green-900/50 text-green-400 border-green-700',
  FW: 'bg-red-900/50 text-red-400 border-red-700',
};

export default function Players() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [positionFilter, setPositionFilter] = useState('');

  const fetchPlayers = async () => {
    setLoading(true);
    setError('');
    try {
      const params = positionFilter ? { position: positionFilter } : {};
      const res = await api.get('/players', { params });
      setPlayers(res.data);
    } catch (err) {
      setError('Failed to load players. Make sure the backend server is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayers();
  }, [positionFilter]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this player?')) return;
    try {
      await api.delete(`/players/${id}`);
      setPlayers(players.filter((p) => p.id !== id));
    } catch (err) {
      console.error('Failed to delete player:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Players</h1>
          <p className="text-gray-400 mt-1">Manage your squad</p>
        </div>
        <Link
          to="/players/new"
          className="px-5 py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-[#357ab5] transition-colors flex items-center gap-2"
        >
          <span>+</span>
          <span>Add Player</span>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setPositionFilter('')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
            !positionFilter
              ? 'bg-primary text-white border-primary'
              : 'bg-[#1a1a2e] text-gray-400 border-gray-700 hover:border-gray-500'
          }`}
        >
          All
        </button>
        {POSITIONS.map((pos) => (
          <button
            key={pos}
            onClick={() => setPositionFilter(pos)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              positionFilter === pos
                ? 'bg-primary text-white border-primary'
                : 'bg-[#1a1a2e] text-gray-400 border-gray-700 hover:border-gray-500'
            }`}
          >
            {pos}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-[#1a1a2e] border border-gray-800 rounded-xl p-5 animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gray-800 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-800 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-800 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Player Grid */}
      {!loading && !error && (
        <>
          {players.length === 0 ? (
            <div className="bg-[#1a1a2e] border border-gray-800 rounded-xl p-12 text-center">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-white text-lg font-medium mb-2">No players found</h3>
              <p className="text-gray-400 mb-4">
                {positionFilter
                  ? `No players in position ${positionFilter}`
                  : 'Get started by adding your first player'}
              </p>
              <Link
                to="/players/new"
                className="inline-flex px-5 py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-[#357ab5] transition-colors"
              >
                Add Player
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {players.map((player) => (
                <div
                  key={player.id}
                  className="bg-[#1a1a2e] border border-gray-800 rounded-xl p-5 hover:border-primary/30 transition-all group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white text-lg font-bold ${
                        player.position === 'GK' ? 'bg-yellow-600' :
                        player.position === 'DF' ? 'bg-blue-600' :
                        player.position === 'MF' ? 'bg-green-600' :
                        'bg-red-600'
                      }`}>
                        {player.shirtNumber || '?'}
                      </div>
                      <div>
                        <h3 className="text-white font-semibold text-lg">{player.fullName}</h3>
                        <span className={`inline-block text-xs px-2 py-0.5 rounded-full border mt-1 ${POSITION_COLORS[player.position] || 'bg-gray-700 text-gray-400'}`}>
                          {POSITION_NAMES[player.position] || player.position}
                        </span>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      player.isActive ? 'bg-green-900/50 text-green-400' : 'bg-gray-700 text-gray-400'
                    }`}>
                      {player.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="mt-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link
                      to={`/players/${player.id}`}
                      className="text-xs px-3 py-1.5 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-colors"
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() => handleDelete(player.id)}
                      className="text-xs px-3 py-1.5 bg-secondary/20 text-red-300 rounded-lg hover:bg-secondary/30 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}