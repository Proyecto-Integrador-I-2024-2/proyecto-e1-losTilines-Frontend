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

export function MilestoneCard({ milestone, onClick }) {

  const milestone_pic = "https://i.pinimg.com/564x/3c/9e/4b/3c9e4b32b67d641965915ee08db63844.jpg"

  return (
    <Card color="transparent" shadow={true} className="w-full transform transition-transform duration-300 hover:scale-95" onClick={() => onClick(milestone.id)}>
      <CardHeader
        color="transparent"
        floated={false}
        shadow={false}
        className="mx-0 flex flex-col  items-center justify-center p-4"
      >
            <Typography variant="" color="blue-gray">
              {milestone.name} {/* Muestra el título del milestone */}
            </Typography>
    

      </CardHeader>
    </Card>
  );
}

export default MilestoneCard;
