import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

/* ---------------- STATUS BADGE ---------------- */
const StatusBadge = ({ status }) => {
  const styles = {
    Pending: 'bg-yellow-100 text-yellow-700',
    Approved: 'bg-green-100 text-green-700',
    Rejected: 'bg-red-100 text-red-700'
  };

  const icons = {
    Pending: '⏳',
    Approved: '✅',
    Rejected: '❌'
  };

  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${styles[status]}`}>
      {icons[status]} {status}
    </span>
  );
};

/* ---------------- REVIEW MODAL ---------------- */
const ReviewModal = ({ pass, onClose, onReview }) => {
  const [status, setStatus] = useState('');
  const [remarks, setRemarks] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!status) {
      toast.error('Select a decision');
      return;
    }

    if (status === 'Rejected' && !remarks.trim()) {
      toast.error('Please provide rejection reason');
      return;
    }

    setLoading(true);
    await onReview(pass._id, status, remarks);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">
        <div className="bg-gray-800 text-white px-6 py-4 flex justify-between items-center">
          <h3 className="font-bold text-lg">Review Application</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl">✕</button>
        </div>

        <div className="p-6 space-y-4">
          {/* Summary */}
          <div className="bg-blue-50 rounded-2xl p-4 text-sm">
            <div className="grid grid-cols-2 gap-2">
              <div><span className="text-blue-600">Pass ID:</span> {pass.passId}</div>
              <div><span className="text-blue-600">Applicant:</span> {pass.applicant?.name}</div>
              <div><span className="text-blue-600">Route:</span> {pass.source} → {pass.destination}</div>
              <div><span className="text-blue-600">Purpose:</span> {pass.purposeOfTravel}</div>
              <div><span className="text-blue-600">Date:</span> {new Date(pass.travelDate).toLocaleDateString('en-IN')}</div>
              <div><span className="text-blue-600">Persons:</span> {pass.numberOfPersons}</div>
            </div>
          </div>

          {/* Decision */}
          <div>
            <label className="block text-sm font-semibold mb-2">Decision *</label>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setStatus('Approved')}
                className={`py-3 rounded-xl border-2 ${status === 'Approved' ? 'bg-green-600 text-white' : ''}`}>
                ✅ Approve
              </button>
              <button onClick={() => setStatus('Rejected')}
                className={`py-3 rounded-xl border-2 ${status === 'Rejected' ? 'bg-red-600 text-white' : ''}`}>
                ❌ Reject
              </button>
            </div>
          </div>

          {/* Remarks */}
          <textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Remarks..."
            className="w-full border rounded-xl p-3"
          />

          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 border py-3 rounded-xl">Cancel</button>
            <button onClick={handleSubmit} disabled={loading}
              className="flex-1 bg-blue-600 text-white py-3 rounded-xl">
              {loading ? 'Processing...' : 'Submit'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------------- MAIN COMPONENT ---------------- */
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

  /* -------- FETCH DATA -------- */
  const fetchPasses = useCallback(async () => {
    setLoading(true);
    try {
      const statusParam = filter !== 'All' ? `&status=${filter}` : '';

      const res = await API.get(
        `/admin/applications?page=${currentPage}&limit=10${statusParam}`
      );

      setPasses(res.data.passes || []);
      setTotalPages(res.data.pages || 1);

    } catch (err) {
      toast.error('Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  }, [filter, currentPage, API]);

  /* -------- REVIEW -------- */
  const handleReview = useCallback(async (passId, status, remarks) => {
    try {
      const res = await API.put(
        `/admin/applications/${passId}/review`,
        { status, adminRemarks: remarks }
      );

      if (res.data.success) {
        toast.success(`Application ${status} successfully!`);
        setSelectedPass(null);
        fetchPasses();
      }
    } catch {
      toast.error('Review failed');
    }
  }, [API, fetchPasses]);

  useEffect(() => {
    fetchPasses();
  }, [fetchPasses]);

  /* ---------------- UI ---------------- */
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">

      {selectedPass && (
        <ReviewModal
          pass={selectedPass}
          onClose={() => setSelectedPass(null)}
          onReview={handleReview}
        />
      )}

      <h1 className="text-2xl font-bold mb-4">All Applications</h1>

      {/* Filter */}
      <div className="flex gap-2 mb-6">
        {['All', 'Pending', 'Approved', 'Rejected'].map(tab => (
          <button
            key={tab}
            onClick={() => {
              setFilter(tab);
              setCurrentPage(1);
            }}
            className={`px-4 py-2 rounded-xl ${
              filter === tab ? 'bg-blue-600 text-white' : 'border'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <p>Loading...</p>
      ) : passes.length === 0 ? (
        <p>No applications found</p>
      ) : (
        <div className="space-y-4">
          {passes.map(pass => (
            <div key={pass._id} className="p-4 border rounded-xl">
              <div className="flex justify-between">
                <span>{pass.passId}</span>
                <StatusBadge status={pass.status} />
              </div>

              <p>{pass.applicant?.name}</p>

              {pass.status === 'Pending' && (
                <button
                  onClick={() => setSelectedPass(pass)}
                  className="mt-2 bg-blue-600 text-white px-3 py-2 rounded"
                >
                  Review
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex gap-2 mt-6">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              onClick={() => setCurrentPage(p)}
              className={`px-3 py-2 border rounded ${
                currentPage === p ? 'bg-blue-600 text-white' : ''
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminApplications;