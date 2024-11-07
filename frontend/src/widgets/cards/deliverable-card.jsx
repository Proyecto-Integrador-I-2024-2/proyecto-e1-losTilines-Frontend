import React, { useEffect, useState } from "react";
import {
  List,
  ListItem,
  ListItemSuffix,
  Card,
  Typography,
  Input,
} from "@material-tailwind/react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import { PopUp } from "../popUp";
import apiClient from "@/services/apiClient";

export function DeliverableCard({ deliverable }) {
  const [open, setOpen] = useState(false); // For edit pop-up
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false); // For delete confirmation pop-up

  // State variables for editing deliverable
  const [nameEdit, setNameEdit] = useState(deliverable.name);
  const [descriptionEdit, setDescriptionEdit] = useState(deliverable.description);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");


  useEffect(() => {

    console.log("Deliverable ID selected: ", deliverable.description);

  }, [deliverable]);


  const handleOpen = () => setOpen(!open);

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
      const response = await apiClient.put(`/deliverables/${deliverable.id}/`, {
        name: nameEdit,
        description: descriptionEdit,
      });

      setSuccessMessage("Deliverable updated successfully");
      // Optionally update the deliverable data in parent component if needed
      // Close the pop-up after some time or immediately
      setOpen(false);
    } catch (error) {
      setErrorMessage("Failed to update deliverable");
    }
  };

  const handleConfirmDelete = async () => {
    // Clear previous messages
    setErrorMessage("");
    setSuccessMessage("");

    // Submit the delete request via axios (URL can be adjusted later)
    try {
      await apiClient.delete(`/deliverables/${deliverable.id}/`);
      setSuccessMessage("Deliverable deleted successfully");
      // Optionally remove the deliverable from the list in parent component
      setOpenConfirmDelete(false);
    } catch (error) {
      setErrorMessage("Failed to delete deliverable");
    }
  };

  return (
    <>
      <Card className="w-full  mb-4">
        <div className="flex justify-between p-2">
          <div className="w-full ">
          
              <ListItem className="flex flex-row items-center group w-full space-x-2">
                <div className="flex flex-col h-auto w-full">
                  <Typography variant="h6" className="whitespace-normal break-words">
                    {deliverable.name}
                  </Typography>
                  <Typography className="whitespace-normal break-words h-auto w-auto">
                    {deliverable.description}
                  </Typography>
                </div>

                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    // Open the edit pop-up
                    setOpen(true);
                  }}
                  className="p-0 m-0 focus:outline-none"
                  aria-label="Edit Deliverable"
                >
                  <PencilIcon
                    className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                    color="gray"
                  />
                </button>
              </ListItem>
            
          </div>
        </div>
      </Card>

      {/* Pop-up for deliverable edit */}
      <PopUp
        title={"Edit Deliverable Info"}
        submitFunc={handleEdit}
        open={open}
        setOpen={setOpen}
        handleOpen={handleOpen}
        isFit={true}
      >
        <main className="flex flex-col w-full px-6 justify-start items-center md:px-32">
          <section className="flex flex-col w-full items-center justify-start my-4 space-y-4">
            {/* Change name */}
            <Typography color="gray">Change the deliverable's name:</Typography>
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
              Change the deliverable's description:
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
              aria-label="Delete Deliverable"
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

      {/* Pop-up for deliverable deletion */}
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
            Are you sure you want to delete this deliverable?
          </Typography>

          <Typography color="red">
            {errorMessage ? errorMessage : ""}
          </Typography>

          <Typography color="green">
            {successMessage ? successMessage : ""}
          </Typography>
        </div>
      </PopUp>
    </>
  );
}

export default DeliverableCard;
