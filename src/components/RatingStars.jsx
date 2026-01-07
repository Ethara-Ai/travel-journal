import { Star } from "lucide-react";

const RatingStars = ({ rating, darkMode, onRate, interactive = false, size = "h-4 w-4" }) => {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`${size} ${interactive ? "cursor-pointer hover:scale-110 transition-transform" : ""
            } ${i < rating
              ? darkMode
                ? "fill-yellow-400 text-yellow-400"
                : "fill-yellow-500 text-yellow-500"
              : darkMode
                ? "fill-gray-600 text-gray-600"
                : "fill-gray-300 text-gray-400"
            } transition-colors duration-200`}
          onClick={() => interactive && onRate && onRate(i + 1)}
          aria-label={
            interactive
              ? `Rate ${i + 1} star${i > 0 ? "s" : ""}`
              : `${rating} out of 5 stars`
          }
        />
      ))}
    </div>
  );
};

export default RatingStars;