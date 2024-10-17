import { useEffect } from 'react'; // Importa useEffect
import { useMilestones } from '@/hooks/useMilestones'; 
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Avatar,
} from "@material-tailwind/react";

function StarIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-5 w-5 text-yellow-700"
    >
      <path
        fillRule="evenodd"
        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function MilestoneCard() {
  const { data: milestones, isLoading, error } = useMilestones(); // Asegúrate de pasar projectId al hook

  // useEffect para verificar el estado de carga y los datos
  useEffect(() => {
    if (!isLoading && milestones) {
      console.log('Milestones:', milestones);
    } else if (isLoading) {
      console.log('Loading milestones...');
    } else if (error) {
      console.error('Error loading milestones:', error.message);
    }
  }, [isLoading, milestones, error]); // Dependencias del useEffect

  if (isLoading) {
    return <div>Loading milestones...</div>;
  }

  if (error) {
    return <div>Error loading milestones: {error.message}</div>;
  }

  return (
    <Card color="transparent" shadow={true} className="w-full transform transition-transform duration-300 hover:scale-95">
      <CardHeader
        color="transparent"
        floated={false}
        shadow={false}
        className="mx-0 flex items-center gap-4 pt-0 pb-8"
      >
        <div className="flex w-full flex-col gap-0.5 m-2">
          <div className="flex items-center justify-between">
            <Typography variant="h5" color="blue-gray">
              {milestones.name} {/* Muestra el título del milestone */}
            </Typography>

            <Avatar
              size="lg"
              variant="circular"
              src={milestones.profile_picture} // Asegúrate de que este campo exista
              alt={milestones.name} // Asegúrate de que este campo exista
            />
          </div>
          <Typography color="blue-gray">{milestones.description}</Typography> {/* Muestra la descripción */}
        </div>
      </CardHeader>
    </Card>
  );
}

export default MilestoneCard;
