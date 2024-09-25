import React, { useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Typography,
} from "@material-tailwind/react";
import { FreelancerCard, ProjectCard } from "@/widgets/cards";
import { CustomList } from "@/widgets/horList";
import { CustomListItem } from "@/widgets/horList";
import { projectsData } from "@/data";
import { IconButton } from "@material-tailwind/react";
const Homepage = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = (direction) => {
    const newIndex = (activeIndex + direction + projectsData.length) % projectsData.length;
    setActiveIndex(newIndex);
  };

  const handleSeeMore = () => {
    window.location.href = "";
  };

  return (
    <div className="justify-center items-center">
      <div className="w-full flex flex-row mt-4 px-4 justify-between">
        <IconButton onClick={() => handleScroll(-1)}>
          <i className="fa-solid fa-arrow-left" />
        </IconButton>
        <Typography variant="h3">Projects you might be interested in</Typography>
        <IconButton onClick={() => handleScroll(1)}>
          <i className="fa-solid fa-arrow-right" />
        </IconButton>
        {/* <Button  className="h-12 w-12 bg-gray-200 p-2"></Typography></Button> */}
      </div>
      <Card className="overscroll-y-none mx-3 mt-4 mb-2 lg:mx-4 border border-blue-gray-100">
        <CardBody className="overscroll-y-none h-full flex flex-row">
          <CustomList
            sectionTitle={""}
            sectionSubtitle={""}
          >
            {projectsData.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                isActive={index === activeIndex}
              />
              // <CustomListItem key={project.id}
              //   {...project}
              // />
            ))}
          </CustomList>
        </CardBody>
      </Card>
    </div >

  );
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