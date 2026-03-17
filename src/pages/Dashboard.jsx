import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const StatCard = ({ icon, label, value, color }) => (
  <div className={`bg-white rounded-2xl p-5 shadow-md border-l-4 ${color}`}>
    <div className="flex justify-between items-start">
      <div>
        <p className="text-gray-500 text-sm">{label}</p>
        <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
      </div>
      <span className="text-3xl">{icon}</span>
    </div>
  </div>
);

const StatusBadge = ({ status }) => {
  const styles = { Pending: 'bg-yellow-100 text-yellow-700', Approved: 'bg-green-100 text-green-700', Rejected: 'bg-red-100 text-red-700' };
  return <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status] || 'bg-gray-100 text-gray-600'}`}>{status}</span>;
};

const Dashboard = () => {
  const { user, API } = useAuth();
  const [passes, setPasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPasses = async () => {
      try {
        const res = await API.get('/epass/my-passes');
        setPasses(res.data.passes || []);
      } catch (err) {
        toast.error('Failed to load passes');
      } finally {
        setLoading(false);
      }
    };
    fetchPasses();
  }, [API]);

  const stats = {
    total: passes.length,
    pending: passes.filter(p => p.status === 'Pending').length,
    approved: passes.filter(p => p.status === 'Approved').length,
    rejected: passes.filter(p => p.status === 'Rejected').length,
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-6 mb-8 text-white shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Hello, {user?.name?.split(' ')[0]}! 👋</h1>
            <p className="text-blue-200 mt-1">{user?.email}</p>
          </div>
          <Link to="/apply" className="self-start sm:self-center px-5 py-2.5 bg-white text-blue-700 rounded-xl font-semibold hover:bg-blue-50 transition shadow-md text-sm">
            + Apply New Pass
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon="📋" label="Total Applied" value={stats.total} color="border-blue-500" />
        <StatCard icon="⏳" label="Pending" value={stats.pending} color="border-yellow-500" />
        <StatCard icon="✅" label="Approved" value={stats.approved} color="border-green-500" />
        <StatCard icon="❌" label="Rejected" value={stats.rejected} color="border-red-500" />
      </div>

      {/* Recent Passes */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-lg font-bold text-gray-800">Recent Applications</h2>
          <Link to="/my-passes" className="text-blue-600 text-sm font-medium hover:underline">View All →</Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div></div>
        ) : passes.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📂</div>
            <p className="text-gray-500 text-lg mb-2">No applications yet</p>
            <p className="text-gray-400 text-sm mb-6">Apply for your first e-pass to get started</p>
            <Link to="/apply" className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition">Apply Now</Link>
          </div>
        ) : (
          <div className="divide-y">
            {passes.slice(0, 5).map((pass) => (
              <Link to={`/pass/${pass._id}`} key={pass._id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition">
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{pass.passId}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{pass.source} → {pass.destination}</p>
                  <p className="text-gray-400 text-xs">{new Date(pass.travelDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <StatusBadge status={pass.status} />
                  <span className="text-blue-500 text-xs">View →</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        <Link to="/apply" className="bg-blue-600 text-white rounded-2xl p-5 flex items-center gap-3 hover:bg-blue-700 transition shadow-md">
          <span className="text-2xl">📝</span>
          <div><p className="font-semibold">Apply for Pass</p><p className="text-blue-200 text-xs">Submit new application</p></div>
        </Link>
        <Link to="/my-passes" className="bg-white text-gray-800 rounded-2xl p-5 flex items-center gap-3 hover:bg-gray-50 transition shadow-md border">
          <span className="text-2xl">🗂️</span>
          <div><p className="font-semibold">My Passes</p><p className="text-gray-500 text-xs">View all applications</p></div>
        </Link>
        <div className="bg-white text-gray-800 rounded-2xl p-5 flex items-center gap-3 shadow-md border">
          <span className="text-2xl">👤</span>
          <div><p className="font-semibold">Profile</p><p className="text-gray-500 text-xs">{user?.mobile}</p></div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
