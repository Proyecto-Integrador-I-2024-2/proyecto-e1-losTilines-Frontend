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
              className="m-0 flex items-center justify-between p-6"
            >
              <div>
                <Typography variant="h6" color="blue-gray" className="mb-1">
                  Projects
                </Typography>
                <Typography
                  variant="small"
                  className="flex items-center gap-1 font-normal text-blue-gray-600"
                >
                  <CheckCircleIcon strokeWidth={3} className="h-4 w-4 text-blue-gray-200" />
                  <strong>30 done</strong> this month
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
                  <MenuItem>Another Action</MenuItem>
                  <MenuItem>Something else here</MenuItem>
                </MenuList>
              </Menu>
            </CardHeader>
            <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">

            </CardBody>
          </Card>
          <Card className="border border-blue-gray-100 shadow-sm max-h-full">
            <CardBody className="my-4  pt-0 h-116">
              <SkillsSection sectionName={"Skills needed"} />
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default ProjectDetail;

