import { useNavigate } from "react-router-dom"; // Importa useNavigate
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


export function ProjectTopBar({ projectId }) {
  const [openNav, setOpenNav] = React.useState(false);
  const navigate = useNavigate(); // Obtén la función navigate

  React.useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpenNav(false)
    );
  }, []);

  return (
    <div className="h-auto pt-5 pr-5 pl-5 justify-center items-center"> {/* flex para alinearlo en una fila */}
      <Card className="border border-blue-gray-100 shadow-sm p-2 w-full"> {/* flex-grow para que ocupe todo el ancho */}
        <CardBody className="p-2"> {/* Reducir padding interno */}
          <Tabs value="details">
            <TabsHeader>
              <Tab id="porjectDetails" value="details" onClick={() => navigate(`/project/detail/${projectId}`)}>
                <HomeIcon className="-mt-1 mr-2 inline-block h-5 w-5" />
                Project Detail
              </Tab>
              <Tab id="milestones" value="milestones" onClick={() => navigate(`/project/milestones/${projectId}`)}>
                <ChatBubbleLeftEllipsisIcon className="-mt-0.5 mr-2 inline-block h-5 w-5" />
                Milestones
              </Tab>
       
            </TabsHeader>
          </Tabs>
        </CardBody>
      </Card>
    </div>
  );
}

export default ProjectTopBar;