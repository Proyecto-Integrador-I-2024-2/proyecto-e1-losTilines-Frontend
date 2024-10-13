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
      
      {/* Sección 1: Navegación */}
      <div className="h-auto pt-5 pr-5 pl-5 justify-center items-center"> {/* flex para alinearlo en una fila */}
        <Card className="border border-blue-gray-100 shadow-sm p-2 w-full"> {/* flex-grow para que ocupe todo el ancho */}
          <CardBody className="p-2"> {/* Reducir padding interno */}
            <Tabs value="details">
              <TabsHeader>
                <Tab value="details">
                  <HomeIcon className="-mt-1 mr-2 inline-block h-5 w-5" />
                  Project Detail
                </Tab>
                <Tab value="milestones" onClick={() => navigate('/milestones')}>
                  <ChatBubbleLeftEllipsisIcon className="-mt-0.5 mr-2 inline-block h-5 w-5" />
                  Milestones
                </Tab>
                <Tab value="board">
                  <Cog6ToothIcon className="-mt-1 mr-2 inline-block h-5 w-5" />
                  Board
                </Tab>
              </TabsHeader>
            </Tabs>
          </CardBody>
        </Card>
      </div>

      {/* Sección 2 y 3: Información del Proyecto y Habilidades Requeridas en dos columnas */}
      <div className="flex w-full flex-1 p-5 pb-5"> {/* flex-1 para ocupar el espacio restante */}
        
        {/* Sección 2: Información del Proyecto (70%) */}
        <div className="basis-[70%] pr-2 justify-center"> 
          <ProjectView>

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
