import React from "react";
import {
  Rating,
  Typography,
  Card,
  CardHeader,
  CardBody,
  IconButton,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
  Tooltip,
  Progress,
  Tabs,
  TabsHeader,
  Tab,
  Button
} from "@material-tailwind/react";

import {
  projectsTableData,
  ordersOverviewData,
} from "@/data";


import {
  CheckCircleIcon,
  EllipsisVerticalIcon,
  ArrowUpIcon,
  HomeIcon,
  ChatBubbleLeftEllipsisIcon,
  Cog6ToothIcon,
  CurrencyDollarIcon
} from "@heroicons/react/24/solid";
import { SkillsSection } from "@/widgets/custom";


export function ProjectDetail() {




  return (
    <div className="w-full h-full">
      <div className="mx-3 mt-4 mb-4 lg:mx-4">
        <Card className="inline-flex w-full border border-blue-gray-100 mb-2">
          <CardBody className="h-full p-4">
            {/* Seccion de identifiacion y tabs de herramientas */}
            <div className=" flex items-center justify-between flex-wrap gap-6 h-auto">
              <div className="flex items-center gap-6">
                <Avatar
                  src="/img/bruce-mars.jpeg"
                  alt="bruce-mars"
                  size="xl"
                  variant="rounded"
                  className="rounded-lg shadow-lg shadow-blue-gray-500/40"
                />
                <div>
                  <Typography variant="h5" color="blue-gray" className="mb-1">
                    Richard Davis
                  </Typography>
                  <Typography
                    variant="small"
                    className="font-normal text-blue-gray-600"
                  >
                    CEO / Co-Founder
                  </Typography>
                  <Rating value={4} />
                </div>
              </div>
              {/* Quien soy yo */}
              {true ?
                <div className="w-96">
                  <Tabs value="app">
                    <TabsHeader>
                      <Tab value="app">
                        <HomeIcon className="-mt-1 mr-2 inline-block h-5 w-5" />
                        Details
                      </Tab>
                      <Tab value="message">
                        <ChatBubbleLeftEllipsisIcon className="-mt-0.5 mr-2 inline-block h-5 w-5" />
                        Milestones
                      </Tab>
                      <Tab value="settings">
                        <Cog6ToothIcon className="-mt-1 mr-2 inline-block h-5 w-5" />
                        Settings
                      </Tab>
                    </TabsHeader>
                  </Tabs>
                </div>
                :
                <Button color="light-blue">Apply Now!</Button>
              }
              {/* tabs de config */}
            </div >
          </CardBody>
        </Card>
        <div className="mb-4 grid grid-cols-1 gap-6 xl:grid-cols-3">
          <Card className="overflow-hidden xl:col-span-2 border border-blue-gray-100 shadow-sm">
            <CardHeader
              floated={false}
              shadow={false}
              color="transparent"
              className="m-0 flex items-center justify-between px-6 pt-6 pb-0"
            >
              <div>
                <Typography variant="h4" color="blue-gray" className="mb-1">
                  Docker design project
                </Typography>
                <Typography
                  variant="h6"
                  className="flex items-center gap-1 font-normal text-blue-gray-600"
                >
                  <CurrencyDollarIcon strokeWidth={5} className="h-6 w-6 text-light-green-600" />
                  <strong>30.000.000</strong>
                </Typography>
              </div>
              <Menu placement="left-start">
                <MenuHandler>
                  <IconButton size="sm" variant="text" color="blue-gray">
                    <EllipsisVerticalIcon
                      strokeWidth={3}
                      fill="currenColor"
                      className="h-6 w-6"
                    />
                  </IconButton>
                </MenuHandler>
                <MenuList>
                  <MenuItem>Edit project information</MenuItem>
                  <MenuItem>Add section</MenuItem>
                  <MenuItem>Add something here</MenuItem>
                </MenuList>
              </Menu>
            </CardHeader>
            <CardBody className="flex flex-col items-start justify-between">
              <Typography variant="paragraph" color="black" className="text-lg">
                The "Docker Design Project" at Facebook aimed to overhaul their deployment process by implementing
                Docker's containerization technology. Confronted with inconsistent environments and deployment
                inefficiencies, the project sought to standardize and streamline operations.
                The team, guided by DevOps engineer Alex, crafted a comprehensive Docker strategy that included custom Docker
                images, Docker Compose for multi-container management, and Docker Swarm for scalable orchestration.
                The project involved designing, testing, and integrating Docker into their CI/CD pipeline,
                leading to reduced deployment times and enhanced consistency across environments.
              </Typography>

              <Typography variant="h3" color="light-blue" textGradient className="my-2"> Facebook </Typography>
              <Typography variant="paragraph" color="black" className="text-lg">
                Facebook is a social networking platform that allows users to connect
                communities through posts, photos, and messages.Launched in 2004, it offers features like news
                feeds, events, and groups, enabling users to share updates and interact with others globally.
              </Typography>
            </CardBody>
          </Card>
          <Card className="border border-blue-gray-100 shadow-sm max-h-full">
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

