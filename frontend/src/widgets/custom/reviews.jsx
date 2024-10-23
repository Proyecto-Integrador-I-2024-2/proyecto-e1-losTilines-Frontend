import React, { useState } from 'react';

export const ReviewSection = ({ reviews }) => {
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
                {reviews.map((review) => (
                    <div key={review.id} className="bg-white p-4 rounded-lg shadow-sm">
                        {/* Detalles de la review */}
                        <div className="flex items-center mb-4">
                            <img
                                className="w-12 h-12 rounded-full mr-4"
                                src={review.reviewerImage}
                                alt={review.reviewerName}
                            />
                            <div>
                                <h3 className="text-lg font-semibold">{review.reviewerName}</h3>
                                <p className="text-gray-500 text-sm">{review.date}</p>
                            </div>
                        </div>
                        <p className="text-gray-700 mb-4">{review.content}</p>

                        {/* Respuesta del freelancer */}
                        {review.response ? (
                            <div className="bg-gray-100 p-3 rounded-lg">
                                <h4 className="font-semibold text-sm text-gray-700">Respuesta:</h4>
                                <p className="text-gray-600">{review.response}</p>
                            </div>
                        ) : (
                            <div className="mt-4">
                                <textarea
                                    className="w-full p-2 bg-gray-100 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows="2"
                                    placeholder="Escribe una respuesta..."
                                    value={responses[review.id] || ''}
                                    onChange={(e) => handleResponseChange(e, review.id)}
                                />
                                <button
                                    onClick={() => handleResponseSubmit(review.id)}
                                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Responder
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ReviewSection;
