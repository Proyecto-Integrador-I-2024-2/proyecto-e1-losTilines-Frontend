import { useEffect } from 'react'; // Importa useEffect
import { useMilestones } from '@/hooks/useMilestones';
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Avatar,
} from "@material-tailwind/react";


export function MilestoneCard({ milestone, onClick }) {


  return (
    <Card color="transparent" shadow={true} className="w-full transform transition-transform duration-300 hover:scale-95" onClick={() => onClick(milestone.id)}>
      <CardHeader
        color="transparent"
        floated={false}
        shadow={false}
        className="mx-0 flex flex-col  items-center justify-center px-4 mb-8"
      >
            <Typography variant="" color="blue-gray">
              {milestone.name} {/* Muestra el título del milestone */}
            </Typography>
    

      </CardHeader>
    </Card>
  );
}

export default MilestoneCard;
