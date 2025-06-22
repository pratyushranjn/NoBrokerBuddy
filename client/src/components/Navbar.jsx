import { useState, useEffect, useRef, useCallback } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, UserCog } from 'lucide-react';
import { searchAPI } from '../utils/axiosConfig';
import SearchResults from './SearchResults';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Badge from '@mui/material/Badge';
import MailIcon from '@mui/icons-material/Mail';
import { useNotifications } from '../context/NotificationContext';

const Navbar = () => {
  const { user, logout, loading } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [resultsFetched, setResultsFetched] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const { unreadCount, fetchUnreadCount } = useNotifications();

  useEffect(() => {
    if (loading) return;
    if (user && user._id) {
      fetchUnreadCount(user._id);
    }
  }, [loading, user?._id]);


  const menuRef = useRef(null);
  const searchRef = useRef(null);

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      toast.success('You have been logged out successfully!', {
        position: "top-center",
        autoClose: 1000,
      });

      navigate("/");
    } catch (e) {
      toast.error('Failed to log out. Please try again.', {
        position: "top-center",
        autoClose: 2000,
      });
    }
  }, [logout, navigate]);


  const handleSearchSubmit = useCallback((e) => {
    e.preventDefault();

  }, [searchQuery, navigate]);

  const handleShareClick = () => {  
    if (!user) {
      if (location.pathname !== "/login") {
        navigate('/login', {
          state: { message: 'Please log in to share your spot.' }
        });
      }
      return;
    }
    navigate('/newlisting');
  };


  const handleMessageClick = () => {
    navigate(`/inbox`);
  };

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen(prev => !prev);
  }, []);

  // Search debounce effect
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery.trim().length < 3) {
        setSearchResults([]);
        setResultsFetched(false);
        return;
      }

      const fetchResults = async () => {
        try {
          const response = await searchAPI.get('/search', {
            params: { q: searchQuery },
          });
          setSearchResults(response.data.results || []);
        } catch (error) {
          console.error('Search error:', error);
          setSearchResults([]);
        } finally {
          setResultsFetched(true);
        }
      };

      fetchResults();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchResults([]);
        setSearchQuery('');
      }

      if (mobileMenuOpen && menuRef.current && !menuRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mobileMenuOpen]);

  if (loading) return null;

  const navLinks = !user
    ? [
      { path: '/login', label: 'Login' },
      { path: '/signup', label: 'Signup' },
    ]
    : [
      {
        path: '/account/view',
        label: (
          <button
            title="My Account"
            className="p-2 rounded-full hover:bg-gray-200 transition"
            aria-label="Account Settings"
          >
            <UserCog className="w-6 h-6 text-indigo-600" />
          </button>
        ),
      },
    ];

  const SearchIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z"
      />
    </svg>
  );

  return (
    <header>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mobile Header */}
          <div className="flex items-center justify-between h-16 md:hidden">
            <div ref={searchRef} className="flex-1 mr-2 relative w-full">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full max-w-xs rounded-full border border-gray-300 pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <SearchIcon />
              </form>

              {searchQuery.trim() !== '' && (
                <SearchResults
                  results={searchResults}
                  onClose={() => setSearchResults([])}
                  clearQuery={() => setSearchQuery('')}
                  searchQuery={searchQuery}
                  resultsFetched={resultsFetched}
                />
              )}
            </div>

            <div className="flex items-center gap-x-2">

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleShareClick();
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
              >
                Share
              </button>

              {user && (
                <button
                  onClick={handleMessageClick}
                  title="Question Answer"
                  className="p-2 rounded-full hover:bg-gray-100 transition"
                  aria-label="Open Chat"
                >
                  <Badge badgeContent={unreadCount} color="error">

                    <MailIcon sx={{ color: 'rgb(79 70 229)' }} />

                  </Badge>
                </button>
              )}
            </div>

            <button
              onClick={toggleMobileMenu}
              className="ml-2 p-2 rounded-md text-gray-700 hover:text-indigo-500 hover:bg-gray-100"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Desktop Header */}
          <div className="hidden md:flex items-center justify-between h-16">
            <Link
              to="/listings"
              className="text-2xl font-extrabold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text"
            >
              NoBroker<span className="text-rose-600">Buddy</span>
            </Link>

            <div ref={searchRef} className="relative flex items-center justify-between gap-4 w-full max-w-5xl mx-6">
              <form onSubmit={handleSearchSubmit} className="relative flex-grow max-w-3xl">
                <input
                  type="text"
                  placeholder="Search properties, locations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-full border border-gray-300 pl-10 pr-4 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition"
                />
                <SearchIcon />
              </form>

              {searchQuery.trim() !== '' && (
                <SearchResults
                  results={searchResults}
                  onClose={() => setSearchResults([])}
                  clearQuery={() => setSearchQuery('')}
                  searchQuery={searchQuery}
                  resultsFetched={resultsFetched}
                />
              )}

              {user && (
                <button
                  onClick={handleMessageClick}
                  title="Question Answer"
                  className="p-2 rounded-full hover:bg-gray-200 transition"
                  aria-label="Open Chat"
                >
                  <Badge badgeContent={unreadCount} color="error">
                    <MailIcon sx={{ color: 'rgb(79 70 229)' }} />
                  </Badge>
                </button>
              )}
            </div>

            <div className="flex items-center space-x-4 whitespace-nowrap">
              {navLinks.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 ${isActive ? 'text-indigo-600 font-semibold' : 'text-gray-600 hover:text-indigo-500'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}

              <button
                onClick={handleShareClick}
                className="ml-2 px-4 py-2 rounded-full text-sm font-semibold transition duration-300 bg-indigo-50 text-indigo-700 border border-indigo-300 hover:bg-indigo-600 hover:text-white"
              >
                Share Your Spot
              </button>

              {user && (
                <>
                  <span className="text-gray-700">Hi, {user.name || user.email}</span>
                  <button
                    onClick={handleLogout}
                    className="px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div ref={menuRef} className="md:hidden bg-white pb-3 px-4 space-y-1">
              {navLinks.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-md text-base font-medium ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}

              <NavLink
                to="/newlisting"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-base font-medium ${isActive
                    ? 'bg-indigo-600 text-white'
                    : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                  }`
                }
              >
                Share Your Spot
              </NavLink>

              <NavLink
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-base font-medium ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                Home
              </NavLink>

              {user && (
                <>
                  <div className="px-3 py-2 text-gray-700 border-gray-200 ">
                    Hi, {user.name || user.email}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-700 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;




