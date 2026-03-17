import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const StatusBadge = ({ status }) => {
  const styles = { Pending: 'bg-yellow-100 text-yellow-700', Approved: 'bg-green-100 text-green-700', Rejected: 'bg-red-100 text-red-700' };
  const icons = { Pending: '⏳', Approved: '✅', Rejected: '❌' };
  return <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${styles[status]}`}>{icons[status]} {status}</span>;
};

const ReviewModal = ({ pass, onClose, onReview }) => {
  const [status, setStatus] = useState('');
  const [remarks, setRemarks] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!status) { toast.error('Select a decision'); return; }
    if (status === 'Rejected' && !remarks.trim()) { toast.error('Please provide rejection reason'); return; }
    setLoading(true);
    await onReview(pass._id, status, remarks);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-[slideUp_0.3s_ease]">
        <div className="bg-gray-800 text-white px-6 py-4 flex justify-between items-center">
          <h3 className="font-bold text-lg">Review Application</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl">✕</button>
        </div>

        <div className="p-6 space-y-4">
          {/* Pass Summary */}
          <div className="bg-blue-50 rounded-2xl p-4 text-sm">
            <div className="grid grid-cols-2 gap-2">
              <div><span className="text-blue-600">Pass ID:</span> <span className="font-mono font-bold">{pass.passId}</span></div>
              <div><span className="text-blue-600">Applicant:</span> <span className="font-medium">{pass.applicant?.name}</span></div>
              <div><span className="text-blue-600">Route:</span> <span className="font-medium">{pass.source} → {pass.destination}</span></div>
              <div><span className="text-blue-600">Purpose:</span> <span className="font-medium">{pass.purposeOfTravel}</span></div>
              <div><span className="text-blue-600">Date:</span> <span className="font-medium">{new Date(pass.travelDate).toLocaleDateString('en-IN')}</span></div>
              <div><span className="text-blue-600">Persons:</span> <span className="font-medium">{pass.numberOfPersons}</span></div>
            </div>
          </div>

          {/* Decision */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Decision <span className="text-red-500">*</span></label>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setStatus('Approved')}
                className={`py-3 rounded-xl font-semibold border-2 transition ${status === 'Approved' ? 'bg-green-600 text-white border-green-600' : 'border-green-200 text-green-700 hover:bg-green-50'}`}>
                ✅ Approve
              </button>
              <button onClick={() => setStatus('Rejected')}
                className={`py-3 rounded-xl font-semibold border-2 transition ${status === 'Rejected' ? 'bg-red-600 text-white border-red-600' : 'border-red-200 text-red-700 hover:bg-red-50'}`}>
                ❌ Reject
              </button>
            </div>
          </div>

          {/* Remarks */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Admin Remarks {status === 'Rejected' && <span className="text-red-500">*</span>}
            </label>
            <textarea value={remarks} onChange={(e) => setRemarks(e.target.value)}
              placeholder={status === 'Rejected' ? 'Provide reason for rejection...' : 'Optional remarks...'}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm" />
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={onClose} className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition">Cancel</button>
            <button onClick={handleSubmit} disabled={loading || !status}
              className={`flex-1 py-3 rounded-xl font-semibold text-white transition shadow-md disabled:opacity-50 ${status === 'Approved' ? 'bg-green-600 hover:bg-green-700' : status === 'Rejected' ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-400'}`}>
              {loading ? 'Processing...' : `Confirm ${status || 'Decision'}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminApplications = () => {
  const { API } = useAuth();
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const [passes, setPasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(urlParams.get('status') || 'All');
  const [selectedPass, setSelectedPass] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchPasses = async () => {
    setLoading(true);
    try {
      const statusParam = filter !== 'All' ? `&status=${filter}` : '';
      const res = await API.get(`/admin/applications?page=${currentPage}&limit=10${statusParam}`);
      setPasses(res.data.passes || []);
      setTotalPages(res.data.pages || 1);
    } catch (err) {
      toast.error('Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPasses(); }, [filter, currentPage]);

  const handleReview = async (passId, status, remarks) => {
    try {
      const res = await API.put(`/admin/applications/${passId}/review`, { status, adminRemarks: remarks });
      if (res.data.success) {
        toast.success(`Application ${status} successfully!`);
        setSelectedPass(null);
        fetchPasses();
      }
    } catch (err) {
      toast.error('Review failed. Try again.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {selectedPass && <ReviewModal pass={selectedPass} onClose={() => setSelectedPass(null)} onReview={handleReview} />}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">All Applications</h1>
          <p className="text-gray-500 text-sm mt-1">Review and manage e-pass applications</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {['All', 'Pending', 'Approved', 'Rejected'].map(tab => (
          <button key={tab} onClick={() => { setFilter(tab); setCurrentPage(1); }}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition border ${filter === tab ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'}`}>
            {tab === 'Pending' ? '⏳' : tab === 'Approved' ? '✅' : tab === 'Rejected' ? '❌' : '📋'} {tab}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>
      ) : passes.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl shadow-md">
          <div className="text-6xl mb-4">📭</div>
          <p className="text-xl font-semibold text-gray-700">No {filter !== 'All' ? filter.toLowerCase() : ''} applications</p>
        </div>
      ) : (
        <>
          {/* Mobile Cards */}
          <div className="sm:hidden space-y-4">
            {passes.map(pass => (
              <div key={pass._id} className="bg-white rounded-2xl shadow-md p-4 border border-gray-100">
                <div className="flex justify-between items-start mb-3">
                  <span className="font-mono text-blue-700 font-bold text-sm">{pass.passId}</span>
                  <StatusBadge status={pass.status} />
                </div>
                <p className="font-semibold text-gray-800">{pass.applicant?.name}</p>
                <p className="text-gray-500 text-sm">{pass.source} → {pass.destination}</p>
                <p className="text-gray-400 text-xs mb-3">{pass.purposeOfTravel} · {new Date(pass.travelDate).toLocaleDateString('en-IN')}</p>
                {pass.status === 'Pending' && (
                  <button onClick={() => setSelectedPass(pass)} className="w-full py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition">
                    Review Application
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Desktop Table */}
          <div className="hidden sm:block bg-white rounded-2xl shadow-md overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                <tr>
                  <th className="px-4 py-3 text-left">Pass ID</th>
                  <th className="px-4 py-3 text-left">Applicant</th>
                  <th className="px-4 py-3 text-left">Route</th>
                  <th className="px-4 py-3 text-left">Purpose</th>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {passes.map(pass => (
                  <tr key={pass._id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-4 font-mono text-blue-700 text-xs font-bold">{pass.passId}</td>
                    <td className="px-4 py-4">
                      <p className="font-medium text-gray-800">{pass.applicant?.name}</p>
                      <p className="text-gray-400 text-xs">{pass.applicant?.mobile}</p>
                    </td>
                    <td className="px-4 py-4 text-gray-600">{pass.source} → {pass.destination}</td>
                    <td className="px-4 py-4 text-gray-500">{pass.purposeOfTravel}</td>
                    <td className="px-4 py-4 text-gray-500">{new Date(pass.travelDate).toLocaleDateString('en-IN')}</td>
                    <td className="px-4 py-4"><StatusBadge status={pass.status} /></td>
                    <td className="px-4 py-4">
                      {pass.status === 'Pending' ? (
                        <button onClick={() => setSelectedPass(pass)} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition">
                          Review
                        </button>
                      ) : (
                        <span className="text-gray-400 text-xs">Reviewed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setCurrentPage(p)}
                  className={`w-10 h-10 rounded-xl text-sm font-medium transition ${currentPage === p ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border hover:border-blue-300'}`}>
                  {p}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminApplications;
