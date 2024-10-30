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


export function ProfileTopBar({ profile }) {
  const navigate = useNavigate(); // Obtén la función navigate


  return (
    <div className="h-auto pt-5 pr-5 pl-5 justify-center items-center"> {/* flex para alinearlo en una fila */}
      <Card className="border border-blue-gray-100 shadow-sm p-2 w-full"> {/* flex-grow para que ocupe todo el ancho */}
        <CardBody className="p-2"> {/* Reducir padding interno */}
          <Tabs value="app">
            <TabsHeader>
              <Tab value="app">
                <HomeIcon className="-mt-1 mr-2 inline-block h-5 w-5" />
                App
              </Tab>
              <Tab value="message">
                <ChatBubbleLeftEllipsisIcon className="-mt-0.5 mr-2 inline-block h-5 w-5" />
                Message
              </Tab>
              <Tab value="settings">
                <Cog6ToothIcon className="-mt-1 mr-2 inline-block h-5 w-5" />
                Settings
              </Tab>
            </TabsHeader>
          </Tabs>
        </CardBody>
      </Card>
    </div>
  );
}

export default ProfileTopBar;