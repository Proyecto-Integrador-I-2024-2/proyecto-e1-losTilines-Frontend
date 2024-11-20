import React from "react";
import {
    Card,
    CardBody,
    CardHeader,
    Typography,
    Spinner,
} from "@material-tailwind/react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    RadialBarChart,
    RadialBar,
} from "recharts";
import apiClient from "@/services/apiClient";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@/hooks";

const COLORS = {
    // Status colors
    pending: "#FFA726", // Orange
    active: "#66BB6A", // Green
    completed: "#42A5F5", // Blue
    undefined: "#78909C", // Blue Grey
    in_progress: "#AB47BC", // Purple
    rejected: "#EF5350", // Red
    open_to_apply: '#4CAF50',  // Green

    // Area colors
    area1: "#0088FE",
    area2: "#00C49F",
    area3: "#FFBB28",
    area4: "#FF8042",

    // Worker status
    with_project: "#4CAF50",
    without_project: "#FF7043",
};

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
                <p className="font-semibold text-gray-800">{`${label}`}</p>
                <p className="text-gray-600">{`Cantidad: ${payload[0].value}`}</p>
            </div>
        );
    }
    return null;
};

export const StatsPage = () => {
    const role = sessionStorage.getItem("role");
    const { data: userData, isLoading: isUserLoading } = useUser();

    const userId = sessionStorage.getItem("id");
    const areaId = userData?.area?.id || "";
    const companyId = userData?.company || "";

    const {
        data: statsData,
        isLoading,
        error,
    } = useQuery(
        ["stats", role, userId, areaId, companyId],
        async () => {
            let params = {};
            switch (role) {
                case "Project Manager":
                    params.user = userId;
                    break;
                case "Area Admin":
                    params.area = areaId;
                    break;
                case "Business Manager":
                    params.company = companyId;
                    break;
            }
            const queryParams = new URLSearchParams(params).toString();
            console.log("queryParams", queryParams);
            const { data } = await apiClient.get(`stats/?${queryParams}`);
            return data;
        },
        {
            staleTime: 1000 * 60 * 5,
            cacheTime: 1000 * 60 * 30,
            retry: 4,
            enabled: !isUserLoading && !!role,
        }
    );

    const formatStatusLabel = (status) => {
        if (!status) return 'No definido';

        return status
            .toString()
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };


    if (!statsData && !isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Typography color="gray" className="text-xl">
                    No hay datos disponibles
                </Typography>
            </div>
        );
    }

    const ProjectManagerStats = () => (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="w-full col-span-1">
                <CardHeader variant="gradient" color="blue" className="mb-4 p-4">
                    <Typography variant="h6" color="white">
                        Aplicaciones por Estado
                    </Typography>
                </CardHeader>
                <CardBody className="p-4">
                    <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={statsData?.applications_per_project || []}
                                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" className="opacity-50" />
                                <XAxis
                                    dataKey="status"
                                    angle={-45}
                                    textAnchor="end"
                                    interval={0}
                                    tick={{ fontSize: 12 }}
                                    tickFormatter={formatStatusLabel}
                                />
                                <YAxis />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend
                                    formatter={(value) => {
                                        if (value === 'count') return 'Cantidad';
                                        return formatStatusLabel(value);
                                    }}
                                />
                                <Bar
                                    dataKey="count"
                                    name="Cantidad"
                                    fill="#8884d8"
                                    radius={[4, 4, 0, 0]}
                                >
                                    {statsData.applications_per_project.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={COLORS[entry.status] || COLORS.undefined}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardBody>
            </Card>

            <Card className="w-full col-span-1">
                <CardHeader variant="gradient" color="green" className="mb-4 p-4">
                    <Typography variant="h6" color="white">
                        Estado de Proyectos
                    </Typography>
                </CardHeader>
                <CardBody className="p-4">
                    <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={statsData.projects_by_status || []}
                                    dataKey="count"
                                    nameKey="status"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    label={({ name, percent }) =>
                                        `${formatStatusLabel(name)} (${(percent * 100).toFixed(0)}%)`
                                    }
                                >
                                    {(statsData?.projects_by_status || []).map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={COLORS[entry.status] || COLORS.undefined}
                                            strokeWidth={2}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend
                                    formatter={(value) => {
                                        if (!value) return 'No definido';
                                        return formatStatusLabel(value);
                                    }}
                                    layout="vertical"
                                    align="rig  ht"
                                    verticalAlign="middle"
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </CardBody>
            </Card>

            <Card className="w-full lg:col-span-2">
                <CardHeader variant="gradient" color="light-blue" className="mb-4 p-4">
                    <Typography variant="h6" color="white">
                        Estado de Hitos
                    </Typography>
                </CardHeader>
                <CardBody className="p-4">
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadialBarChart
                                innerRadius="20%"
                                outerRadius="90%"
                                data={statsData?.milestones_by_status || []}
                                startAngle={180}
                                endAngle={0}
                            >
                                <RadialBar
                                    minAngle={15}
                                    label={{ fill: "#666", position: "insideStart" }}
                                    background
                                    dataKey="count"
                                    nameKey="status"
                                >
                                    {(statsData?.milestones_by_status || []).map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={COLORS[entry.status] || COLORS.undefined}
                                        />
                                    ))}
                                </RadialBar>
                                <Legend
                                    iconSize={10}
                                    formatter={(value) => {
                                        if (value === 'count') return 'Cantidad';
                                        return formatStatusLabel(value);
                                    }}
                                    layout="vertical"
                                    verticalAlign="middle"
                                    align="right"
                                />
                                <Tooltip content={<CustomTooltip />} />
                            </RadialBarChart>
                        </ResponsiveContainer>
                    </div>
                </CardBody>
            </Card>
        </div>
    );

    const AreaAdminStats = () => {
        const totalWorkers =
            statsData.workers_with_project + statsData.workers_without_project;
        const workersData = [
            {
                name: "Con Proyecto",
                value: statsData.workers_with_project,
                percentage: (
                    (statsData.workers_with_project / totalWorkers) *
                    100
                ).toFixed(1),
            },
            {
                name: "Sin Proyecto",
                value: statsData.workers_without_project,
                percentage: (
                    (statsData.workers_without_project / totalWorkers) *
                    100
                ).toFixed(1),
            },
        ];

        return (
            <div className="grid grid-cols-1 gap-6">
                <Card className="w-full">
                    <CardHeader variant="gradient" color="blue" className="mb-4 p-4">
                        <Typography variant="h6" color="white">
                            Distribución de Trabajadores
                        </Typography>
                    </CardHeader>
                    <CardBody className="p-4">
                        <div className="h-[400px] flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={workersData}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        label={({ name, percentage }) => `${name} (${percentage}%)`}
                                    >
                                        <Cell fill={COLORS.with_project} />
                                        <Cell fill={COLORS.without_project} />
                                    </Pie>
                                    <Tooltip
                                        formatter={(value, name) => [`${value} trabajadores`, name]}
                                    />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardBody>
                </Card>
            </div>
        );
    };

    const BusinessManagerStats = () => (
        <div className="grid grid-cols-1 gap-6">
            <Card className="w-full">
                <CardHeader variant="gradient" color="blue" className="mb-4 p-4">
                    <Typography variant="h6" color="white">
                        Proyectos por Área
                    </Typography>
                </CardHeader>
                <CardBody className="p-4">
                    <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={statsData?.projects_by_area || []}
                                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                layout="vertical"
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" />
                                <YAxis
                                    dataKey="user__usercompany__area__name"
                                    type="category"
                                    width={150}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                                <Bar
                                    dataKey="count"
                                    name="Cantidad de Proyectos"
                                    fill="#0088FE"
                                    radius={[0, 4, 4, 0]}
                                >
                                    {(statsData?.projects_by_area || []).map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[`area${index + 1}`] || COLORS.undefined} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardBody>
            </Card>
        </div>
    );

    if (isLoading || isUserLoading) {
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
                    Error al cargar las estadísticas
                </Typography>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                <Typography variant="h2" className="mb-8 text-gray-800">
                    Panel de Estadísticas
                </Typography>

                <div className="mb-8">
                    <Typography variant="h4" color="blue-gray" className="mb-2">
                        Bienvenido, {role}
                    </Typography>
                    <Typography color="gray" className="mb-8">
                        Aquí tienes un resumen de las métricas más importantes.
                    </Typography>
                </div>

                {role === "Project Manager" && <ProjectManagerStats />}
                {role === "Area Admin" && (
                    <>
                        <ProjectManagerStats />
                        <AreaAdminStats />
                    </>
                )}
                {role === "Business Manager" && (
                    <>
                        <ProjectManagerStats />
                        <AreaAdminStats />
                        <BusinessManagerStats />
                    </>
                )}
            </div>
        </div>
    );
};

export default StatsPage;
