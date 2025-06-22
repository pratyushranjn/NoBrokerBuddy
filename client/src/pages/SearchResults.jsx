import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const SearchResults = () => {
  const location = useLocation();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const queryParams = new URLSearchParams(location.search);
  const searchTerm = queryParams.get('q');

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${BASE_URL}/api/listings/search?q=${encodeURIComponent(searchTerm)}`);
        setResults(res.data);
      } catch (err) {
        console.error("Search error:", err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    if (searchTerm) {
      fetchResults();
    }
  }, [searchTerm]);

  if (loading) return <div className="p-4">Loading search results...</div>;

  return (
    <div className="max-w-6xl mx-auto mt-24 px-4">
      <h2 className="text-xl font-bold mb-4">
        Search Results for "<span className="text-indigo-600">{searchTerm}</span>"
      </h2>

      {results.length === 0 ? (
        <p>No matching listings found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map(listing => (
            <div key={listing._id} className="bg-white shadow-md rounded-lg overflow-hidden">
              <img src={listing.image[0]} alt={listing.title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="text-lg font-semibold">{listing.title}</h3>
                <p className="text-gray-600">{listing.address}</p>
                <p className="text-indigo-600 font-bold mt-2">₹{listing.rent}/month</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
