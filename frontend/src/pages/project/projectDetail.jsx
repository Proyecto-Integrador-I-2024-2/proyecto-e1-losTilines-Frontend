// ProjectDetail.jsx

import React, { useEffect } from "react";
import {
  Card,
  CardBody,
  Typography,
} from "@material-tailwind/react";
import { SkillsSection } from "@/widgets/custom";
import { ProjectView } from "@/widgets/cards";
import { useParams, useNavigate } from "react-router-dom";
import { useQueryParams } from "@/hooks";
import { useProject } from "@/hooks";
import { ProjectTopBar } from "@/widgets/layout";

export function ProjectDetail() {
  const navigate = useNavigate();
  const { getParams } = useQueryParams();
  const { id } = useParams();
  console.log("ID del proyecto:", id); // Para depuración

  // Obtener la información del proyecto usando el hook
  const { data: project, isLoading, error } = useProject(id);

  useEffect(() => {
    const projectIdFromQuery = getParams().get('project');
    if (projectIdFromQuery && projectIdFromQuery !== id) {
      console.log(`Redirigiendo a la ID del proyecto desde query params: ${projectIdFromQuery}`);
      navigate(`/project/detail/${projectIdFromQuery}`);
    }
  }, [getParams, navigate, id]);

  // Manejo de estado de carga y error
  if (isLoading) {
    return <Typography variant="h6" color="gray">Cargando detalles del proyecto...</Typography>;
  }

  if (error) {
    console.error('Error fetching project:', error);
    return <Typography variant="h6" color="red">Error al cargar el proyecto: {error.message}</Typography>;
  }

  // Verifica si project existe antes de intentar acceder a sus propiedades
  if (!project) {
    return <Typography variant="h6" color="red">Proyecto no encontrado.</Typography>;
  }

  return (
    <>
      {/* <ProjectTopBar projectId={id} /> */}
      <div className="flex flex-col w-full h-screen gap-2 overflow-hidden bg-origin-padding">
        <div className="flex w-full flex-1 p-5 pb-5">
          <div className="basis-[70%] pr-2 justify-center">
            <ProjectView projectId={id} />
          </div>
          <div className="basis-[30%] pl-2 overflow-y-auto">
            <Card className="border shrink-0 rounded-r-none shadow-sm max-h-full">
              <CardBody className="my-6 h-104 pt-0 pb-10">
                <Typography variant="h5" color="black"> Skills required </Typography>
                <SkillsSection sectionName={" "} skills={project.skills || []} />
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProjectDetail;
