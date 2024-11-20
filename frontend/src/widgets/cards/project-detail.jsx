import { project_pic } from '@/data/placeholder';
import { useProject } from '@/hooks/projects/useProject'; // Asegúrate de que la ruta sea correcta
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  CardFooter,
} from "@material-tailwind/react";

export function ProjectView({ projectId }) {
  // Llamamos al hook useProject con el projectId para obtener los datos del proyecto
  const { data: project, isLoading, error } = useProject(projectId);

  // Mostrar estado de carga
  if (isLoading) {
    return <div>Loading project details...</div>;
  }

  // Mostrar mensaje de error
  if (error) {
    return <div>Error loading project: {error.message}</div>;
  }

  // Renderizamos el componente solo si tenemos los datos del proyecto
  return (
    <Card
      className={`w-full h-full flex flex-row bg-white shadow-lg rounded-lg overflow-hidden transform transition-all hover:shadow-xl ${project.isActive ? 'border-l-4 border-blue-500' : ''}`}
    >
      <CardHeader
        shadow={false}
        floated={false}
        className="m-0 w-2/5 shrink-0 rounded-r-none overflow-hidden"
      >
        <img
          src={project.image || project_pic}
          alt="project-image"
          className="h-full w-full object-cover"
        />
      </CardHeader>
      <CardBody className="p-6">
        <Typography variant="h6" color="gray" className="mb-2 uppercase text-sm tracking-wide">
          {project.category || 'Category'}
        </Typography>
        <Typography variant="h4" color="blue-gray" className="mb-4 font-semibold">
          {project.name}
        </Typography>
        <Typography variant='h5' color="gray" className="mb-6 text-base leading-relaxed">
          {project.description}
        </Typography>
        <Typography color="blue-gray" className="font-medium text-lg">
          Este proyecto está valorado en aproximadamente: <span className="text-blue-600">${project.budget}</span>
        </Typography>
      </CardBody>
    </Card>
  );
}
