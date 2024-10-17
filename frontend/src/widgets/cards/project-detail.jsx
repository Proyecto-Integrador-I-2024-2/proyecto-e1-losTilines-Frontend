import { useProject } from '@/hooks/useProject'; // Asegúrate de que la ruta sea correcta
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
    <Card className={`w-full h-full flex-row ${project.isActive ? 'active' : ''}`}>
      <CardHeader
        shadow={false}
        floated={false}
        className="m-0 w-2/5 shrink-0 rounded-r-none"
      >
        <img
          src={project.image || "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80"}
          alt="project-image"
          className="h-full w-full object-cover"
        />
      </CardHeader>
      <CardBody>
        <Typography variant="h6" color="gray" className="mb-4 uppercase">
          {project.category || 'Category'} {/* Cambia 'Category' por un campo real si lo tienes */}
        </Typography>
        <Typography variant="h4" color="blue-gray" className="mb-2">
          {project.name}
        </Typography>
        <Typography color="gray" className="mb-8 font-normal">
          {project.description}
        </Typography>

        <CardFooter>
        <Typography color="gray" className="mb-8 font-normal">
            <p>Este proyecto está valorado en aproximadamente:{project.budget}</p>
          </Typography>
        </CardFooter>
      </CardBody>
      
    </Card>
  );
}
