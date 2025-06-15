import { FaStar } from 'react-icons/fa';

type Review = {
  name: string;
  role: string;
  image: string;
  rating: number;
  review: string;
};

const reviews: Review[] = [
  {
    name: 'Customer Name',
    role: 'Student / Parent',
    image: '/b2c-student/review-image.jpg',
    rating: 4,
    review:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque placarat luctus at leo fermentum aliquet...',
  },
  {
    name: 'Customer Name',
    role: 'Student / Parent',
    image: '/b2c-student/review-image.jpg',
    rating: 3,
    review:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque placarat luctus at leo fermentum aliquet...',
  },
];

export default function ReviewCard() {
  return (
    <div className="">
      <h2 className="text-xl font-semibold mb-4">Reviews</h2>
      <div className="space-y-5">
        {reviews.map((review, index) => (
          <div
            key={index}
            className="bg-gray-100 rounded-2xl p-5 shadow-sm flex flex-col gap-4"
          >
            <div className="flex items-center gap-4">
              <img
                src={review.image}
                alt={review.name}
                className="w-14 h-14 rounded-full object-cover"
              />
              <div>
                <h3 className="text-lg font-semibold">{review.name}</h3>
                <p className="text-sm text-gray-500">{review.role}</p>
                <div className="flex mt-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <FaStar
                      key={i}
                      className={`text-sm ${
                        i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              {review.review}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
