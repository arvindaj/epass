import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const InputField = ({ label, type = 'text', name, value, onChange, placeholder, required, error }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type} name={name} value={value} onChange={onChange}
      placeholder={placeholder}
      className={`w-full px-4 py-3 border rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${error ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'}`}
      required={required}
    />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

const Register = () => {
  const { register, verifyOTP } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: form, 2: OTP
  const [userId, setUserId] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    name: '', email: '', mobile: '', address: '', password: '', confirmPassword: ''
  });

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email';
    if (!form.mobile) errs.mobile = 'Mobile is required';
    else if (!/^[6-9]\d{9}$/.test(form.mobile)) errs.mobile = 'Enter a valid 10-digit mobile number';
    if (!form.address.trim()) errs.address = 'Address is required';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'Minimum 6 characters';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    return errs;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);
    try {
      const res = await register({ name: form.name, email: form.email, mobile: form.mobile, address: form.address, password: form.password });
      if (res.success) {
        setUserId(res.userId);
        setStep(2);
        toast.success('OTP sent! Check your email.');
        // Demo: show OTP in toast
        if (res.otp) toast(`Demo OTP: ${res.otp}`, { duration: 30000, icon: '🔑' });
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleOTPVerify = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) { toast.error('Enter 6-digit OTP'); return; }
    setLoading(true);
    try {
      const res = await verifyOTP(userId, otp);
      if (res.success) {
        toast.success('Account verified! Welcome aboard 🎉');
        navigate('/dashboard');
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-700 text-white rounded-2xl text-2xl font-black mb-3 shadow-lg">EP</div>
          <h1 className="text-2xl font-bold text-gray-800">Create Account</h1>
          <p className="text-gray-500 text-sm mt-1">Register for E-Pass Management System</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Progress */}
          <div className="flex">
            <div className={`flex-1 h-1.5 ${step >= 1 ? 'bg-blue-600' : 'bg-gray-200'} transition-all`}></div>
            <div className={`flex-1 h-1.5 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'} transition-all`}></div>
          </div>

          <div className="p-6 sm:p-8">
            {step === 1 ? (
              <>
                <div className="flex justify-between text-sm mb-6">
                  <span className="text-blue-600 font-semibold">Step 1: Personal Details</span>
                  <span className="text-gray-400">Step 2: Verify OTP</span>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <InputField label="Full Name" name="name" value={form.name} onChange={handleChange} placeholder="John Doe" required error={errors.name} />
                  <InputField label="Email Address" type="email" name="email" value={form.email} onChange={handleChange} placeholder="john@example.com" required error={errors.email} />
                  <InputField label="Mobile Number" type="tel" name="mobile" value={form.mobile} onChange={handleChange} placeholder="9876543210" required error={errors.mobile} />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address <span className="text-red-500">*</span></label>
                    <textarea
                      name="address" value={form.address} onChange={handleChange}
                      placeholder="Enter your full address"
                      rows={2}
                      className={`w-full px-4 py-3 border rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none ${errors.address ? 'border-red-400' : 'border-gray-300'}`}
                    />
                    {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                  </div>
                  <InputField label="Password" type="password" name="password" value={form.password} onChange={handleChange} placeholder="Min. 6 characters" required error={errors.password} />
                  <InputField label="Confirm Password" type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="Re-enter password" required error={errors.confirmPassword} />

                  <button type="submit" disabled={loading} className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-xl font-semibold text-base transition shadow-md mt-2">
                    {loading ? 'Sending OTP...' : 'Send OTP & Continue →'}
                  </button>
                </form>
              </>
            ) : (
              <>
                <div className="text-center mb-6">
                  <div className="text-5xl mb-3">📧</div>
                  <h2 className="text-xl font-bold text-gray-800">Verify Your Email</h2>
                  <p className="text-gray-500 text-sm mt-1">Enter the 6-digit OTP sent to <span className="font-medium text-blue-600">{form.email}</span></p>
                </div>
                <form onSubmit={handleOTPVerify} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Enter OTP <span className="text-red-500">*</span></label>
                    <input
                      type="text" maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      placeholder="000000"
                      className="w-full px-4 py-4 border border-gray-300 rounded-xl text-center text-2xl font-bold tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button type="submit" disabled={loading || otp.length !== 6} className="w-full py-3.5 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white rounded-xl font-semibold text-base transition shadow-md">
                    {loading ? 'Verifying...' : '✓ Verify & Create Account'}
                  </button>
                  <button type="button" onClick={() => setStep(1)} className="w-full py-2 text-gray-500 hover:text-gray-700 text-sm transition">
                    ← Go Back
                  </button>
                </form>
              </>
            )}

            <div className="mt-6 text-center text-sm text-gray-500">
              Already have an account? <Link to="/login" className="text-blue-600 font-semibold hover:underline">Login here</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
