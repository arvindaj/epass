import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const InputField = ({ label, type = 'text', name, value, onChange, required, min, children }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label} {required && <span className="text-red-500">*</span>}</label>
    {children || (
      <input type={type} name={name} value={value} onChange={onChange} min={min}
        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        required={required} />
    )}
  </div>
);

const ApplyPass = () => {
  const { API } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    purposeOfTravel: '', travelDate: '', returnDate: '',
    source: '', destination: '', hasVehicle: false,
    vehicleType: '', vehicleNumber: '', numberOfPersons: 1
  });

  const today = new Date().toISOString().split('T')[0];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.purposeOfTravel || !form.travelDate || !form.source || !form.destination) {
      toast.error('Please fill all required fields');
      return;
    }
    if (form.hasVehicle && !form.vehicleType) {
      toast.error('Please select vehicle type');
      return;
    }
    setLoading(true);
    try {
      const res = await API.post('/epass/apply', form);
      if (res.data.success) {
        toast.success('E-Pass application submitted! 🎉');
        navigate('/my-passes');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Apply for E-Pass</h1>
        <p className="text-gray-500 mt-1">Fill the form carefully. All starred fields are mandatory.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Purpose */}
        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2"><span>🎯</span> Purpose of Travel</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Purpose <span className="text-red-500">*</span></label>
            <select name="purposeOfTravel" value={form.purposeOfTravel} onChange={handleChange} required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
              <option value="">-- Select Purpose --</option>
              {['Medical', 'Essential Services', 'Work', 'Emergency', 'Education', 'Other'].map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Travel Details */}
        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2"><span>📍</span> Travel Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField label="From (Source)" name="source" value={form.source} onChange={handleChange} required>
              <input type="text" name="source" value={form.source} onChange={handleChange} placeholder="e.g. Chennai" required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </InputField>
            <InputField label="To (Destination)" name="destination" value={form.destination} onChange={handleChange} required>
              <input type="text" name="destination" value={form.destination} onChange={handleChange} placeholder="e.g. Bangalore" required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </InputField>
            <InputField label="Travel Date" type="date" name="travelDate" value={form.travelDate} onChange={handleChange} min={today} required>
              <input type="date" name="travelDate" value={form.travelDate} onChange={handleChange} min={today} required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </InputField>
            <InputField label="Return Date (optional)" type="date" name="returnDate" value={form.returnDate} onChange={handleChange} min={form.travelDate || today}>
              <input type="date" name="returnDate" value={form.returnDate} onChange={handleChange} min={form.travelDate || today}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </InputField>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Number of Persons <span className="text-red-500">*</span></label>
              <input type="number" name="numberOfPersons" value={form.numberOfPersons} onChange={handleChange} min="1" max="10" required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
        </div>

        {/* Vehicle Details */}
        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2"><span>🚗</span> Vehicle Information</h2>
          <label className="flex items-center gap-3 cursor-pointer mb-4">
            <input type="checkbox" name="hasVehicle" checked={form.hasVehicle} onChange={handleChange}
              className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
            <span className="text-sm font-medium text-gray-700">I will be travelling with a vehicle</span>
          </label>

          {form.hasVehicle && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2 pt-4 border-t border-gray-100">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type <span className="text-red-500">*</span></label>
                <div className="grid grid-cols-3 gap-2">
                  {['Two-Wheeler', 'Four-Wheeler', 'Auto', 'Truck', 'Bus'].map(v => (
                    <label key={v} className={`flex items-center justify-center p-2 border-2 rounded-lg cursor-pointer text-xs font-medium transition ${form.vehicleType === v ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-300'}`}>
                      <input type="radio" name="vehicleType" value={v} checked={form.vehicleType === v} onChange={handleChange} className="sr-only" />
                      {v === 'Two-Wheeler' ? '🏍️' : v === 'Four-Wheeler' ? '🚗' : v === 'Auto' ? '🛺' : v === 'Truck' ? '🚚' : '🚌'} {v}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Number</label>
                <input type="text" name="vehicleNumber" value={form.vehicleNumber} onChange={handleChange}
                  placeholder="e.g. TN01AB1234"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase" />
              </div>
            </div>
          )}
        </div>

        {/* Preview */}
        {form.source && form.destination && form.travelDate && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-blue-800 mb-3">📋 Application Summary</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div><span className="text-blue-600">Purpose:</span> <span className="font-medium">{form.purposeOfTravel}</span></div>
              <div><span className="text-blue-600">Route:</span> <span className="font-medium">{form.source} → {form.destination}</span></div>
              <div><span className="text-blue-600">Date:</span> <span className="font-medium">{new Date(form.travelDate).toLocaleDateString('en-IN')}</span></div>
              <div><span className="text-blue-600">Persons:</span> <span className="font-medium">{form.numberOfPersons}</span></div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <button type="button" onClick={() => navigate('/dashboard')} className="flex-1 py-3.5 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="flex-1 py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-xl font-semibold transition shadow-md">
            {loading ? 'Submitting...' : '✓ Submit Application'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ApplyPass;
