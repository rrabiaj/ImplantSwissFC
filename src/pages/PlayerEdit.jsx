import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

const POSITIONS = [
  { value: 'GK', label: 'Goalkeeper' },
  { value: 'DF', label: 'Defender' },
  { value: 'MF', label: 'Midfielder' },
  { value: 'FW', label: 'Forward' },
];

export default function PlayerEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    position: 'FW',
    shirtNumber: '',
    isActive: true,
  });

  useEffect(() => {
    const fetchPlayer = async () => {
      try {
        const res = await api.get(`/players/${id}`);
        const p = res.data;
        setFormData({
          fullName: p.fullName || '',
          position: p.position || 'FW',
          shirtNumber: p.shirtNumber ? String(p.shirtNumber) : '',
          isActive: p.isActive !== false,
        });
      } catch (err) {
        setError('Failed to load player');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlayer();
  }, [id]);

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
    setSaving(true);
    try {
      await api.put(`/players/${id}`, {
        ...formData,
        shirtNumber: formData.shirtNumber ? parseInt(formData.shirtNumber) : null,
      });
      navigate(`/players/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update player');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-6 max-w-lg mx-auto">
        <div className="h-8 w-48 bg-gray-800 rounded"></div>
        <div className="bg-[#1a1a2e] border border-gray-800 rounded-xl p-6 space-y-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-12 bg-gray-800 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div>
        <Link to={`/players/${id}`} className="text-gray-400 hover:text-white text-sm flex items-center gap-1 mb-2">
          ← Back to Player
        </Link>
        <h1 className="text-2xl font-bold text-white">Edit Player</h1>
        <p className="text-gray-400 mt-1">Update {formData.fullName}'s details</p>
      </div>

      <div className="bg-[#1a1a2e] border border-gray-800 rounded-xl p-6 shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-secondary/20 border border-secondary/50 text-red-300 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-[#111111] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Position</label>
            <select
              name="position"
              value={formData.position}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-[#111111] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            >
              {POSITIONS.map((p) => (
                <option key={p.value} value={p.value}>{p.label} ({p.value})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Shirt Number</label>
            <input
              type="number"
              name="shirtNumber"
              value={formData.shirtNumber}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-[#111111] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              min="1" max="99"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="w-5 h-5 rounded border-gray-700 bg-[#111111] text-primary focus:ring-primary"
            />
            <label className="text-gray-300 text-sm font-medium">Active Player</label>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-[#357ab5] disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
            >
              {saving ? (
                <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>Saving...</>
              ) : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={() => navigate(`/players/${id}`)}
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