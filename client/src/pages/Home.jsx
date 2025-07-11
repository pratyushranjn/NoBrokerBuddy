import React, { useEffect, useState } from 'react';
const ListingCard = React.lazy(() => import('../components/ListingCard'));
import { Commet } from 'react-loading-indicators';
import { listingAPI } from '../utils/axiosConfig';

import AOS from "aos";
import "aos/dist/aos.css";


const Home = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  useEffect(() => {
    if (!loading) {
      AOS.refresh();
    }
  }, [loading]);


  useEffect(() => {
    let isMounted = true;

    const fetchListings = async () => {
      try {
        const res = await listingAPI.get('/');
        if (isMounted) {
          setListings(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch listings:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchListings();

    return () => {
      isMounted = false; // cleanup in case unmounted before fetch completes
    };
  }, []);

  if (loading) {
    return (
      <div
        style={{ height: '100vh' }}
        className="flex items-center justify-center flex-col"
      >
        <Commet color="#E11D48" size="30px" text="" textColor="#32cd32" />
      </div>
    );
  }

  return (
    <div className="pt-20 px-4 sm:px-6 lg:px-8 min-h-screen bg-gray-100 mb-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">

          {listings.map((listing) => (
            <div data-aos="fade-up" key={listing._id}>
              <ListingCard id={listing._id} {...listing} />
            </div>
          ))}

        </div>
      </div>
    </div>
  );
};

export default Home;

