import React from 'react';
import { Link } from 'react-router-dom';

const FeatureCard = ({ icon, title, desc }) => (
  <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow border border-gray-100">
    <div className="text-4xl mb-3">{icon}</div>
    <h3 className="font-semibold text-gray-800 text-lg mb-2">{title}</h3>
    <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
  </div>
);

const StepCard = ({ step, title, desc }) => (
  <div className="flex gap-4 items-start">
    <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">{step}</div>
    <div>
      <h4 className="font-semibold text-gray-800 mb-1">{title}</h4>
      <p className="text-gray-500 text-sm">{desc}</p>
    </div>
  </div>
);

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block bg-blue-500 bg-opacity-40 text-blue-100 text-sm font-medium px-4 py-1.5 rounded-full mb-6">🛡️ Official E-Pass Management Portal</div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">
            Online E-Pass<br />Management System
          </h1>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Apply for travel e-passes quickly and securely. Get instant digital approvals with QR-based verification — anytime, anywhere.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="px-8 py-3.5 bg-white text-blue-700 rounded-xl font-semibold text-lg hover:bg-blue-50 transition shadow-lg">
              Get Started Free
            </Link>
            <Link to="/login" className="px-8 py-3.5 bg-blue-500 bg-opacity-40 text-white border border-blue-400 rounded-xl font-semibold text-lg hover:bg-opacity-60 transition">
              Login →
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white py-8 border-b">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[['10,000+', 'Passes Issued'], ['99%', 'Approval Rate'], ['24/7', 'Online Access'], ['< 1 hr', 'Avg. Processing']].map(([val, label]) => (
            <div key={label}>
              <div className="text-2xl font-bold text-blue-700">{val}</div>
              <div className="text-gray-500 text-sm mt-1">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-3">Why Use Our System?</h2>
        <p className="text-center text-gray-500 mb-10">Fast, secure, and completely paperless</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard icon="⚡" title="Instant Application" desc="Fill your form online in minutes. No paperwork, no queues." />
          <FeatureCard icon="📱" title="Mobile Friendly" desc="Apply and track your pass from any device, anywhere." />
          <FeatureCard icon="🔐" title="Secure QR Code" desc="Each approved pass comes with a tamper-proof QR code for verification." />
          <FeatureCard icon="📄" title="Downloadable PDF" desc="Download your pass as a PDF and carry it digitally or print it." />
          <FeatureCard icon="🔔" title="Real-time Alerts" desc="Get SMS and email notifications on every status update." />
          <FeatureCard icon="👨‍💼" title="Admin Dashboard" desc="Efficient admin tools to review, approve, or reject applications fast." />
        </div>
      </div>

      {/* How it works */}
      <div className="bg-blue-50 py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">How It Works</h2>
          <div className="space-y-8">
            <StepCard step="1" title="Create an Account" desc="Register with your name, email, and mobile number. Verify your identity via OTP." />
            <StepCard step="2" title="Apply for E-Pass" desc="Fill the travel details form — source, destination, date, purpose, and vehicle info." />
            <StepCard step="3" title="Admin Review" desc="Your application is reviewed by the admin and updated within hours." />
            <StepCard step="4" title="Download Your Pass" desc="Once approved, download your QR-coded PDF e-pass and travel freely." />
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-blue-700 text-white py-14 px-4 text-center">
        <h2 className="text-3xl font-bold mb-3">Ready to Apply?</h2>
        <p className="text-blue-200 mb-8">Register now and get your e-pass in minutes.</p>
        <Link to="/register" className="px-10 py-4 bg-white text-blue-700 rounded-xl font-bold text-lg hover:bg-blue-50 transition shadow-xl inline-block">
          Apply Now →
        </Link>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-400 text-center py-6 text-sm">
        <p>© 2024 E-Pass Management System. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
