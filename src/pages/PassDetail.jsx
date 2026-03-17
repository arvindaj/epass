import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const StatusBadge = ({ status }) => {
  const styles = { Pending: 'bg-yellow-100 text-yellow-700', Approved: 'bg-green-100 text-green-700', Rejected: 'bg-red-100 text-red-700' };
  const icons = { Pending: '⏳', Approved: '✅', Rejected: '❌' };
  return <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-base ${styles[status]}`}>{icons[status]} {status}</span>;
};

const InfoRow = ({ label, value }) => (
  <div className="flex flex-col sm:flex-row sm:items-center py-3 border-b border-gray-100 last:border-0">
    <span className="text-gray-500 text-sm w-40 flex-shrink-0">{label}</span>
    <span className="text-gray-800 font-medium mt-0.5 sm:mt-0">{value || '—'}</span>
  </div>
);

const PassDetail = () => {
  const { id } = useParams();
  const { API } = useAuth();
  const [pass, setPass] = useState(null);
  const [loading, setLoading] = useState(true);
  const printRef = useRef();

  useEffect(() => {
    const fetchPass = async () => {
      try {
        const res = await API.get(`/epass/${id}`);
        setPass(res.data.epass);
      } catch (err) {
        toast.error('Failed to load pass details');
      } finally {
        setLoading(false);
      }
    };
    fetchPass();
  }, [id, API]);

  const handlePrint = () => {
    window.print();
    toast.success('Print dialog opened!');
  };

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  if (!pass) return <div className="text-center py-20"><p className="text-xl text-gray-500">Pass not found</p><Link to="/my-passes" className="text-blue-600">Go Back</Link></div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/my-passes" className="text-blue-600 hover:underline text-sm">← My Passes</Link>
        <span className="text-gray-300">/</span>
        <span className="text-gray-500 text-sm">{pass.passId}</span>
      </div>

      {/* E-Pass Card */}
      <div ref={printRef} className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-200 print:shadow-none">
        {/* Header */}
        <div className={`p-6 text-white ${pass.status === 'Approved' ? 'bg-gradient-to-r from-green-600 to-emerald-600' : pass.status === 'Rejected' ? 'bg-gradient-to-r from-red-600 to-rose-600' : 'bg-gradient-to-r from-blue-600 to-indigo-600'}`}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-white/70 text-sm font-medium">E-Pass ID</p>
              <h1 className="text-2xl sm:text-3xl font-black tracking-wide">{pass.passId}</h1>
              <p className="text-white/80 text-sm mt-1">Applied: {new Date(pass.appliedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
            <div className="flex flex-col items-start sm:items-end gap-2">
              <StatusBadge status={pass.status} />
              {pass.status === 'Approved' && (
                <div className="text-green-100 text-xs">
                  Valid: {new Date(pass.validFrom).toLocaleDateString('en-IN')} — {new Date(pass.validTill).toLocaleDateString('en-IN')}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Rejection Remark */}
          {pass.status === 'Rejected' && pass.adminRemarks && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
              <p className="text-red-700 font-semibold text-sm mb-1">❗ Reason for Rejection</p>
              <p className="text-red-600 text-sm">{pass.adminRemarks}</p>
            </div>
          )}

          {/* Applicant */}
          <div>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Applicant Details</h2>
            <InfoRow label="Full Name" value={pass.applicant?.name} />
            <InfoRow label="Email" value={pass.applicant?.email} />
            <InfoRow label="Mobile" value={pass.applicant?.mobile} />
            <InfoRow label="Address" value={pass.applicant?.address} />
          </div>

          {/* Travel */}
          <div>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Travel Details</h2>
            <InfoRow label="Purpose" value={pass.purposeOfTravel} />
            <InfoRow label="From" value={pass.source} />
            <InfoRow label="To" value={pass.destination} />
            <InfoRow label="Travel Date" value={new Date(pass.travelDate).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} />
            {pass.returnDate && <InfoRow label="Return Date" value={new Date(pass.returnDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} />}
            <InfoRow label="No. of Persons" value={pass.numberOfPersons} />
          </div>

          {/* Vehicle */}
          {pass.hasVehicle && (
            <div>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Vehicle Details</h2>
              <InfoRow label="Vehicle Type" value={pass.vehicleType} />
              <InfoRow label="Vehicle Number" value={pass.vehicleNumber} />
            </div>
          )}

          {/* QR Code */}
          {pass.status === 'Approved' && pass.qrCode && (
            <div className="border-2 border-dashed border-green-300 rounded-2xl p-6 text-center">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">🔐 Secure QR Code</h2>
              <img src={pass.qrCode} alt="QR Code" className="mx-auto w-40 h-40 sm:w-48 sm:h-48" />
              <p className="text-green-700 text-xs mt-3 font-medium">Scan for instant verification</p>
            </div>
          )}

          {/* Pending notice */}
          {pass.status === 'Pending' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5 text-center">
              <div className="text-3xl mb-2">⏳</div>
              <p className="text-yellow-800 font-semibold">Application Under Review</p>
              <p className="text-yellow-600 text-sm mt-1">Your application is being processed by the admin. You will be notified once reviewed.</p>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 mt-6">
        <Link to="/my-passes" className="flex-1 py-3.5 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition text-center">
          ← Back to My Passes
        </Link>
        {pass.status === 'Approved' && (
          <button onClick={handlePrint} className="flex-1 py-3.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition shadow-md">
            📄 Download / Print Pass
          </button>
        )}
        {pass.status === 'Rejected' && (
          <Link to="/apply" className="flex-1 py-3.5 bg-blue-600 text-white rounded-xl font-semibold text-center hover:bg-blue-700 transition shadow-md">
            🔄 Apply Again
          </Link>
        )}
      </div>
    </div>
  );
};

export default PassDetail;
