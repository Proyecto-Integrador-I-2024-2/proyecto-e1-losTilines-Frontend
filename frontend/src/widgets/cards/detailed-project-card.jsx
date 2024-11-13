import { project_pic } from "@/data/placeholder";
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Typography,
    Button,
} from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";

export function BigProjectCard({ project, isActive, handleNavigate }) {
    const navigateTo = useNavigate();

    return (
        <Card
            className={`transition-transform duration-300 ease-in-out max-h-80 max-w-[80]`}
        >
            <CardHeader shadow={false} floated={false} className="h-96">
                <img
                    src={project.image || project_pic}
                    alt="card-image"
                    className="h-full w-full object-cover"
                />
            </CardHeader>
            <CardBody>
                <div className="mb-2 flex items-center justify-between gap-2">
                    <Typography color="blue-gray" className="font-medium">
                        {project.name}
                    </Typography>
                    <Typography color="blue-gray" className="font-medium">
                        {project.budget}
                    </Typography>
                </div>
                <Typography variant="small" color="gray" className="font-normal opacity-75 overflow-hidden text-ellipsis" style={{
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 2,
                }}
                >
                    {project.description}
                </Typography>
            </CardBody>
            <CardFooter className="pt-0">
                <Button
                    id="details"
                    ripple={false}
                    fullWidth={true}
                    onClick={() => handleNavigate(project.id)} // Usando la función manejadora
                    className="bg-blue-gray-900/10 text-blue-gray-900 shadow-none hover:scale-105 hover:shadow-none focus:scale-105 focus:shadow-none active:scale-100"
                >
                    Details
                </Button>
            </CardFooter>
        </Card>
    );
}