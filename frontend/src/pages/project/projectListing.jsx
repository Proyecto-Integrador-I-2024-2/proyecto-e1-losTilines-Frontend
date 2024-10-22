import { ProjectCard } from "@/widgets/cards";
import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button
} from "@material-tailwind/react"; 
import { useProjects } from "@/hooks";
import { useNavigate } from "react-router-dom";
import { AddProject } from "@/widgets/popUp";

export function ProjectListing() {
  const { data: projectsData, isLoading: isProjectsLoading } = useProjects();
  const [activeIndex, setActiveIndex] = useState(true);
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleOpen = () => {
    setDialogOpen(true);
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
        <div className="flex w-full h-full flex-1 p-5 pb-5 ">
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
                  Añade un nuevo proyecto
                </Typography>
              </CardHeader>
              <CardBody className="px-4 py-8 flex flex-col items-center">
                <Typography color="gray" className="mb-4 text-center">
                  Si tienes una idea innovadora, no dudes en agregarla a nuestra lista de proyectos.
                </Typography>
                <Button onClick={handleOpen} variant="gradient">
                  Create Project
                </Button>
                <AddProject open={dialogOpen} setOpen={setDialogOpen} color="purple" size="lg" ripple={true} className="rounded-full shadow-lg">
                  + Añadir Proyecto
                </AddProject>
              </CardBody>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectListing;
