import { BigProjectCard, ProjectCard } from "@/widgets/cards";
import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  SpeedDial,
  SpeedDialHandler,
  IconButton
} from "@material-tailwind/react";
import { useWorkerProjects } from "@/hooks/projects/useWorkerProjects";
import { useFreelancerProjects } from "@/hooks/projects/useFreelancerProjects";
import { AddProject } from "@/widgets/popUp";
import { useNavigate } from "react-router-dom";
// import { projectsData } from "@/data";
import { PlusIcon } from "@heroicons/react/24/outline";

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
    setDialogOpen(prev => !prev);
  };

  const handleNavigate = () => {
    navigateTo('/'); // Cambiar a la ruta deseada
  };

  const handleProjectNavigate = (id) => {
    navigateTo(`/project/detail/${id}`); // Agregar el ID del proyecto en la URL
  };


  return (
    <div className="flex flex-col w-full h-full justify-center">
      {/* Título de la página */}
      <div className="w-full my-4 text-center">
        <Typography variant="h2" color="blue-gray" className="font-bold tracking-wide w-full">
          Your projects
        </Typography>
      </div>

      {isProjectsLoading ? (
        <div className="flex justify-center items-center w-full max-h-min">
          <Typography variant="h6" color="gray">Cargando proyectos...</Typography>
        </div>
      ) : (
        <div className="w-full  flex flex-col pb-5">
          {/* Sección 1: Tarjetas de Proyecto */}
          {projectsData && projectsData.length > 0 ? (
            <div className="p-8 gap-14 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 justify-between overflow-y-auto ">
              {projectsData.map((project, index) => (
                <div key={index} className="pb-2 ">
                  <BigProjectCard project={project} handleNavigate={handleProjectNavigate} isActive={true} />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-row justify-center items-center w-full max-h-min">
              <Typography variant="h6" color="light-blue">You don't have associated projects. Please, explore our marketplace! </Typography>
            </div>
          )}
        </div>
      )}



      <div className="fixed bottom-8 right-8">
        <SpeedDial>
          <SpeedDialHandler>
            <IconButton size="lg" className="rounded-full" onClick={handleOpen}>
              <PlusIcon className="h-5 w-5 transition-transform group-hover:rotate-45" />
            </IconButton>
          </SpeedDialHandler>
        </SpeedDial>
      </div>
      {userType !== "Freelancer" && (
        <AddProject open={dialogOpen} setOpen={setDialogOpen} color="purple" size="lg" ripple={true} className="rounded-full shadow-lg" />
      )}

    </div>
  );
}

export default ProjectListing;
