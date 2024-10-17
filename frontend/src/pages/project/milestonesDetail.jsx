import { MilestoneCard, DeliverableCard } from "@/widgets/cards";
import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Avatar,
  } from "@material-tailwind/react";

export function MilestonesDetail( ) {
    return (
        <div className="flex flex-col w-full h-full min-h-0"> 
    
        {/* Sección 2 y 3: Información del Proyecto y Habilidades Requeridas en dos columnas */}
        <div className="flex w-full h-full flex-1 p-5 pb-5"> 
          
          {/* Sección 2: Información del Proyecto (70%) */}
          <div className="basis-[30%] pr-2 w-full h-full overflow-auto"> 
            <MilestoneCard ></MilestoneCard>
            <MilestoneCard ></MilestoneCard>
          </div>
  
          {/* Sección 3: Habilidades Requeridas*/}
          <div className="basis-[70%] pl-2 h-full overflow-auto"> 
            <Card color="transparent" shadow={true} className="w-full">
            <CardHeader
                color="transparent"
                floated={false}
                shadow={false}
                className="mx-0 flex items-center pt-0 pb-8 justify-between">
                <div className="flex w-full flex-col gap-0.5 m-3">
                <div className="flex items-center justify-center">
                    <Typography variant="h5" color="blue-gray">
                    Database desing model
                    </Typography>
                </div>
                <Typography color="blue-gray">The objective of this milestone is to design a comprehensive database model that effectively supports the application's requirements, ensuring data integrity, scalability, and efficiency. </Typography>
                </div>
            </CardHeader>
            <CardBody className="py-0 px-6 h-full">
                <div className="space-y-2 m-4">
                <DeliverableCard></DeliverableCard>
                <DeliverableCard></DeliverableCard>
                <DeliverableCard></DeliverableCard>
                <DeliverableCard></DeliverableCard>
                </div>
            </CardBody>
            </Card>

          </div>
  
        </div>
  
      </div>
    );
  }
  
  export default MilestonesDetail;
  