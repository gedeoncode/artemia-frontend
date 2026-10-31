import { StarIcon } from '@heroicons/react/20/solid';

interface RatingProps {
  rating: number;
  reviewCount?: number;
}

export const Rating = ({ rating, reviewCount }: RatingProps) => {
  return (
    <div className="flex items-center">
      <div className="flex items-center">
        {[0, 1, 2, 3, 4].map((star) => (
          <StarIcon
            key={star}
            className={`h-5 w-5 flex-shrink-0 ${
              star < Math.floor(rating) ? 'text-blue-400' : 'text-gray-300'
            }`}
            aria-hidden="true"
          />
        ))}
      </div>
      <span className="ml-1 text-sm text-gray-500">
        {rating?.toFixed(1)} {reviewCount && `(${reviewCount} reviews)`}
      </span>
    </div>
  );
};