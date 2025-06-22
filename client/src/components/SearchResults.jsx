import { MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SearchResults = ({ results, onClose, clearQuery, resultsFetched }) => {
  const navigate = useNavigate();

  if (!resultsFetched) return null;

  return (
    <div className="absolute top-full left-0 w-[90vw] sm:w-[80vw] md:w-[32rem] mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 animate-fade-in-down">


      {results.length === 0 ? (
        <div className="px-4 py-5 text-center text-gray-500 text-sm">
          😕 Oops! “Not found”
        </div>
      ) : (
        <ul className="divide-y divide-gray-100 max-h-96  overflow-y-auto">
          {results.map((result, index) => (
            <li
              key={result._id || index}
              className="flex gap-4 items-start px-4 py-4 hover:bg-indigo-50 transition-all duration-200 cursor-pointer"
              onMouseDown={() => {
                onClose();
                clearQuery();
                navigate(`/listing/${result._id}`);
              }}
            >
              {result.images && (
                <img
                  src={result.images[0].url}
                  alt={result.title}
                  className="w-14 h-14 rounded-md object-cover flex-shrink-0 border"
                />
              )}
              <div className="flex flex-col text-sm">
                <div className="font-semibold text-indigo-700 text-base">
                  {result.title}
                </div>

                <div className="flex items-center text-gray-600 mt-1 gap-1">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-xs">{result.city || "Unknown Location"}</span>
                </div>

                {result.details && (
                  <div className="text-xs text-gray-500 mt-0.5">
                    {result.details}
                  </div>
                )}

                {result.price && (
                  <div className="text-green-600 font-medium text-sm mt-1">
                    ₹ {result.price.toLocaleString()}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchResults;



