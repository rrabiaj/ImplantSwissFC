import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function MatchNew() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    opponent: '',
    matchDate: '',
    homeScore: '',
    awayScore: '',
    isCompleted: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = {
        opponent: formData.opponent,
        matchDate: formData.matchDate || null,
        homeScore: formData.isCompleted && formData.homeScore ? parseInt(formData.homeScore) : null,
        awayScore: formData.isCompleted && formData.awayScore ? parseInt(formData.awayScore) : null,
        isCompleted: formData.isCompleted,
      };
      await api.post('/matches', payload);
      navigate('/matches');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create match');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Schedule Match</h1>
        <p className="text-gray-400 mt-1">Add a new fixture to your calendar</p>
      </div>

      <div className="bg-[#1a1a2e] border border-gray-800 rounded-xl p-6 shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-secondary/20 border border-secondary/50 text-red-300 px-4 py-3 rounded-lg text-sm">{error}</div>
          )}

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Opponent</label>
            <input
              type="text"
              name="opponent"
              value={formData.opponent}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-[#111111] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              placeholder="e.g. FC Basel"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Match Date</label>
            <input
              type="date"
              name="matchDate"
              value={formData.matchDate}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-[#111111] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="isCompleted"
              checked={formData.isCompleted}
              onChange={handleChange}
              className="w-5 h-5 rounded border-gray-700 bg-[#111111] text-primary focus:ring-primary"
            />
            <label className="text-gray-300 text-sm font-medium">Match Completed</label>
          </div>

          {formData.isCompleted && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Home Score</label>
                <input
                  type="number"
                  name="homeScore"
                  value={formData.homeScore}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#111111] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  min="0"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Away Score</label>
                <input
                  type="number"
                  name="awayScore"
                  value={formData.awayScore}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#111111] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  min="0"
                  required
                />
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-[#357ab5] disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>Saving...</>
              ) : 'Create Match'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/matches')}
              className="px-6 py-3 border border-gray-700 text-gray-300 rounded-lg hover:border-gray-500 hover:text-white transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}