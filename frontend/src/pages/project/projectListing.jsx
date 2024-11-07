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
import { createProject } from "@/services";
import { useQueryClient } from "@tanstack/react-query";


export function ProjectListing() {
  const [userType, setUserType] = useState();
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigateTo = useNavigate();
  const queryClient = useQueryClient();
  const id = sessionStorage.getItem("id");


  useEffect(() => {
    const storedUserType = sessionStorage.getItem("role");
    setUserType(storedUserType);
  }, []);

  console.log(userType);
  const { data: freelancerProjects, isLoading: isFreelancerProjectsLoading, refetch: freelancerProjectsRefetch } = useFreelancerProjects({ enabled: userType === "Freelancer" });
  const { data: workerProjects, isLoading: isWorkerProjectsLoading, refetch: workerProjectsRefetch } = useWorkerProjects({ enabled: userType === "Business Manager" });

  const projectsData = userType === "Freelancer" ? freelancerProjects : workerProjects;
  const isProjectsLoading = userType === "Freelancer" ? isFreelancerProjectsLoading : isWorkerProjectsLoading;

  const handleOpen = () => {
    setDialogOpen(prev => !prev);
  };

  async function handleCreateProject(projectData) {
    const data = await createProject({ body: projectData });
    if (data.error) {
      console.error("Error creating project inside listing: ", data.error);
      // return;
    }
    // Si no hay error, puedes continuar con el procesamiento del proyecto creado
    console.log("Project created successfully:", data);

    if (userType === "Freelancer") {
      queryClient.invalidateQueries(['freelancer_projects', id]);
      freelancerProjectsRefetch();
    } else {
      queryClient.invalidateQueries(['worker_projects', id]);
      workerProjectsRefetch();
    }
  }



  const handleProjectNavigate = (id) => {
    navigateTo(`/project/detail/${id}`); // Agregar el ID del proyecto en la URL
  };


  return (
    <div className="flex flex-col w-full h-full justify-center">
      {/* Título de la página */}
      <div className="w-full mt-4 text-center">
        <Typography variant="h2" color="blue-gray" className="font-bold tracking-wide w-full">
          Your projects
        </Typography>
      </div>

      {isProjectsLoading ? (
        <div className="flex justify-center items-center w-full max-h-min">
          <Typography variant="h6" color="gray">Cargando proyectos...</Typography>
        </div>
      ) : (
        <div className="w-full pb-5">
          {/* Sección 1: Tarjetas de Proyecto */}
          {projectsData && projectsData.length > 0 ? (
            <div className="p-8 gap-14 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 justify-between overflow-y-auto">
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
        <AddProject open={dialogOpen} setOpen={setDialogOpen} handleCreateProject={handleCreateProject} size="lg" ripple={true} className="rounded-full shadow-lg" />
      )}

    </div>
  );
}

export default ProjectListing;
