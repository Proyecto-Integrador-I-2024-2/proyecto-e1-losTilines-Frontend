import { getMilestoneDeliverables, getProjectMilestones } from "@/services";
import { MilestoneCard, DeliverableCard } from "@/widgets/cards";
import { ProjectTopBar } from "@/widgets/layout";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Avatar,
} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";


export function MilestonesDetail() {

  const { id } = useParams();

  console.log("ID del proyecto en milestones:", id);

  const [milestoneID, setMilestoneID] = useState("");
  const [milestones, setMilestones] = useState([]);
  const [deliverables, setDeliverables] = useState([]);

  useEffect(() => {
    const fetchMilestones = async () => {
      try {
        const milestones = await getProjectMilestones({ id });
        setMilestones(milestones);
      } catch (error) {
        console.error('Error fetching milestones:', error);
      }
    }

    const fetchDeliverables = async () => {
      try {
        const deliverables = await getMilestoneDeliverables({ id });
        setDeliverables(deliverables);
      } catch (error) {
        console.error('Error fetching deliverables:', error);
      }
    }

    fetchMilestones();
    fetchDeliverables();
  }, [id, milestoneID])


  function handleMilestoneClick(id) {
    setMilestoneID(id);
  }

  return (
    <>
      {/* <ProjectTopBar projectId={id} /> */}
      <div className="flex flex-col w-full h-full min-h-0">

        {/* Sección 2 y 3: Información del Proyecto y Habilidades Requeridas en dos columnas */}
        <div className="flex w-full h-full flex-1 p-5 pb-5">

          {/* Sección 2: Información del Proyecto (70%) */}
          <div className="basis-[30%] pr-2 w-full h-full overflow-auto">
            {milestones.length > 0 ? milestones.map((milestone) => (<MilestoneCard milestone={milestone} onClick={handleMilestoneClick} />))
              : <Typography variant="h6" color="gray">There is no milestones available.</Typography>}
          </div>

          {/* Sección 3: Habilidades Requeridas*/}
          {
            (milestoneID && milestones.length > 0) && (
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
                          {milestoneID ? milestones.find(milestone => milestone.id === milestoneID).name : "Milestone Name"} {/* Muestra el título del milestone */}
                        </Typography>
                      </div>
                      <Typography color="blue-gray">
                        {milestoneID ? milestones.find(milestone => milestone.id === milestoneID).description : "Milestone description"} {/* Muestra el título del milestone */}
                      </Typography>
                    </div>
                  </CardHeader>
                  <CardBody className="py-0 px-6 h-full">
                    <div className="space-y-2 m-4">
                      {
                        deliverables?.length > 0 ? deliverables.map((deliverable) => (
                          <DeliverableCard deliverable={deliverable} />
                        )
                        ) : <Typography variant="h6" color="gray">There is no deliverables available.</Typography>
                      }

                    </div>
                  </CardBody>
                </Card>

              </div>
            )
          }

        </div>
      </div>
    </>
  );
}

export default MilestonesDetail;
