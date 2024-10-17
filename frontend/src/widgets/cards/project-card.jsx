import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";
import { Link } from "react-router-dom";
export function ProjectCard({ project, isActive }) {
  return (
    <Card
      className={`transition-transform duration-300 ease-in-out ${isActive ? "scale-110" : "scale-90 blur-sm"
        } w-96`}
    >
      <CardHeader shadow={false} floated={false} className="h-96">
        <img
          src={project.image || "https://i.pinimg.com/originals/d6/62/39/d66239c5145af6335cb3e9196a4c06b6.gif"}
          alt="card-image"
          className="h-full w-full object-cover"
        />
      </CardHeader>
      <CardBody>
        <div className="mb-2 flex items-center justify-between">
          <Typography color="blue-gray" className="font-medium">
            {project.name}
          </Typography>
          <Typography color="blue-gray" className="font-medium">
            {project.budget}
          </Typography>
        </div>
        <Typography
          variant="small"
          color="gray"
          className="font-normal opacity-75"
        >
          {project.description}
        </Typography>
      </CardBody>
      <CardFooter className="pt-0">
        <Link to="/project/detail/">

          <Button
            ripple={false}
            fullWidth={true}
            className="bg-blue-gray-900/10 text-blue-gray-900 shadow-none hover:scale-105 hover:shadow-none focus:scale-105 focus:shadow-none active:scale-100"
          >
            Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
