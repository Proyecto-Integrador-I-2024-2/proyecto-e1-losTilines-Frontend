import { getMilestoneDeliverables, getProjectMilestones } from "@/services";
import { MilestoneCard, DeliverableCard } from "@/widgets/cards";
import { ProjectTopBar } from "@/widgets/layout";
import { MilestonesInfo } from "@/widgets/milestones";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Avatar,
  Button,
  Input,
} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { PopUp } from "@/widgets/popUp";
import apiClient from "@/services/apiClient";

export function MilestonesDetail() {
  const { id } = useParams();

  console.log("Milestone project id: ", id);

  const [milestoneID, setMilestoneID] = useState("");
  const [milestones, setMilestones] = useState([]);
  const [deliverables, setDeliverables] = useState([]);

  // State variables for creating a new milestone
  const [openCreateMilestone, setOpenCreateMilestone] = useState(false);
  const [newMilestoneName, setNewMilestoneName] = useState("");
  const [newMilestoneDescription, setNewMilestoneDescription] = useState("");
  const [createErrors, setCreateErrors] = useState({});
  const [createSuccessMessage, setCreateSuccessMessage] = useState("");
  const [createErrorMessage, setCreateErrorMessage] = useState("");

  /*----------------------------- useEffects -----------------------------*/

  // Fetch milestones

  const fetchMilestones = async () => {
    try {
      const milestones = await getProjectMilestones({ id });
      setMilestones(milestones);
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

  // Handler for creating a new milestone
  const handleCreateMilestone = async () => {
    // Clear previous messages
    setCreateErrors({});
    setCreateSuccessMessage("");
    setCreateErrorMessage("");

    // Validate inputs
    const newErrors = {};
    if (!newMilestoneName || newMilestoneName.trim() === "") {
      newErrors.name = "Name is required";
    }
    if (!newMilestoneDescription || newMilestoneDescription.trim() === "") {
      newErrors.description = "Description is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setCreateErrors(newErrors);
      return;
    }

    // Submit the create via axios (URL can be adjusted later)
    try {
      const response = await apiClient.post(`/milestones/`, {
        name: newMilestoneName,
        description: newMilestoneDescription,
        project_id: id, // Assuming you need to associate the milestone with the project
      });

      setCreateSuccessMessage("Milestone created successfully");
      // Optionally update the milestones list
      fetchMilestones(); // Refresh the milestones list
      // Close the pop-up after some time or immediately
      setOpenCreateMilestone(false);
      // Reset the input fields
      setNewMilestoneName("");
      setNewMilestoneDescription("");
    } catch (error) {
      setCreateErrorMessage("Failed to create milestone");
    }
  };

  return (
    <>
      {/* <ProjectTopBar projectId={id} /> */}
      <div className="flex flex-row w-full h-full min-h-0 p-5 space-x-4 ">
        {/* Section 1: Milestones */}

        <Card className="flex flex-col w-1/3 h-full pb-4 px-4">
          <div className="flex-grow flex-col justify-start overflow-auto">
            {milestones.length > 0 ? (
              milestones.map((milestone) => (
                <MilestoneCard
                  key={milestone.id}
                  milestone={milestone}
                  onClick={() => handleMilestoneClick(milestone.id)}
                />
              ))
            ) : (
              <Typography variant="h6" color="gray">
                There are no milestones available.
              </Typography>
            )}
          </div>

          <footer className="flex flex-row justify-center items-center w-full h-auto mt-2">
            {/* Button to open the create milestone pop-up */}
            <Button variant="text" onClick={handleOpenCreateMilestone}>
              Propose Milestone
            </Button>
          </footer>
        </Card>

        {/* Section 2: Milestone and deliverables info */}
        <main className="flex flex-col w-2/3 h-full">
          {milestoneID && milestones && deliverables && (
            <MilestonesInfo
              milestone={milestones.find(
                (milestone) => milestone.id === milestoneID
              )}
              deliverables={deliverables}
            />
          )}
        </main>
      </div>

      {/* Pop-up for milestone creation */}
      <PopUp
        title={"Propose New Milestone"}
        submitFunc={handleCreateMilestone}
        open={openCreateMilestone}
        setOpen={setOpenCreateMilestone}
        handleOpen={handleOpenCreateMilestone}
        isFit={true}
      >
        <main className="flex flex-col w-full px-6 justify-start items-center md:px-32">
          <section className="flex flex-col w-full items-center justify-start my-4 space-y-4">
            {/* Name input */}
            <Typography color="gray">Enter the milestone's name:</Typography>
            <Input
              value={newMilestoneName}
              onChange={(event) => setNewMilestoneName(event.target.value)}
              error={!!createErrors.name}
              helperText={createErrors.name}
              label="Name"
            />

            {/* Description input */}
            <Typography color="gray">
              Enter the milestone's description:
            </Typography>
            <Input
              value={newMilestoneDescription}
              onChange={(event) =>
                setNewMilestoneDescription(event.target.value)
              }
              error={!!createErrors.description}
              helperText={createErrors.description}
              label="Description"
            />

            {/* Feedback messages */}
            {createSuccessMessage && (
              <Typography color="green" className="mt-2">
                {createSuccessMessage}
              </Typography>
            )}
            {createErrorMessage && (
              <Typography color="red" className="mt-2">
                {createErrorMessage}
              </Typography>
            )}
          </section>
        </main>
      </PopUp>
    </>
  );
}

export default MilestonesDetail;
