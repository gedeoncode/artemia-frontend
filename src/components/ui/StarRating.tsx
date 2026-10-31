// StarRating.tsx
import React from "react";
import { Star } from "lucide-react";

type StarRatingProps = {
  rating: number; // e.g., 4.5
  max?: number;   // optional, default 5
  size?: number;  // pixel size of icons, e.g., 20
};

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  max = 5,
  size = 20,
}) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = max - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <span className="inline-flex">
      {/* Full stars */}
      {Array.from({ length: fullStars }).map((_, i) => (
        <Star key={`full-${i}`} color="#3b82f6" size={size} fill="#3b82f6" />
      ))}

      {/* Half star */}
      {hasHalfStar && (
        <span className="relative inline-block">
          <Star color="#d1d5db" size={size} /> {/* gray star */}
          <Star
            className="absolute top-0 left-0"
            color="#3b82f6"
            size={size}
            fill="#3b82f6"
            style={{ clipPath: "inset(0 50% 0 0)" }} // shows left half blue
          />
        </span>
      )}

      {/* Empty stars */}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <Star key={`empty-${i}`} color="#d1d5db" size={size} />
      ))}
    </span>
  );
};
