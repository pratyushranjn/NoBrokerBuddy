import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const ListingCard = ({ id, title, description, address, city, rent, images = [] }) => {
  const navigate = useNavigate();

  const showListing = (e) => {
    e.stopPropagation();
    navigate(`/listing/${id}`);
  };

  return (
    <div className="w-full h-full bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl hover:scale-[1.02] transition-transform duration-300 flex flex-col">
      <div className="h-52 w-full">
        <Swiper
          modules={[Navigation, Pagination]}
          slidesPerView={1}
          pagination={{ clickable: true }}
          navigation
          className="h-full"
        >

          {images.map((img, index) => {
            const imageUrl = typeof img === "string" ? img : img?.url || '';
            const addParams = 'auto=format&fit=crop&w=600&h=400&q=60';
            const optimizedUrl = imageUrl.includes('cloudinary') || imageUrl.includes('unsplash')
              ? `${imageUrl}${imageUrl.includes('?') ? '&' : '?'}${addParams}`
              : imageUrl;

            return (
              <SwiperSlide key={index}>
                <img
                 loading={index === 0 ? "eager" : "lazy"}
                  src={optimizedUrl}
                  alt={`listing-${index}`}
                   className="object-cover w-full h-full"
                />
              </SwiperSlide>
            );
          })}

        </Swiper>
      </div>

      <div className="p-4 flex flex-col justify-between flex-1 cursor-pointer" onClick={showListing}>
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-gray-800 truncate">{title}</h2>
          <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
          <p className="text-xs text-gray-500 truncate">{`${address}, ${city}`}</p>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <span className="text-indigo-600 font-bold text-lg">₹{rent}/month</span>
          <button
            onClick={showListing}
            className="px-3 py-1 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700 transition"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListingCard;
