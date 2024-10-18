import React, { useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Spinner,
  Typography,
} from "@material-tailwind/react";
import { FreelancerCard, ProjectCard } from "@/widgets/cards";
import { CustomList, CustomListItem } from "@/widgets/horList";
import { IconButton } from "@material-tailwind/react";
import { useFreelancers, useProjects } from "@/hooks";
import { useNavigate } from "react-router-dom";
import { project_pic } from "@/data/placeholder";


const Homepage = () => {
  const { data: projectsData, isLoading: isProjectsLoading } = useProjects();
  const { data: freelancersData, isLoading: isFreelancersLoading } = useFreelancers();

  const navigate = useNavigate();
  const role = sessionStorage.getItem("role");


  if ((role === "Freelancer")) {
    return (
      <div className="justify-center items-center">
        <div className="w-full flex flex-row mt-4 px-4 items-center justify-center">
          <Typography variant="h3">Freelancers you might be interested in</Typography>
        </div>
        <Card className="overscroll-y-none mx-3 mt-4 mb-2 lg:mx-4 border border-blue-gray-100">
          <CardBody className="overscroll-y-none h-full flex flex-row">
            <CustomList
              sectionTitle={""}
              sectionSubtitle={""}
            >
              {freelancersData.map((freelancer, index) => (
                <FreelancerCard key={freelancer.id} freelancer={freelancer} isActive={true} />
              ))}
            </CustomList>
          </CardBody>
        </Card>
      </div >
    );
  } else {
    return (
      <>
        {/* {isProjectsLoading ? <Spinner color="blue" size="large" /> : */}
        <>
          <div className="h-1/2 justify-center items-center">
            <Card className="max-h-full overscroll-y-none mx-3 mt-4 mb-2 lg:mx-4 border border-blue-gray-100">
              <CardBody className="overscroll-y-none h-full flex flex-row">
                <CustomList
                  sectionTitle={""}
                  sectionSubtitle={""}
                >
                  {projects.map((project, index) => (
                    <CustomListItem key={project.id} title={project.title} tag={project.price} description={project.description} img={project.image || project_pic} route={"/project/detail/"} />
                  ))}
                  {/* {projectsData.map((project, index) => (
                      <CustomListItem key={project.id} title={project.name} tag={project.budget} description={project.description} img={project.image || project_pic} route={"/project/details/"} />
                    ))} */}
                </CustomList>
              </CardBody>
            </Card>
          </div >
          {/* <div className="h-1/3 justify-center items-center">
            <Card className="overscroll-y-none mx-3 mt-4 mb-2 lg:mx-4 border border-blue-gray-100">
              <CardBody className="overscroll-y-none h-full flex flex-row">
                <CustomList
                  sectionTitle={""}
                  sectionSubtitle={""}
                >
                  {projects.map((project, index) => (
                    <CustomListItem key={project.id} title={project.title} tag={project.price} description={project.description} img={project.image || project_pic} route={"/project/details/"} />
                  ))}
                </CustomList>
              </CardBody>
            </Card>
          </div > */}
        </>
        {/* } */}
      </>
    );
  }



};

export default Homepage;






const projects = [
  {
    id: 1,
    title: "Project 1",
    description: "Description 1",
    price: "$95.00",
    image: "https://images.unsplash.com/photo-1629367494173-c78a56567877?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=927&q=80",
  },
  {
    id: 2,
    title: "Project 2",
    description: "Description 2",
    price: "$120.00",
    image: "https://images.unsplash.com/photo-1629367494173-c78a56567877?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=927&q=80",
  },
  {
    id: 3,
    title: "Project 3",
    description: "Description 3",
    price: "$150.00",
    image: "https://images.unsplash.com/photo-1629367494173-c78a56567877?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=927&q=80",
  },
  // Agrega más proyectos según sea necesario
];