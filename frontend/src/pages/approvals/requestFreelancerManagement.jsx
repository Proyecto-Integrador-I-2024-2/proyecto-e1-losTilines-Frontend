import React, { useState, useEffect } from 'react';
import {
    Card,
    CardBody,
    Typography,
    Button,
    Spinner,
} from "@material-tailwind/react";

import { CheckCircleIcon, ClockIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { getCompanyInterest, getFreelancer, getFreelancerInterest, getProject, patchProjectFreelancerInterest } from '@/services';
import { useNavigate } from 'react-router-dom';

export const CompanyInterestManagement = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const navigate = useNavigate();
    const role = sessionStorage.getItem('role');
    const freelancerIds = [sessionStorage.getItem('id')];
    console.log('Role:', role);
    console.log("requests:", requests);

    if (!role || role != "Freelancer") {
        navigate('/');
    }


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

    const fetchRequestsForFreelancer = async (freelancerId) => {
        try {
            // Cambiado para buscar solicitudes donde la empresa está interesada
            console.log('Fetching requests for freelancer:', freelancerId);

            const data = await getCompanyInterest(freelancerId);

            console.log('Data gotten:', data);

            const detailedRequests = await Promise.all(
                data.map(request => fetchRequestDetails(request))
            );
            return detailedRequests;
        } catch (error) {
            console.error(`Error fetching requests for freelancer ${freelancerId}:`, error);
            return [];
        }
    };

    const fetchAllRequests = async () => {
        if (!freelancerIds || freelancerIds.length === 0) return;

        try {
            setLoading(true);

            // Fetch requests for all freelancers in parallel
            const allRequests = await Promise.all(
                freelancerIds.map(freelancerId => fetchRequestsForFreelancer(freelancerId))
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
    }, [isInitialLoad, freelancerIds.join(',')]); // Usar join para crear una dependencia estable

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
        console.log("Status:", status);
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

    // Agrupar las solicitudes por freelancer
    const requestsByFreelancer = requests.reduce((acc, request) => {
        const freelancerId = request.freelancer;
        if (!acc[freelancerId]) {
            acc[freelancerId] = [];
        }
        acc[freelancerId].push(request);
        return acc;
    }, {});

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <Typography variant="h3" className="mb-8 text-gray-800">
                    Solicitudes de Empresas
                </Typography>

                {Object.entries(requestsByFreelancer).map(([freelancerId, freelancerRequests]) => (
                    <div key={freelancerId} className="mb-12">
                        <Typography variant="h4" className="mb-6 text-gray-700">
                            Solicitudes para {freelancerRequests[0]?.freelancerDetails?.user?.first_name} {freelancerRequests[0]?.freelancerDetails?.user?.last_name}
                        </Typography>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {freelancerRequests.map((request) => (
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

                                        {/* Información del Proyecto/Empresa */}
                                        <div className="mb-6">
                                            <Typography variant="h6" color="blue-gray" className="mb-2">
                                                Detalles del Proyecto
                                            </Typography>
                                            <div className="space-y-2">
                                                <Typography className="text-sm text-gray-600">
                                                    <span className="font-medium">Nombre:</span> {request.projectDetails?.name}
                                                </Typography>
                                                <Typography className="text-sm text-gray-600">
                                                    <span className="font-medium">Project Manager:</span> {request.projectDetails?.user?.first_name + " " + request.projectDetails?.user?.last_name}
                                                </Typography>
                                                <Typography className="text-sm text-gray-600">
                                                    <span className="font-medium">Presupuesto:</span> ${request.projectDetails?.budget}
                                                </Typography>
                                                <Typography className="text-sm text-gray-600">
                                                    <span className="font-medium">Descripción:</span> {request.projectDetails?.description}
                                                </Typography>
                                            </div>
                                        </div>

                                        {/* Botones de Acción */}
                                        {role === "Freelancer" && request.status === "company_interested" && (
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
                            No hay solicitudes de empresas pendientes
                        </Typography>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CompanyInterestManagement;