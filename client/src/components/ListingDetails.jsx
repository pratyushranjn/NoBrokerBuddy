import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { useAuth } from '../context/AuthContext';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ListingDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/listings/${id}`);
        setListing(res.data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch listing:', error);
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  if (loading) {
    return <div className="text-center mt-10 text-lg text-gray-600">Loading listing details...</div>;
  }

  if (!listing) {
    return <div className="text-center mt-10 text-red-600">Listing not found.</div>;
  }

  const {
    title,
    description,
    postedBy,
    address,
    city,
    rent,
    images = [],
    createdAt,
    isVacant,
  } = listing;

  return (
    <div className="pt-20 px-4 sm:px-6 lg:px-8 min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-6">
        <Swiper
          modules={[Navigation, Pagination]}
          slidesPerView={1}
          pagination={{ clickable: true }}
          navigation
          className="h-64 mb-6"
        >
          {images.map((img, index) => (
            <SwiperSlide key={index}>
              <img
                src={img.url}
                alt={`Image ${index + 1}`}
                className="w-full h-64 object-cover rounded-md"
                loading="lazy"
                decoding="async"
              />
            </SwiperSlide>
          ))}
        </Swiper>

        <h1 className="text-2xl font-bold text-gray-800 mb-2">{title}</h1>
        <p className="text-gray-600 mb-2">{description}</p>
        <p className="text-sm text-gray-500 mb-4">{address}, {city}</p>

        <div className="flex justify-between items-center text-sm text-gray-700 mb-2">
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 mr-2 text-indigo-600"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a8.25 8.25 0 0115 0"
              />
            </svg>
            <span className="font-medium text-gray-800 mr-1">Listed by:</span>
            <span className="text-gray-600">
              
              {typeof postedBy === 'object' && postedBy?.name ? postedBy.name : "Your Buddy"}

            </span>
          </div>
          <p className={`inline-block px-2 py-1 rounded-full font-medium ${isVacant ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {isVacant ? 'Available' : 'Occupied'}
          </p>
        </div>

        <p className="text-sm text-gray-500 mb-4">
          Posted on: {new Date(createdAt).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })} at {new Date(createdAt).toLocaleTimeString('en-IN')}
        </p>

        <p className="text-xl text-indigo-600 font-semibold mb-4">₹{rent}/month</p>

        {user && typeof postedBy === 'object' && postedBy?._id && postedBy._id !== user._id && (
          <Link
            to={`/chat/${postedBy._id}`}
            className="inline-block bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
          >
            Connect {postedBy.name?.split(' ')[0] || 'owner'}
          </Link>
        )}
        
      </div>
    </div>
  );
};

export default ListingDetails;
