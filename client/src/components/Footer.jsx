import { Link } from 'react-router-dom';
import {
    Facebook,
    Twitter,
    Instagram,
    Mail,
    Phone,
    MapPin,
} from 'lucide-react';

const Footer = () => {
    const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    return (
        <footer className="bg-white text-gray-700 border-t border-gray-200">
            <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">

                <div>
                    <Link to="/">
                        <h2 className="text-2xl font-extrabold text-indigo-600">
                            NoBroker<span className="text-rose-600">Buddy</span>
                        </h2>
                    </Link>
                    {/* <p className="mt-2 text-sm text-gray-600">
                        A Peer-to-Peer Room/Flat Rental Platform for Students – No Brokers, Just Buddies
                    </p> */}
                    <p className="mt-2 text-sm text-gray-500">Helping you find your next home — without the broker hassle.</p>

                    <p className="mt-2 text-sm italic text-indigo-500">
                        A simple, community-based solution — by students, for students.
                    </p>
                </div>

                <div>
                    <h3 className="text-base font-semibold text-gray-800 mb-3">Quick Links</h3>
                    <ul className="space-y-2 text-sm">
                        <li>
                            <Link to="/" onClick={scrollToTop} className="hover:text-indigo-600">Home</Link>
                        </li>
                        <li>
                            <Link to="/newlisting" onClick={scrollToTop} className="hover:text-indigo-600">Post Property</Link>
                        </li>
                        <li>
                            <Link to="/account/view" onClick={scrollToTop} className="hover:text-indigo-600">My Account</Link>
                        </li>
                        <li>
                            <Link to="/signup" onClick={scrollToTop} className="hover:text-indigo-600">Sign Up</Link>
                        </li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-base font-semibold text-gray-800 mb-3">Contact Us</h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-center gap-2"><Phone size={16} />+91 XXXXX 1001</li>
                        <li className="flex items-center gap-2"><Mail size={16} /> support@nobrokerbuddy.com</li>
                        <li className="flex items-center gap-2"><MapPin size={16} /> New Delhi, India</li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-base font-semibold text-gray-800 mb-3">Follow Us</h3>
                    <div className="flex items-center space-x-4">
                        <a href="#" className="text-gray-500 hover:text-indigo-600"><Facebook size={20} /></a>
                        <a href="#" className="text-gray-500 hover:text-indigo-600"><Twitter size={20} /></a>
                        <a href="#" className="text-gray-500 hover:text-indigo-600"><Instagram size={20} /></a>
                    </div>
                </div>
            </div>


            <div className="border-t border-gray-200 bg-gray-50 text-center text-sm py-4">
                <p>© {new Date().getFullYear()} <span >NoBrokerBuddy</span>. All rights reserved.</p>
                <p className="text-xs text-gray-500 mt-1">
                    Made with ❤️ by <a href="https://github.com/pratyushranjn" target="_blank" className="text-indigo-600 hover:underline">Pratyush</a>
                </p>
            </div>
        </footer>
    );
};

export default Footer;
