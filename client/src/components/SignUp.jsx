import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import bg from '../assets/bg.webp'


const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await signup(formData);
      navigate('/listings');
    } catch (err) {
      setError(err.message || 'Signup failed');
    }
  };

  return (
    <div
      className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-400 to-indigo-600 px-4"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm"></div>

      <div className="relative z-10 w-full max-w-sm bg-white-transparent rounded-xl shadow-lg p-6">
        <h1 className="text-3xl font-semibold text-center text-gray-900 mb-5">Create an account</h1>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            type="text"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2.5 rounded-lg border border-gray-300 focus:outline-none focus:border-indigo-500"
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2.5 rounded-lg border border-gray-300 focus:outline-none focus:border-indigo-500"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2.5 rounded-lg border border-gray-300 focus:outline-none focus:border-indigo-500"
          />

          <input
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full p-2.5 rounded-lg border border-gray-300 focus:outline-none focus:border-indigo-500"
          />

          <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition">
            Sign Up
          </button>
        </form>

        <p className="mt-5 text-center text-gray-100">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-300 font-semibold hover:underline">Log In</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
