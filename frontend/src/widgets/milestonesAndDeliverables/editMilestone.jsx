import { PopUp } from "../popUp";
import { Typography, Input } from "@material-tailwind/react";
import { useState } from "react";

export function editMilestone() {
  const [nameEdit, setNameEdit] = useState(milestone.name);
  const [descriptionEdit, setDescriptionEdit] = useState(milestone.description);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");




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

  return (
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
  );
}
