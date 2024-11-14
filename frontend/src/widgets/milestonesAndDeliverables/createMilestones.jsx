import { PopUp } from "../popUp";
import { useEffect, useState } from "react";
import { Input, Typography } from "@material-tailwind/react";
import apiClient from "@/services/apiClient";

export function MilestonesCreation({
  openCreateMilestone,
  handleOpenCreateMilestone,
  setOpenCreateMilestone,
  projectId,
  fetchMilestones,
}) {
  const [newMilestoneName, setNewMilestoneName] = useState("");
  const [newMilestoneDescription, setNewMilestoneDescription] = useState("");
  const [createErrors, setCreateErrors] = useState({});
  const [createSuccessMessage, setCreateSuccessMessage] = useState("");
  const [createErrorMessage, setCreateErrorMessage] = useState("");

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
        project: projectId,
        due_date: getCurrentDate(),
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
      console.error("Error creating milestone:", error);
      setCreateErrorMessage("Failed to create milestone");
    }
  };

  return (
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
            onChange={(event) => setNewMilestoneDescription(event.target.value)}
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
  );
}

const getCurrentDate = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
