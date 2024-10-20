import { project_pic } from "@/data/placeholder";
import { Card, CardHeader, CardBody, Typography, Button } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";

export function ProjectCard({ project, onCardClick }) {
  const navigate = useNavigate();

  return (
    <Card
      className="w-48 max-w-xs p-3 shadow-lg rounded-lg transition-transform duration-300 hover:scale-105 hover:shadow-xl cursor-pointer"
      onClick={() => onCardClick(project.id)}
    >
      <div className="h-32 w-32 mx-auto mb-4 rounded-lg overflow-hidden">
        <img
          src={project.image || project_pic}
          alt={project.name || "Project Name"}
          className="h-full w-full object-cover"
        />
      </div>
      <CardBody className="p-0 text-center">
        <Typography variant="h6" className="text-blue-gray-900 mb-2 overflow-hidden">
          {project.name || "Project Name"}
        </Typography>
        <Typography color="blue-gray" className="text-sm mb-2 overflow-hidden">
          {project.description.slice(0, 60) || "No description available"}...
        </Typography>
        <Typography variant="small" color="blue-gray" className="font-medium">
          Budget: ${project.budget || "0"}
        </Typography>
      </CardBody>
    </Card>
  );
}
