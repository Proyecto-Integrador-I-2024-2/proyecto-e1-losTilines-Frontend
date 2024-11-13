import { profile_pic } from '@/data/placeholder';
import useReviews from '@/hooks/profile/useReviews';
import { postFreelancerComment, postFreelancerResponse } from '@/services';
import { Button, Textarea, IconButton, Typography, Alert } from '@material-tailwind/react';
import React, { useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export const ReviewSection = ({ id }) => {
    const { data: reviews, isLoading, refetch } = useReviews({ freelancer: id });
    const queryClient = useQueryClient();
    const [responses, setResponses] = useState(new Map());
    const textAreaRefs = useRef(new Map());
    const [comment, setComment] = useState("");
    const role = sessionStorage.getItem("role");
    const [error, setError] = useState(null);


    console.log('ReviewsId:', id);
    console.log('Reviews:', reviews);
    console.log('sessionStorage', sessionStorage.getItem("id"));
    console.log('Condition', (sessionStorage.getItem("id") == id))
    console.log("Role: ", sessionStorage.getItem("role"));


    function handleResponse(reviewId) {
        const textAreaRef = textAreaRefs.current.get(reviewId);
        if (textAreaRef && textAreaRef.querySelector('textarea')) {
            const value = textAreaRef.querySelector('textarea').value;
            console.log("Value:", value);
            console.log("ReviewId:", reviewId);
            handleResponseSubmit(reviewId, value);
        }


    };

    function handleChange(reviewId, value) {
        setResponses(prevResponses => {
            const newResponses = new Map(prevResponses);
            newResponses.set(reviewId, value);
            return newResponses;
        });
    };


    function handleResponseSubmit(reviewId, value) {
        const body = {
            "response": value
        }
        try {
            postFreelancerResponse(reviewId, body);
        } catch (error) {
            console.log("Error posting response", error);

            setError(error.message);
        }
        queryClient.invalidateQueries(["Freelancer Comments", { freelancer: id }]);
        refetch();
    };

    function handleCommentSubmit() {
        const body = {
            "description": comment,
            "stars": 5.0,
            "freelancer": id
        }
        try {
            postFreelancerComment(body)
            setComment("");
        } catch (error) {
            console.log("Error posting comment", error);
            setError(error.message);
        }
        queryClient.invalidateQueries(["Freelancer Comments", { freelancer: id }]);
        refetch();
    }

    return (
        <div className="bg-gray-50 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Reviews</h2>
            <div className="space-y-6">
                {(reviews && !isLoading) ? reviews.map((review) => (
                    <div key={review.id} className="bg-white p-4 rounded-lg shadow-sm">
                        {/* Detalles de la review */}
                        <div className="flex items-center mb-4">
                            <img
                                className="w-12 h-12 rounded-full mr-4"
                                src={review?.writer?.profile_picture || profile_pic}
                                onError={(e) => { e.target.onerror = null; e.target.src = profile_pic }}
                                alt={`${review?.writer?.first_name} ${review?.writer?.last_name}`}
                            />
                            <div>
                                <h3 className="text-lg font-semibold">{`${review?.writer?.first_name} ${review?.writer?.last_name}`}</h3>
                                <p className="text-gray-500 text-sm">{review.created_at}</p>
                            </div>
                        </div>
                        <p className="text-gray-700 mb-4">{review.description}</p>

                        {/* Respuesta del freelancer */}
                        {(review.response) ? (
                            <div className="bg-gray-100 p-3 rounded-lg">
                                <h4 className="font-semibold text-sm text-gray-700">Respuesta:</h4>
                                <p className="text-gray-600">{review.response}</p>
                            </div>
                        ) : (
                            ((sessionStorage.getItem("id") == id) &&
                                <div className="mt-4">
                                    <Textarea
                                        ref={el => textAreaRefs.current.set(review.id, el)}
                                        placeholder="Your response"
                                        rows={1}
                                        value={responses.get(review.id) || ''}
                                        onChange={(e) => handleChange(review.id, e.target.value)}
                                    />
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
                                            <Button size="sm" className="rounded-md" onClick={() => handleResponse(review.id)}>
                                                Post Response
                                            </Button>
                                        </div>
                                    </div>
                                </div>)
                        )}
                    </div>
                ))
                    :
                    <Typography variant='h3' color="gray" className="text-center">No reviews yet</Typography>

                }
            </div>
            {role != "Freelancer" && (<div className="space-y-6">
                <div className="mt-4">
                    <Textarea placeholder="Your Comment" rows={2} value={comment} onChange={(e) => setComment(e.target.value)} />
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
                            <Button size="sm" className="rounded-md" onClick={handleCommentSubmit}>
                                Post Comment
                            </Button>
                        </div>
                    </div>
                </div>
            </div>)}
            {
                error && (
                    <Alert variant="filled" color="red">
                        ¡Atención! Algo importante ha ocurrido.
                        {error.message}
                    </Alert>
                )
            }
        </div>
    );
};

export default ReviewSection;
