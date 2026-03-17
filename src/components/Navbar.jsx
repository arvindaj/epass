import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-blue-700 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2" onClick={() => setMenuOpen(false)}>
            <div className="bg-white text-blue-700 rounded-lg p-1.5 font-black text-sm">EP</div>
            <span className="font-bold text-lg tracking-wide hidden sm:block">E-Pass System</span>
            <span className="font-bold text-base tracking-wide sm:hidden">E-Pass</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {!user ? (
              <>
                <Link to="/" className={`px-3 py-2 rounded-md text-sm font-medium transition ${isActive('/') ? 'bg-blue-800' : 'hover:bg-blue-600'}`}>Home</Link>
                <Link to="/login" className={`px-3 py-2 rounded-md text-sm font-medium transition ${isActive('/login') ? 'bg-blue-800' : 'hover:bg-blue-600'}`}>Login</Link>
                <Link to="/register" className="ml-2 px-4 py-2 bg-white text-blue-700 rounded-lg text-sm font-semibold hover:bg-blue-50 transition">Register</Link>
              </>
            ) : (
              <>
                {user.role === 'admin' ? (
                  <>
                    <Link to="/admin" className={`px-3 py-2 rounded-md text-sm font-medium transition ${isActive('/admin') ? 'bg-blue-800' : 'hover:bg-blue-600'}`}>Dashboard</Link>
                    <Link to="/admin/applications" className={`px-3 py-2 rounded-md text-sm font-medium transition ${isActive('/admin/applications') ? 'bg-blue-800' : 'hover:bg-blue-600'}`}>Applications</Link>
                  </>
                ) : (
                  <>
                    <Link to="/dashboard" className={`px-3 py-2 rounded-md text-sm font-medium transition ${isActive('/dashboard') ? 'bg-blue-800' : 'hover:bg-blue-600'}`}>Dashboard</Link>
                    <Link to="/apply" className={`px-3 py-2 rounded-md text-sm font-medium transition ${isActive('/apply') ? 'bg-blue-800' : 'hover:bg-blue-600'}`}>Apply Pass</Link>
                    <Link to="/my-passes" className={`px-3 py-2 rounded-md text-sm font-medium transition ${isActive('/my-passes') ? 'bg-blue-800' : 'hover:bg-blue-600'}`}>My Passes</Link>
                  </>
                )}
                <div className="ml-3 flex items-center gap-2">
                  <span className="text-blue-200 text-sm">Hi, {user.name.split(' ')[0]}</span>
                  <button onClick={handleLogout} className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition">Logout</button>
                </div>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button className="md:hidden p-2 rounded-md hover:bg-blue-600 transition" onClick={() => setMenuOpen(!menuOpen)}>
            <div className="space-y-1.5">
              <span className={`block h-0.5 w-6 bg-white transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
              <span className={`block h-0.5 w-6 bg-white transition-all ${menuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`block h-0.5 w-6 bg-white transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-blue-800 px-4 pt-2 pb-4 space-y-1">
          {!user ? (
            <>
              <Link to="/" className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700" onClick={() => setMenuOpen(false)}>Home</Link>
              <Link to="/login" className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" className="block px-3 py-2 rounded-md text-sm font-medium bg-white text-blue-700 mt-2" onClick={() => setMenuOpen(false)}>Register</Link>
            </>
          ) : (
            <>
              <div className="px-3 py-2 text-blue-300 text-sm">Welcome, {user.name}!</div>
              {user.role === 'admin' ? (
                <>
                  <Link to="/admin" className="block px-3 py-2 rounded-md text-sm hover:bg-blue-700" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                  <Link to="/admin/applications" className="block px-3 py-2 rounded-md text-sm hover:bg-blue-700" onClick={() => setMenuOpen(false)}>Applications</Link>
                </>
              ) : (
                <>
                  <Link to="/dashboard" className="block px-3 py-2 rounded-md text-sm hover:bg-blue-700" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                  <Link to="/apply" className="block px-3 py-2 rounded-md text-sm hover:bg-blue-700" onClick={() => setMenuOpen(false)}>Apply Pass</Link>
                  <Link to="/my-passes" className="block px-3 py-2 rounded-md text-sm hover:bg-blue-700" onClick={() => setMenuOpen(false)}>My Passes</Link>
                </>
              )}
              <button onClick={handleLogout} className="w-full text-left px-3 py-2 rounded-md text-sm text-red-300 hover:bg-blue-700">Logout</button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
