import React from "react";
import {
  Card,
  CardBody,
  Typography,
  Tabs,
  TabsHeader,
  Tab
} from "@material-tailwind/react";
import { HomeIcon, Cog6ToothIcon, ChatBubbleLeftEllipsisIcon } from "@heroicons/react/24/solid";
import { SkillsSection } from "@/widgets/custom"; 
import { ProjectView } from "@/widgets/cards";
import { useNavigate } from "react-router-dom"; // Importa useNavigate


export function ProjectDetail() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col w-full h-screen gap-2 overflow-hidden bg-origin-padding"> {/* Usar overflow-hidden para evitar el scroll innecesario */}

      {/* Sección 2 y 3: Información del Proyecto y Habilidades Requeridas en dos columnas */}
      <div className="flex w-full flex-1 p-5 pb-5"> {/* flex-1 para ocupar el espacio restante */}
        
        {/* Sección 2: Información del Proyecto (70%) */}
        <div className="basis-[70%] pr-2 justify-center"> 
          <ProjectView projectId={2}>

          </ProjectView>
        </div>

        {/* Sección 3: Habilidades Requeridas*/}
        <div className="basis-[30%] pl-2 overflow-y-auto"> {/* Eliminar h-screen para evitar desplazamiento innecesario */}
          <Card className="border shrink-0 rounded-r-none shadow-sm max-h-full">
              <CardBody className="my-6 h-104 pt-0 pb-10">
                <Typography variant="h5" color="black"> Skills needed </Typography>
                <SkillsSection sectionName={""} />
              </CardBody>
            </Card>
        </div>

      </div>

    </div>
  );
}

export default ProjectDetail;
