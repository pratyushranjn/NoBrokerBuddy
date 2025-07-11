import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/SignUp';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import ListingDetails from './components/ListingDetails'
import CreateListing from './components/CreateListing';
import Footer from './components/Footer';
import PrivateRoute from './routes/ProtectedRoute';
import AccountView from './routes/AccountView';
import EditListing from './components/EditListing';
import ChatPage from './pages/ChatPage';
import Inbox from "./pages/Inbox";

import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

function App() {

  return (
    <AuthProvider>
      <NotificationProvider>
        <BrowserRouter>
          <Navbar />
          <div className="">
            <Routes>
              <Route path="/" element={<Navigate to="/listings" />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/listings" element={<Home />} />
              <Route path="/listing/:id" element={<ListingDetails />} />

              {/* Protected Routes */}
              <Route path="/newlisting" element={<PrivateRoute><CreateListing /></PrivateRoute>} />
              <Route path="/account/view" element={<PrivateRoute><AccountView /></PrivateRoute>} />
              <Route path="/edit-listing/:id" element={<PrivateRoute><EditListing /></PrivateRoute>} />

              <Route path="/chat/:receiverId" element={<PrivateRoute><ChatPage /></PrivateRoute>} />
              <Route path="/inbox" element={<PrivateRoute> <Inbox /> </PrivateRoute>} />

            </Routes>
          </div>
          <Footer />
        </BrowserRouter>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
