import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const StatusBadge = ({ status }) => {
  const styles = {
    Pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    Approved: 'bg-green-100 text-green-700 border-green-200',
    Rejected: 'bg-red-100 text-red-700 border-red-200'
  };
  const icons = { Pending: '⏳', Approved: '✅', Rejected: '❌' };
  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${styles[status]}`}>
      {icons[status]} {status}
    </span>
  );
};

const MyPasses = () => {
  const { API } = useAuth();
  const [passes, setPasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

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

  const filtered = filter === 'All' ? passes : passes.filter(p => p.status === filter);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">My E-Passes</h1>
          <p className="text-gray-500 text-sm mt-1">{passes.length} application{passes.length !== 1 ? 's' : ''} total</p>
        </div>
        <Link to="/apply" className="self-start sm:self-center px-5 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition text-sm shadow-md">
          + New Application
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {['All', 'Pending', 'Approved', 'Rejected'].map(tab => (
          <button key={tab} onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition border ${filter === tab ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'}`}>
            {tab} ({tab === 'All' ? passes.length : passes.filter(p => p.status === tab).length})
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl shadow-md">
          <div className="text-6xl mb-4">📭</div>
          <p className="text-xl font-semibold text-gray-700">No {filter !== 'All' ? filter.toLowerCase() : ''} applications</p>
          <p className="text-gray-400 mt-2 mb-6">Your applications will appear here</p>
          <Link to="/apply" className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition">Apply Now</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(pass => (
            <Link to={`/pass/${pass._id}`} key={pass._id}
              className="block bg-white rounded-2xl shadow-md hover:shadow-lg transition p-5 border border-gray-100 hover:border-blue-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <span className="font-mono font-bold text-blue-700 text-sm bg-blue-50 px-3 py-1 rounded-lg">{pass.passId}</span>
                    <StatusBadge status={pass.status} />
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-lg">{pass.purposeOfTravel}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700 font-semibold text-base mb-1">
                    <span>{pass.source}</span>
                    <span className="text-blue-400 text-lg">→</span>
                    <span>{pass.destination}</span>
                  </div>
                  <div className="flex gap-4 text-sm text-gray-400 flex-wrap">
                    <span>📅 {new Date(pass.travelDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    <span>👥 {pass.numberOfPersons} person{pass.numberOfPersons > 1 ? 's' : ''}</span>
                    {pass.hasVehicle && <span>🚗 {pass.vehicleType}</span>}
                  </div>
                  {pass.status === 'Rejected' && pass.adminRemarks && (
                    <div className="mt-2 text-xs text-red-600 bg-red-50 px-3 py-1.5 rounded-lg">
                      ❗ Remark: {pass.adminRemarks}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 text-blue-500 text-sm font-medium">
                  {pass.status === 'Approved' && <span className="text-green-600">Download PDF</span>}
                  <span>View →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPasses;
