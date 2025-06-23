import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import bg from '../assets/bg.webp'

const Login = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [showMessage, setShowMessage] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const message = location.state?.message;

  useEffect(() => {
    if (message) {
      setShowMessage(true);
      const timer = setTimeout(() => setShowMessage(false), 3000);

      // cleanup funx
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await login(formData);
      navigate('/listings');
    } catch (err) {
      setError(err.message || 'Login failed');
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

      <div className="relative z-10 w-full max-w-sm bg-white-transparent rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-semibold text-center text-gray-900 mb-6">Welcome Back</h1>

        {showMessage && (
          <div className="fixed bottom-12 left-6 bg-green-500 text-white text-sm font-medium px-4 py-2 rounded shadow-lg animate-toast-in z-50">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:border-indigo-500"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="bg-slate-50 w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:border-indigo-500"
          />

          {error && <div className="bg-red-100 border border-red-400 text-red-700 text-sm px-4 py-2 rounded text-center">{error}</div>}

          <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition">
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-gray-100">
          Don't have an account?{' '}
          <Link to="/signup" className="text-indigo-300 font-semibold hover:underline">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

