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
  IconButton,
} from "@material-tailwind/react";
import { useWorkerProjects } from "@/hooks/projects/useWorkerProjects";
import { useFreelancerProjects } from "@/hooks/projects/useFreelancerProjects";
import { AddProject, PopUp } from "@/widgets/popUp";
import { useNavigate } from "react-router-dom";
// import { projectsData } from "@/data";
import { PlusIcon } from "@heroicons/react/24/outline";
import { createProject } from "@/services";
import { useQueryClient } from "@tanstack/react-query";
import apiClient from "@/services/apiClient";

export function ProjectListing() {
  const role = sessionStorage.getItem("role");
  const [userType, setUserType] = useState(role);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const navigateTo = useNavigate();
  const queryClient = useQueryClient();
  const id = sessionStorage.getItem("id");

  const [isProjectsLoading, setIsProjectsLoading] = useState(true);
  const [projectsData, setProjectsData] = useState([]);
  const [error, setError] = useState(null);
  const [refetch, setRefetch] = useState(false);


  const rolesTypes = [
    "Freelancer",
    "Business Manager",
    "Area Admin",
    "Project Manager",
  ];
  const rolesMap = {
    "Freelancer": "user",
    "Business Manager": "company_user",
    "Area Admin": "area_user",
    "Project Manager": "user",
  };

  async function fetchProjectsByRole() {
    var userUrl = rolesMap[role];
    setIsProjectsLoading(true);
    try {
      const { data, status } = await apiClient.get(
        `projects/?${userUrl}=${id}`
      );

      if (status !== 200) {
        throw new Error("Error fetching projects by role");
      }

      setProjectsData(data);
      setIsProjectsLoading(false);

    } catch (error) {
      console.error("Error fetching projects by role: ", error);
      setErrorDialogOpen(true);
    }
  }

  useEffect(() => {
    if (role) {
      setUserType(role);
      fetchProjectsByRole();
    }
  }, [role, refetch]);



  console.log("Usertype", userType);

  const handleOpen = () => {
    setDialogOpen((prev) => !prev);
  };

  async function handleCreateProject(projectData) {
    const data = await createProject({ body: projectData });
    if (data.error) {
      console.error("Error creating project inside listing: ", data.error);
      setErrorDialogOpen(true);
      // return;
    }
    // Si no hay error, puedes continuar con el procesamiento del proyecto creado
    console.log("Project created successfully:", data);

    setRefetch((prev) => !prev);
  }

  const handleProjectNavigate = (id) => {
    navigateTo(`/project/detail/${id}`); // Agregar el ID del proyecto en la URL
  };

  return (
    <div className="flex flex-col w-full h-full justify-center">
      {/* Título de la página */}
      <div className="w-full mt-4 text-center">
        <Typography
          variant="h2"
          color="blue-gray"
          className="font-bold tracking-wide w-full"
        >
          Your projects
        </Typography>
      </div>

      {isProjectsLoading ? (
        <div className="flex justify-center items-center w-full max-h-min">
          <Typography variant="h6" color="gray">
            Cargando proyectos...
          </Typography>
        </div>
      ) : (
        <div className="w-full pb-5">
          {/* Sección 1: Tarjetas de Proyecto */}
          {projectsData && projectsData.length > 0 ? (
            <div className="p-8 gap-14 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 justify-between overflow-y-auto">
              {projectsData.map((project, index) => (
                <div key={index} className="pb-2 ">
                  <BigProjectCard
                    project={project}
                    handleNavigate={handleProjectNavigate}
                    isActive={true}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-row justify-center items-center w-full max-h-min">
              <Typography variant="h6" color="light-blue">
                You don't have associated projects. Please, explore our
                marketplace!{" "}
              </Typography>
            </div>
          )}
        </div>
      )}

      {userType && userType != "Freelancer" && (
        <div className="fixed bottom-8 right-8">
          <SpeedDial>
            <SpeedDialHandler>
              <IconButton
                size="lg"
                className="rounded-full"
                onClick={handleOpen}
              >
                <PlusIcon className="h-5 w-5 transition-transform group-hover:rotate-45" />
              </IconButton>
            </SpeedDialHandler>
          </SpeedDial>
        </div>
      )}
      {userType != "Freelancer" && (
        <AddProject
          open={dialogOpen}
          setOpen={setDialogOpen}
          handleCreateProject={handleCreateProject}
          size="lg"
          ripple={true}
          className="rounded-full shadow-lg"
        />
      )}
      <PopUp
        title={"Project Creation Error"}
        open={errorDialogOpen}
        setOpen={setErrorDialogOpen}
        handleOpen={() => setErrorDialogOpen((prev) => !prev)}
        isFit={true}
        disableSubmit={true}
      >
        <div className="flex flex-col items-center justify-center w-full">
          <Typography variant="h3" color="red">
            Error creating project
          </Typography>
          <Typography variant="h6" color="gray">
            There was an error creating the project. Please try again later.
          </Typography>
        </div>
      </PopUp>
    </div>
  );
}

export default ProjectListing;
