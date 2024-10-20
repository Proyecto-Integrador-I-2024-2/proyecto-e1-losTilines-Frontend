import { Button, Typography } from '@material-tailwind/react';
import React from 'react';
import { FaRegLightbulb, FaUsers, FaProjectDiagram } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export function LandingPage({ children }) {
    const navigate = useNavigate();
    const token = sessionStorage.getItem("token");

    function handleGetStarted() {
        if (token) {
            navigate("/dashboard");
        } else {
            navigate("/auth/sign-in");
        }

    }


    return (
        <div className="bg-gray-50">
            {/* Hero Section */}
            <section className="relative w-full min-h-screen bg-gradient-to-r from-blue-400 to-purple-200 flex items-center justify-center text-center text-white">
                <div className="container mx-auto px-4">
                    <Typography variant='h1' className='mb-6'>
                        Connect with Top Freelancers for Your Software Projects
                    </Typography>
                    <Typography variant='lead' className='mb-8 max-w-2xl mx-auto'>
                        Find the best talent, manage your projects effortlessly, and scale your business with our freelancer marketplace.
                    </Typography>
                    <Button
                        variant='text'
                        className='text-white py-3 px-6 rounded-lg text-lg shadow-lg hover:bg-cyan-500 transition'
                        onClick={handleGetStarted}
                    >
                        Get Started
                    </Button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-50 to-transparent"></div>
            </section>

            {/* Features Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <Typography variant='h2' className="text-4xl font-semibold text-center text-secondary mb-12">Why Choose Us?</Typography>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="bg-white shadow-lg rounded-lg p-6">
                            <FaRegLightbulb className="text-primary text-4xl mb-4" />
                            <h3 className="text-xl font-bold mb-2">Innovative Solutions</h3>
                            <p className="text-gray-600">
                                We connect you with creative professionals who bring innovative solutions to every project.
                            </p>
                        </div>
                        {/* Feature 2 */}
                        <div className="bg-white shadow-lg rounded-lg p-6">
                            <FaUsers className="text-primary text-4xl mb-4" />
                            <h3 className="text-xl font-bold mb-2">Collaborative Teams</h3>
                            <p className="text-gray-600">
                                Build and manage teams of freelancers to collaborate on large-scale software projects.
                            </p>
                        </div>
                        {/* Feature 3 */}
                        <div className="bg-white shadow-lg rounded-lg p-6">
                            <FaProjectDiagram className="text-primary text-4xl mb-4" />
                            <h3 className="text-xl font-bold mb-2">Project Management</h3>
                            <p className="text-gray-600">
                                Keep track of milestones, deadlines, and tasks all in one place with our intuitive project management tools.
                            </p>
                        </div>
                    </div>
                    {children}
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-16 bg-gray-100">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl font-semibold text-center text-secondary mb-12">What Our Users Say</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Testimonial 1 */}
                        <div className="bg-white p-6 shadow-lg rounded-lg">
                            <p className="text-gray-600 italic mb-4">
                                "This platform has helped me find amazing clients and manage my projects more efficiently!"
                            </p>
                            <p className="font-semibold text-gray-800">- Sarah, Freelancer</p>
                        </div>
                        {/* Testimonial 2 */}
                        <div className="bg-white p-6 shadow-lg rounded-lg">
                            <p className="text-gray-600 italic mb-4">
                                "Our team was able to scale up quickly by finding the right freelancers with the perfect skills."
                            </p>
                            <p className="font-semibold text-gray-800">- Michael, Project Manager</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-primary text-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-semibold mb-4">
                        Ready to transform your projects with the best talent?
                    </h2>
                    <Button
                        color='blue-gray'
                        className='text-white py-3 px-6 rounded-lg text-lg shadow-lg hover:bg-cyan-500 transition animate-bounce'
                        onClick={handleGetStarted}
                    >
                        Join Now
                    </Button>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 bg-secondary text-black text-center">
                <p>&copy; 2024 Freelance Now. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default LandingPage;
