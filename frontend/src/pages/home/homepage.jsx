import React, { useState } from "react";
import { FreelancerCard, ProjectCard } from "@/widgets/cards";

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

const Homepage = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = (direction) => {
    const newIndex = (activeIndex + direction + projects.length) % projects.length;
    setActiveIndex(newIndex);
  };

  const handleSeeMore = () => {
    window.location.href = "";
  };

  return (
    <div className="flex justify-center items-center h-screen relative">
      <div className="flex overflow-x-auto space-x-4 items-center">
        <button onClick={() => handleScroll(-1)} className="bg-gray-200 rounded p-2">{"<"}</button>
        {projects.map((project, index) => (
          <ProjectCard
            key={project.id}
            project={project}
            isActive={index === activeIndex}
          />
        ))}
        <button onClick={() => handleScroll(1)} className="bg-gray-200 rounded p-2">{">"}</button>
      </div>
      <button 
        onClick={handleSeeMore} 
        className="absolute bottom-5 right-5 bg-blue-600 text-white rounded p-3 hover:bg-blue-700"
      >
        Ver más
      </button>
    </div>
  );
};

export default Homepage;
