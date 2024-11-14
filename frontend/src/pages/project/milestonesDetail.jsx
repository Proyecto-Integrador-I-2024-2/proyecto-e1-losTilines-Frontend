import { getMilestoneDeliverables, getProjectMilestones } from "@/services";
import { MilestoneCard,} from "@/widgets/cards";
import { ProjectTopBar } from "@/widgets/layout";
import {
  MilestonesCreation,
  MilestonesInfo,
} from "@/widgets/milestonesAndDeliverables";
import { Card, Typography, Button } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { PopUp } from "@/widgets/popUp";
import apiClient from "@/services/apiClient";

export function MilestonesDetail() {
  const { id } = useParams(); // Use to identify the project

  console.log("Milestone project id: ", id);

  const [milestoneID, setMilestoneID] = useState("");
  const [milestones, setMilestones] = useState([]);
  const [deliverables, setDeliverables] = useState([]);

  // State variables for creating a new milestone
  const [openCreateMilestone, setOpenCreateMilestone] = useState(false);

  /*----------------------------- useEffects -----------------------------*/

  // Fetch milestones

  const role = sessionStorage.getItem("role");

  const fetchMilestones = async () => {
    try {
      const milestones = await getProjectMilestones({ id });
      setMilestones(milestones);

      console.log("Milestones on fetch: ", milestones);
    } catch (error) {
      console.error("Error fetching milestones:", error);
    }
  };

  useEffect(() => {
    fetchMilestones();
  }, [id]);

  // Fetch deliverables

  const fetchDeliverables = async () => {
    console.log("Milestone ID selected: ", milestoneID);

    try {
      const deliverables = await getMilestoneDeliverables({ id: milestoneID });
      setDeliverables(deliverables);
    } catch (error) {
      console.error("Error fetching deliverables:", error);
    }
  };

  useEffect(() => {
    if (milestoneID) {
      fetchDeliverables();
    }
  }, [milestoneID]);

  /*-----------------------------Handlers-----------------------------*/

  function handleMilestoneClick(id) {
    setMilestoneID(id);
  }

  // Handler for opening/closing the create milestone pop-up
  const handleOpenCreateMilestone = () =>
    setOpenCreateMilestone(!openCreateMilestone);

  return (
    <div className=" w-full h-full overflow-hidden  py-4 ">
      {/* <ProjectTopBar projectId={id} /> */}
      <div className="flex flex-row w-full h-full space-x-4  ">
        {/* Section 1: Milestones */}

        <div className="flex flex-col h-full justify-center items-center w-1/3   ">
          <Card className="flex flex-col items-center ju h-full w-full px-4 pb-2 pt-6    ">
            <Typography variant="h4" color="blue-gray">
              Milestones
            </Typography>
            <div className="flex flex-col w-full h-full justify-start items-center overflow-scroll">
              {milestones.length > 0 ? (
                milestones.map((milestone) => (
                  <MilestoneCard
                    key={milestone.id}
                    milestone={milestone}
                    onClick={() => handleMilestoneClick(milestone.id)}
                  />
                ))
              ) : (
                <Typography
                  variant="h6"
                  color="gray"
                  className="flex flex-col justify-start items-center mt-4"
                >
                  There are no milestones available.
                </Typography>
              )}
            </div>

            {role === "Freelanceer" && (
              <footer className="flex flex-row justify-center items-center w-full  mt-2">
                {/* Button to open the create milestone pop-up */}
                <Button
                  variant="text"
                  color="cyan"
                  onClick={handleOpenCreateMilestone}
                >
                  Propose Milestone
                </Button>
              </footer>
            )}
          </Card>
        </div>

        {/* Section 2: Milestone and deliverables info */}

        <main className="flex flex-col justify-start w-2/3 h-full   ">
          {milestones && milestones.length > 0 ? (
            <MilestonesInfo
              fetchMilestones={fetchMilestones}
              milestone={milestones.find(
                (milestone) => milestone.id === milestoneID
              )}
              deliverables={deliverables}
              fetchDeliverables={fetchDeliverables}
            />
          ) : (
            <Card className="p-4 flex flex-col justify-center items-center h-full">
              <button
                className="w-fit h-fit opacity-40 transform transition-transform duration-300 hover:-translate-y-2"
                onClick={handleOpenCreateMilestone}
              >
                <img
                  src="/img/company/add.png"
                  alt="add button"
                  className="w-24 h-24"
                />
              </button>
            </Card>
          )}
        </main>
      </div>
      {/* Pop-up for creating a new milestone */}
      <MilestonesCreation
        openCreateMilestone={openCreateMilestone}
        handleOpenCreateMilestone={handleOpenCreateMilestone}
        setOpenCreateMilestone={setOpenCreateMilestone}
        fetchMilestones={fetchMilestones}
        projectId={id}
      />
    </div>
  );
}

export default MilestonesDetail;
