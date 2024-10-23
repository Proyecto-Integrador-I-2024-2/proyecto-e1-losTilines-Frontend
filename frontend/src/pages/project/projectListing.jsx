import { ProjectCard } from "@/widgets/cards";
import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button
} from "@material-tailwind/react";
import { useWorkerProjects } from "@/hooks/projects/useWorkerProjects";
import { useFreelancerProjects } from "@/hooks/projects/useFreelancerProjects";
import { AddProject } from "@/widgets/popUp";
import { useNavigate } from "react-router-dom";

export function ProjectListing() {
  const [userType, setUserType] = useState(); 
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigateTo = useNavigate();

  // Obtener tipo de usuario desde sessionStorage
  useEffect(() => {
    const storedUserType = sessionStorage.getItem("role");
    setUserType(storedUserType);
  }, []);

  // Lógica para usar el hook correcto dependiendo del tipo de usuario
  console.log(userType);
  const freelancerProjects = useFreelancerProjects({ enabled: userType === "Freelancer" });
  const workerProjects = useWorkerProjects({ enabled: userType === "Business Manager" });

  // Seleccionar los datos y el estado de carga correctos
  const projectsData = userType === "Freelancer" ? freelancerProjects.data : workerProjects.data;
  const isProjectsLoading = userType === "Freelancer" ? freelancerProjects.isLoading : workerProjects.isLoading;

  const handleOpen = () => {
    setDialogOpen(true);
  };

  const handleNavigate = () => {
    navigateTo('/'); // Cambiar a la ruta deseada
  };

  return (
    <div className="flex flex-col w-full h-screen gap-2 overflow-hidden min-h-0 bg-gradient-to-r from-indigo-50 via-purple-50 to-blue-50">
      {/* Título de la página */}
      <div className="text-left mt-5 ml-5">
        <Typography variant="h3" color="blue-gray" className="font-bold tracking-wide">
          Tus proyectos
        </Typography>
      </div>

      {/* Comprobamos si los datos están cargando */}
      {isProjectsLoading ? (
        <div className="flex justify-center items-center w-full h-full">
          <Typography variant="h6" color="gray">Cargando proyectos...</Typography>
        </div>
      ) : (
        <div className="flex w-full h-full flex-1 p-5 pb-5">
          {/* Sección 1: Tarjetas de Proyecto */}
          <div className="basis-[80%] p-8 gap-14 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 justify-between overflow-auto">
            {projectsData && projectsData.length > 0 ? (
              projectsData.map((project, index) => (
                <div key={index} className="pb-2">
                  <ProjectCard project={project} isActive={true} />
                </div>
              ))
            ) : (
              <div className="flex justify-center items-center w-full h-full">
                <Typography variant="h6" color="gray">No hay proyectos disponibles</Typography>
              </div>
            )}
          </div>

          <div className="basis-[20%] pr-6">
            <Card color="white" shadow={true} className="w-full rounded-xl shadow-2xl">
              <CardHeader
                color="transparent"
                floated={true}
                shadow={true}
                className="mx-0 flex items-center pt-0 pb-8 justify-center m-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-t-xl"
              >
                <Typography variant="h5" color="white" className="text-center font-semibold pt-5">
                  {userType === "Freelancer" ? "Buscar más proyectos" : "Añade un nuevo proyecto"}
                </Typography>
              </CardHeader>
              <CardBody className="px-4 py-8 flex flex-col items-center">
                <Typography color="gray" className="mb-4 text-center">
                  {userType === "Freelancer"
                    ? "Explora proyectos disponibles para unirte."
                    : "Si tienes una idea innovadora, no dudes en agregarla a nuestra lista de proyectos."}
                </Typography>
                {userType === "Freelancer" ? (
                  <Button variant="gradient" onClick={handleNavigate}>
                    Buscar Proyectos
                  </Button>
                ) : (
                  <Button onClick={handleOpen} variant="gradient">
                    Crear Proyecto
                  </Button>
                )}
                {userType !== "Freelancer" && (
                  <AddProject open={dialogOpen} setOpen={setDialogOpen} color="purple" size="lg" ripple={true} className="rounded-full shadow-lg">
                    + Añadir Proyecto
                  </AddProject>
                )}
              </CardBody>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectListing;
