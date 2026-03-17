import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const StatCard = ({ icon, label, value, color, bgColor }) => (
  <div className={`${bgColor} rounded-2xl p-5 text-white shadow-lg`}>
    <div className="flex justify-between items-start">
      <div>
        <p className="text-white/80 text-sm">{label}</p>
        <p className="text-4xl font-bold mt-1">{value}</p>
      </div>
      <span className="text-3xl opacity-80">{icon}</span>
    </div>
  </div>
);

const AdminDashboard = () => {
  const { API } = useAuth();
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0, users: 0 });
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, appsRes] = await Promise.all([
          API.get('/admin/stats'),
          API.get('/admin/applications?limit=5')
        ]);
        setStats(statsRes.data.stats);
        setRecent(appsRes.data.passes || []);
      } catch (err) {
        toast.error('Failed to load admin data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [API]);

  const StatusBadge = ({ status }) => {
    const styles = { Pending: 'bg-yellow-100 text-yellow-700', Approved: 'bg-green-100 text-green-700', Rejected: 'bg-red-100 text-red-700' };
    return <span className={`px-2 py-1 rounded-full text-xs font-semibold ${styles[status]}`}>{status}</span>;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-3xl p-6 mb-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Admin Dashboard 🛡️</h1>
            <p className="text-gray-400 mt-1">E-Pass Management System Control Panel</p>
          </div>
          <Link to="/admin/applications" className="self-start sm:self-center px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition text-sm shadow-md">
            Review Applications →
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <StatCard icon="📋" label="Total" value={stats.total} bgColor="bg-blue-600" />
        <StatCard icon="⏳" label="Pending" value={stats.pending} bgColor="bg-yellow-500" />
        <StatCard icon="✅" label="Approved" value={stats.approved} bgColor="bg-green-600" />
        <StatCard icon="❌" label="Rejected" value={stats.rejected} bgColor="bg-red-500" />
        <StatCard icon="👥" label="Users" value={stats.users} bgColor="bg-purple-600" />
      </div>

      {/* Pending Alert */}
      {stats.pending > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 mb-6 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔔</span>
            <div>
              <p className="font-semibold text-yellow-800">{stats.pending} application{stats.pending > 1 ? 's' : ''} awaiting review</p>
              <p className="text-yellow-600 text-sm">Please review and take action</p>
            </div>
          </div>
          <Link to="/admin/applications?status=Pending" className="px-4 py-2 bg-yellow-500 text-white rounded-xl text-sm font-semibold hover:bg-yellow-600 transition">
            Review Now
          </Link>
        </div>
      )}

      {/* Recent Applications */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b bg-gray-50">
          <h2 className="text-lg font-bold text-gray-800">Recent Applications</h2>
          <Link to="/admin/applications" className="text-blue-600 text-sm font-medium hover:underline">View All →</Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div></div>
        ) : recent.length === 0 ? (
          <div className="text-center py-12"><p className="text-gray-400">No applications yet</p></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                <tr>
                  <th className="px-4 py-3 text-left">Pass ID</th>
                  <th className="px-4 py-3 text-left">Applicant</th>
                  <th className="px-4 py-3 text-left hidden sm:table-cell">Route</th>
                  <th className="px-4 py-3 text-left hidden md:table-cell">Date</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recent.map(pass => (
                  <tr key={pass._id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3 font-mono text-blue-700 text-xs font-bold">{pass.passId}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-800">{pass.applicant?.name}</p>
                      <p className="text-gray-400 text-xs">{pass.applicant?.email}</p>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell text-gray-600">{pass.source} → {pass.destination}</td>
                    <td className="px-4 py-3 hidden md:table-cell text-gray-500">{new Date(pass.travelDate).toLocaleDateString('en-IN')}</td>
                    <td className="px-4 py-3"><StatusBadge status={pass.status} /></td>
                    <td className="px-4 py-3">
                      <Link to={`/admin/applications`} className="text-blue-600 hover:underline text-xs font-medium">Review</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        <Link to="/admin/applications?status=Pending" className="bg-yellow-500 text-white rounded-2xl p-5 flex items-center gap-3 hover:bg-yellow-600 transition shadow-md">
          <span className="text-2xl">⏳</span>
          <div><p className="font-semibold">Pending Review</p><p className="text-yellow-100 text-xs">{stats.pending} applications</p></div>
        </Link>
        <Link to="/admin/applications?status=Approved" className="bg-green-600 text-white rounded-2xl p-5 flex items-center gap-3 hover:bg-green-700 transition shadow-md">
          <span className="text-2xl">✅</span>
          <div><p className="font-semibold">Approved Passes</p><p className="text-green-100 text-xs">{stats.approved} total</p></div>
        </Link>
        <Link to="/admin/applications" className="bg-white text-gray-800 rounded-2xl p-5 flex items-center gap-3 hover:bg-gray-50 transition shadow-md border">
          <span className="text-2xl">📊</span>
          <div><p className="font-semibold">All Applications</p><p className="text-gray-500 text-xs">{stats.total} total</p></div>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
