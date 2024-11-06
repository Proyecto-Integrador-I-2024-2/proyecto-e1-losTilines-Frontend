import { profile_pic } from '@/data/placeholder';
import useReviews from '@/hooks/profile/useReviews';
import { Button, Textarea, IconButton } from '@material-tailwind/react';
import React, { useState } from 'react';

export const ReviewSection = ({ id }) => {
    const { data: reviews, isLoading } = useReviews({ freelancer: id });
    const [responses, setResponses] = useState({});

    // Función para manejar respuestas del freelancer
    const handleResponseChange = (e, reviewId) => {
        setResponses({ ...responses, [reviewId]: e.target.value });
    };

    const handleResponseSubmit = (reviewId) => {
        // Aquí puedes manejar el envío de la respuesta, actualizar el estado o enviar a la API
        console.log('Respuesta enviada para la review:', reviewId, responses[reviewId]);
    };

    return (
        <div className="bg-gray-50 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Reviews</h2>
            <div className="space-y-6">
                {(reviews && !isLoading) && reviews.map((review) => (
                    <div key={review.id} className="bg-white p-4 rounded-lg shadow-sm">
                        {/* Detalles de la review */}
                        <div className="flex items-center mb-4">
                            <img
                                className="w-12 h-12 rounded-full mr-4"
                                src={review?.writer?.profile_picture || profile_pic}
                                alt={`${review?.writer?.first_name} ${review?.writer?.last_name}`}
                            />
                            <div>
                                <h3 className="text-lg font-semibold">{`${review?.writer?.first_name} ${review?.writer?.last_name}`}</h3>
                                <p className="text-gray-500 text-sm">{review.created_at}</p>
                            </div>
                        </div>
                        <p className="text-gray-700 mb-4">{review.description}</p>

                        {/* Respuesta del freelancer */}
                        {review.response ? (
                            <div className="bg-gray-100 p-3 rounded-lg">
                                <h4 className="font-semibold text-sm text-gray-700">Respuesta:</h4>
                                <p className="text-gray-600">{review.response}</p>
                            </div>
                        ) : (
                            <div className="mt-4">
                                <Textarea variant="static" placeholder="Your Comment" rows={8} />
                                <div className="flex w-full justify-between py-1.5">
                                    <IconButton variant="text" color="blue-gray" size="sm">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                            className="h-4 w-4"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
                                            />
                                        </svg>
                                    </IconButton>
                                    <div className="flex gap-2">
                                        <Button size="sm" color="red" variant="text" className="rounded-md">
                                            Cancel
                                        </Button>
                                        <Button size="sm" className="rounded-md">
                                            Post Comment
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ReviewSection;
