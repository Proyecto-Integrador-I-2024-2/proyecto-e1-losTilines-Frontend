import React, { useState, useEffect } from 'react';
import {
    Card,
    CardBody,
    Typography,
    Button,
    Spinner,
} from "@material-tailwind/react";

import { CheckCircleIcon, ClockIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { getFreelancer, getFreelancerInterest, getProject, patchProjectFreelancerInterest } from '@/services';
import { useUser } from '@/hooks';
import { useQueryClient } from '@tanstack/react-query';

export const RequestProjectManagement = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const queryClient = useQueryClient();
    const {
        data: userData,
        isLoading: isUserLoading,
        refetch: userRefetch,
    } = useUser();

    const projectIds = userData?.related_projects?.map(project => project.id) || [];

    const role = sessionStorage.getItem('role');

    const fetchRequestDetails = async (request) => {
        try {
            const [projectData, freelancerData] = await Promise.all([
                getProject({ id: request.project }),
                getFreelancer({ id: request.freelancer })
            ]);

            return {
                ...request,
                projectDetails: projectData,
                freelancerDetails: freelancerData,
            };
        } catch (error) {
            console.error('Error fetching details:', error);
            return request;
        }
    };

    const fetchRequestsForProject = async (projectId) => {
        try {
            const data = await getFreelancerInterest(projectId);
            const detailedRequests = await Promise.all(
                data.map(request => fetchRequestDetails(request))
            );
            return detailedRequests;
        } catch (error) {
            console.error(`Error fetching requests for project ${projectId}:`, error);
            return [];
        }
    };

    const fetchAllRequests = async () => {
        if (!projectIds || projectIds.length === 0) return;

        try {
            setLoading(true);

            // Fetch requests for all projects in parallel
            const allRequests = await Promise.all(
                projectIds.map(projectId => fetchRequestsForProject(projectId))
            );

            // Flatten the array of arrays into a single array of requests
            const flattenedRequests = allRequests.flat();

            setRequests(flattenedRequests);
            setError(null);
        } catch (err) {
            setError('Error al cargar las solicitudes');
            console.error('Error:', err);
        } finally {
            setLoading(false);
            setIsInitialLoad(false);
        }
    };

    useEffect(() => {
        if (isInitialLoad) {
            fetchAllRequests();
        }
    }, [isInitialLoad, projectIds.join(',')]); // Usar join para crear una dependencia estable

    const handleAction = async (requestId, action) => {
        try {
            const { data, status } = await patchProjectFreelancerInterest(requestId, { status: action });

            if (status !== 200) {
                throw new Error('Error updating request');
            }

            setRequests(prevRequests =>
                prevRequests.map(req =>
                    req.id === requestId ? { ...req, status: data.status } : req
                )
            );
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'in_progress':
                return <CheckCircleIcon className="text-green-500 w-6 h-6" />;
            case 'rejected':
                return <XCircleIcon className="text-red-500 w-6 h-6" />;
            default:
                return <ClockIcon className="text-blue-500 w-6 h-6" />;
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'in_progress':
                return 'Aceptado';
            case 'rejected':
                return 'Rechazado';
            default:
                return 'Pendiente';
        }
    };

    if (loading && isInitialLoad) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Spinner className="h-12 w-12 text-blue-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Typography color="red" className="text-xl">
                    {error}
                </Typography>
            </div>
        );
    }

    // Agrupar las solicitudes por proyecto
    const requestsByProject = requests.reduce((acc, request) => {
        const projectId = request.project;
        if (!acc[projectId]) {
            acc[projectId] = [];
        }
        acc[projectId].push(request);
        return acc;
    }, {});

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <Typography variant="h3" className="mb-8 text-gray-800">
                    Solicitudes de Participación
                </Typography>

                {Object.entries(requestsByProject).map(([projectId, projectRequests]) => (
                    <div key={projectId} className="mb-12">
                        <Typography variant="h4" className="mb-6 text-gray-700">
                            {projectRequests[0]?.projectDetails?.name || `Proyecto ${projectId}`}
                        </Typography>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {projectRequests.map((request) => (
                                <Card key={request.id} className="hover:shadow-lg transition-shadow duration-300">
                                    <CardBody className="p-6">
                                        {/* Cabecera con Status */}
                                        <div className="flex justify-between items-center mb-6">
                                            <div className="flex items-center gap-2">
                                                {getStatusIcon(request.status)}
                                                <Typography className="font-medium text-gray-600">
                                                    {getStatusText(request.status)}
                                                </Typography>
                                            </div>
                                            <Typography className="text-sm text-gray-500">
                                                ID: {request.id}
                                            </Typography>
                                        </div>

                                        {/* Información del Freelancer */}
                                        <div className="mb-6">
                                            <Typography variant="h6" color="blue-gray" className="mb-2">
                                                {request.freelancerDetails?.user?.first_name + " " + request.freelancerDetails?.user?.last_name || 'Freelancer'}
                                            </Typography>
                                            <div className="space-y-2">
                                                <Typography className="text-sm text-gray-600">
                                                    <span className="font-medium">Email:</span> {request.freelancerDetails?.user?.email}
                                                </Typography>
                                                <Typography className="text-sm text-gray-600">
                                                    <span className="font-medium">Descripción:</span> {request.freelancerDetails?.description}
                                                </Typography>
                                                {request.freelancerDetails?.experience_set?.slice(0, 3).map((exp, index) => (
                                                    <Typography key={index} className="text-sm text-gray-600">
                                                        <span className="font-medium">Experiencia:</span> {exp.occupation} in {exp.company}
                                                    </Typography>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Información del Proyecto */}
                                        <div className="mb-6">
                                            <Typography variant="h6" color="blue-gray" className="mb-2">
                                                Detalles del Proyecto
                                            </Typography>
                                            <div className="space-y-2">
                                                <Typography className="text-sm text-gray-600">
                                                    <span className="font-medium">Nombre:</span> {request.projectDetails?.name}
                                                </Typography>
                                                <Typography className="text-sm text-gray-600">
                                                    <span className="font-medium">Presupuesto:</span> ${request.projectDetails?.budget}
                                                </Typography>
                                            </div>
                                        </div>

                                        {/* Botones de Acción */}
                                        {role === "Project Manager" && request.status === "freelancer_interested" && (
                                            <div className="flex gap-4 mt-4">
                                                <Button
                                                    onClick={() => handleAction(request.id, 'in_progress')}
                                                    className="flex-1 bg-green-500 hover:bg-green-600"
                                                >
                                                    Aceptar
                                                </Button>
                                                <Button
                                                    onClick={() => handleAction(request.id, 'rejected')}
                                                    className="flex-1 bg-red-500 hover:bg-red-600"
                                                >
                                                    Rechazar
                                                </Button>
                                            </div>
                                        )}
                                    </CardBody>
                                </Card>
                            ))}
                        </div>
                    </div>
                ))}

                {requests.length === 0 && !loading && (
                    <div className="text-center py-12">
                        <Typography className="text-gray-500 text-xl">
                            No hay solicitudes pendientes
                        </Typography>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RequestProjectManagement;