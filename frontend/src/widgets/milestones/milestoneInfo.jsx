import React, { useState } from "react";
import {
  Card,
  Typography,
  CardHeader,
  CardBody,
  Button,
  Input,
} from "@material-tailwind/react";
import { DeliverableCard } from "../cards";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import { PopUp } from "../popUp";
import apiClient from "@/services/apiClient";

export function MilestonesInfo({ milestone, deliverables }) {
  const [openEdit, setOpenEdit] = useState(false); // For edit pop-up
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false); // For delete confirmation pop-up

  // State variables for editing milestone
  const [nameEdit, setNameEdit] = useState(milestone.name);
  const [descriptionEdit, setDescriptionEdit] = useState(milestone.description);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // State variables for creating a deliverable
  const [openCreateDeliverable, setOpenCreateDeliverable] = useState(false);
  const [newDeliverableName, setNewDeliverableName] = useState("");
  const [newDeliverableDescription, setNewDeliverableDescription] = useState("");
  const [createErrors, setCreateErrors] = useState({});
  const [createSuccessMessage, setCreateSuccessMessage] = useState("");
  const [createErrorMessage, setCreateErrorMessage] = useState("");

  // Handler for opening/closing the edit pop-up
  const handleOpenEdit = () => setOpenEdit(!openEdit);

  // Handler for editing the milestone
  const handleEdit = async () => {
    // Clear previous messages
    setErrors({});
    setSuccessMessage("");
    setErrorMessage("");

    // Validate inputs
    const newErrors = {};
    if (!nameEdit || nameEdit.trim() === "") {
      newErrors.name = "Name is required";
    }
    if (!descriptionEdit || descriptionEdit.trim() === "") {
      newErrors.description = "Description is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Submit the edit via axios (URL can be adjusted later)
    try {
      const response = await apiClient.put(`/milestones/${milestone.id}/`, {
        name: nameEdit,
        description: descriptionEdit,
      });

      setSuccessMessage("Milestone updated successfully");
      // Optionally update the milestone data in parent component if needed
      // Close the pop-up after some time or immediately
      setOpenEdit(false);
    } catch (error) {
      setErrorMessage("Failed to update milestone");
    }
  };

  // Handler for confirming delete
  const handleConfirmDelete = async () => {
    // Clear previous messages
    setErrorMessage("");
    setSuccessMessage("");

    // Submit the delete request via axios (URL can be adjusted later)
    try {
      await apiClient.delete(`/milestones/${milestone.id}/`);
      setSuccessMessage("Milestone deleted successfully");
      // Optionally handle the removal of the milestone from the UI
      setOpenConfirmDelete(false);
    } catch (error) {
      setErrorMessage("Failed to delete milestone");
    }
  };

  // Handler for opening/closing the create deliverable pop-up
  const handleOpenCreateDeliverable = () =>
    setOpenCreateDeliverable(!openCreateDeliverable);

  // Handler for creating a new deliverable
  const handleCreateDeliverable = async () => {
    // Clear previous messages
    setCreateErrors({});
    setCreateSuccessMessage("");
    setCreateErrorMessage("");

    // Validate inputs
    const newErrors = {};
    if (!newDeliverableName || newDeliverableName.trim() === "") {
      newErrors.name = "Name is required";
    }
    if (!newDeliverableDescription || newDeliverableDescription.trim() === "") {
      newErrors.description = "Description is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setCreateErrors(newErrors);
      return;
    }

    // Submit the create via axios (URL can be adjusted later)
    try {
      const response = await apiClient.post(`/deliverables/`, {
        name: newDeliverableName,
        description: newDeliverableDescription,
        milestone_id: milestone.id, // Associate deliverable with the current milestone
      });

      setCreateSuccessMessage("Deliverable created successfully");
      // Optionally update the deliverables list
      // Close the pop-up after some time or immediately
      setOpenCreateDeliverable(false);
      // Reset the input fields
      setNewDeliverableName("");
      setNewDeliverableDescription("");
      // Optionally refresh the deliverables list
    } catch (error) {
      setCreateErrorMessage("Failed to create deliverable");
    }
  };

  return (
    <main className="flex flex-col w-full h-full">
      {milestone && (
        <>
          <Card
            color="transparent"
            shadow={true}
            className="w-full h-full overflow-auto p-5"
          >
            <CardHeader
              color="transparent"
              floated={false}
              shadow={false}
              className="mx-0 flex items-center pt-0 pb-8 justify-between"
            >
              <div className="flex w-full flex-col gap-0.5 m-3 space-y-4">
                <div className="flex flex-row items-center justify-between group">
                  <div></div>
                  <Typography variant="h5" color="blue-gray">
                    {milestone.name
                      ? milestone.name
                      : "Milestone Name is not available"}
                  </Typography>
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      // Open the edit pop-up
                      setOpenEdit(true);
                    }}
                    className="p-0 m-0 focus:outline-none"
                    aria-label="Edit Milestone"
                  >
                    <PencilIcon
                      className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                      color="gray"
                    />
                  </button>
                </div>
                <Typography color="blue-gray">
                  {milestone.description
                    ? milestone.description
                    : "Milestone description is not available"}
                </Typography>
              </div>
            </CardHeader>
            <CardBody className="py-0 px-6 h-full flex flex-col justify-start items-start space-y-2">
              {deliverables?.length > 0 ? (
                deliverables.map((deliverable) => (
                  <DeliverableCard
                    key={deliverable.id}
                    deliverable={deliverable}
                  />
                ))
              ) : (
                <Typography variant="h6" color="gray">
                  There are no deliverables available.
                </Typography>
              )}
            </CardBody>
            <footer className="flex flex-row justify-center items-center w-full h-auto mt-2">
              {/* Button to open the create deliverable pop-up */}
              <Button variant="text" onClick={handleOpenCreateDeliverable}>
                Create Deliverable
              </Button>
            </footer>
          </Card>

          {/* Pop-up for milestone edit */}
          <PopUp
            title={"Edit Milestone Info"}
            submitFunc={handleEdit}
            open={openEdit}
            setOpen={setOpenEdit}
            handleOpen={handleOpenEdit}
            isFit={true}
          >
            <main className="flex flex-col w-full px-6 justify-start items-center md:px-32">
              <section className="flex flex-col w-full items-center justify-start my-4 space-y-4">
                {/* Change name */}
                <Typography color="gray">Change the milestone's name:</Typography>
                <Input
                  value={nameEdit}
                  onChange={(event) => setNameEdit(event.target.value)}
                  placeholder="Enter new name"
                  error={!!errors.name}
                  helperText={errors.name}
                  label="Name"
                />

                {/* Change description */}
                <Typography color="gray">
                  Change the milestone's description:
                </Typography>
                <Input
                  value={descriptionEdit}
                  onChange={(event) => setDescriptionEdit(event.target.value)}
                  placeholder="Enter new description"
                  error={!!errors.description}
                  helperText={errors.description}
                  label="Description"
                />

                {/* Divider */}
                <div className="w-2/3 h-0.5 bg-blue-gray-200"></div>

                {/* Icon to delete */}
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    // Open the delete confirmation pop-up
                    setOpenConfirmDelete(true);
                  }}
                  className="p-0 m-0 focus:outline-none"
                  aria-label="Delete Milestone"
                >
                  <TrashIcon className="h-6 w-6 text-black hover:text-red-500 cursor-pointer transition-colors duration-200" />
                </button>

                {/* Feedback messages */}
                {successMessage && (
                  <Typography color="green" className="mt-2">
                    {successMessage}
                  </Typography>
                )}
                {errorMessage && (
                  <Typography color="red" className="mt-2">
                    {errorMessage}
                  </Typography>
                )}
              </section>
            </main>
          </PopUp>

          {/* Pop-up for milestone deletion */}
          <PopUp
            title={"Confirm Deletion"}
            submitFunc={handleConfirmDelete}
            open={openConfirmDelete}
            setOpen={setOpenConfirmDelete}
            handleOpen={() => {}}
            isFit={true}
          >
            <div className="flex flex-col items-center justify-center">
              <Typography color="gray">
                Are you sure you want to delete this milestone?
              </Typography>

              <Typography color="red">
                {errorMessage ? errorMessage : ""}
              </Typography>

              <Typography color="green">
                {successMessage ? successMessage : ""}
              </Typography>
            </div>
          </PopUp>

          {/* Pop-up for Deliverable creation */}
          <PopUp
            title={"Create New Deliverable"}
            submitFunc={handleCreateDeliverable}
            open={openCreateDeliverable}
            setOpen={setOpenCreateDeliverable}
            handleOpen={handleOpenCreateDeliverable}
            isFit={true}
          >
            <main className="flex flex-col w-full px-6 justify-start items-center md:px-32">
              <section className="flex flex-col w-full items-center justify-start my-4 space-y-4">
                {/* Name input */}
                <Typography color="gray">Enter the deliverable's name:</Typography>
                <Input
                  value={newDeliverableName}
                  onChange={(event) => setNewDeliverableName(event.target.value)}
                  placeholder="Enter name"
                  error={!!createErrors.name}
                  helperText={createErrors.name}
                  label="Name"
                />

                {/* Description input */}
                <Typography color="gray">
                  Enter the deliverable's description:
                </Typography>
                <Input
                  value={newDeliverableDescription}
                  onChange={(event) =>
                    setNewDeliverableDescription(event.target.value)
                  }
                  placeholder="Enter description"
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
      )}
    </main>
  );
}

export default MilestonesInfo;
