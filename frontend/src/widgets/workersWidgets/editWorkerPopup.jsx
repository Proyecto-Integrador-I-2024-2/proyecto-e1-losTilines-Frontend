import React, { useState, useEffect } from "react";
import { PopUp } from "@/widgets/popUp/popUp";
import { Avatar, Input, Typography, Button, Select, Option } from "@material-tailwind/react";
import { TrashIcon } from "@heroicons/react/24/outline";
import { useDeleteWorker, useEditWorker } from "@/hooks/workers";

export function EditWorkerPopup({ open, setOpen, currentWorker, areas }) {
  // State to manage the confirm delete popup
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);

  /*-----------------------------------------------------------------------------*/

  // States to manage and modify the worker's data
  const [emailEdit, setEmailEdit] = useState(
    currentWorker ? currentWorker.email : ""
  );
  const [firstNameEdit, setFirstNameEdit] = useState(
    currentWorker ? currentWorker.first_name : ""
  );
  const [lastNameEdit, setLastNameEdit] = useState(
    currentWorker ? currentWorker.last_name : ""
  );
  
  // State for selected area and role
  const [selectedArea, setSelectedArea] = useState(
    currentWorker ? currentWorker.area : ""
  );
  const [selectedRole, setSelectedRole] = useState(
    currentWorker ? currentWorker.role : "Project Manager"
  );

  // State for form errors
  const [errors, setErrors] = useState({
    email: "",
    firstName: "",
    lastName: "",
    area: "",
    role: "",
  });

  // Reset the input fields when the currentWorker changes
  useEffect(() => {
    setEmailEdit(currentWorker ? currentWorker.email : "");
    setFirstNameEdit(currentWorker ? currentWorker.first_name : "");
    setLastNameEdit(currentWorker ? currentWorker.last_name : "");
    setSelectedArea(currentWorker ? currentWorker.area : "");
    setSelectedRole(currentWorker ? currentWorker.role : "Project Manager");

    setSuccessMessage("");
    setErrorMessage("");
  }, [currentWorker]);

  /*-----------------------------------------------------------------------------*/

  // States to give feedback to the user about operations: delete and edit a worker
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  /*-----------------------------------------------------------------------------*/

  // Function to validate the inputs when editing a worker
  const validate = () => {
    let valid = true;
    let tempErrors = { email: "", firstName: "", lastName: "", area: "", role: "" };

    // Validate first name
    if (!firstNameEdit.trim()) {
      tempErrors.firstName = "First name cannot be empty.";
      valid = false;
    }

    // Validate last name
    if (!lastNameEdit.trim()) {
      tempErrors.lastName = "Last name cannot be empty.";
      valid = false;
    }

    // Validate email
    const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    if (!emailEdit.trim()) {
      tempErrors.email = "Email cannot be empty.";
      valid = false;
    } else if (!emailRegex.test(emailEdit)) {
      tempErrors.email = "Email is not valid.";
      valid = false;
    }

    // Validate selected area
    if (!selectedArea) {
      tempErrors.area = "Please select an area.";
      valid = false;
    }

    // Validate selected role
    if (!selectedRole) {
      tempErrors.role = "Please select a role.";
      valid = false;
    }

    setErrors(tempErrors);
    return valid;
  };

  /*-----------------------------------------------------------------------------*/

  // Handler to edit a worker
  const editWorkerMutation = useEditWorker();

  const handleEdit = () => {
    // Reset feedback messages
    setSuccessMessage("");
    setErrorMessage("");

    // Validate inputs
    if (!validate()) return;

    // Check for changes compared to the current worker's data
    let hasFirstNameChanged = false;
    let hasLastNameChanged = false;
    let hasEmailChanged = false;
    let hasAreaChanged = false;
    let hasRoleChanged = false;

    if (currentWorker) {
      hasFirstNameChanged =
        firstNameEdit.trim() !== currentWorker.first_name.trim();
      hasLastNameChanged =
        lastNameEdit.trim() !== currentWorker.last_name.trim();
      hasEmailChanged =
        emailEdit.trim().toLowerCase() !==
        currentWorker.email.trim().toLowerCase();
      hasAreaChanged = selectedArea !== currentWorker.area;
      hasRoleChanged = selectedRole !== currentWorker.role;
    } else {
      // If no currentWorker, consider all fields as changed
      hasFirstNameChanged = firstNameEdit.trim() !== "";
      hasLastNameChanged = lastNameEdit.trim() !== "";
      hasEmailChanged = emailEdit.trim() !== "";
      hasAreaChanged = selectedArea !== "";
      hasRoleChanged = selectedRole !== "Project Manager";
    }

    // If no changes were made, notify the user
    if (
      !hasFirstNameChanged &&
      !hasLastNameChanged &&
      !hasEmailChanged &&
      !hasAreaChanged &&
      !hasRoleChanged
    ) {
      setErrorMessage("No changes were made.");
      return;
    }

    // Prepare data to patch
    const updatedData = {};
    if (hasFirstNameChanged) updatedData.first_name = firstNameEdit.trim();
    if (hasLastNameChanged) updatedData.last_name = lastNameEdit.trim();
    if (hasEmailChanged) updatedData.email = emailEdit.trim();
    if (hasAreaChanged) updatedData.area = selectedArea;
    if (hasRoleChanged) updatedData.role = selectedRole;

    // Execute the mutation
    if (currentWorker) {
      editWorkerMutation.mutate({ id: currentWorker.id, data: updatedData });
    } else {
      // If no currentWorker, handle creation or simply close the popup
      console.log("No worker selected for editing.");
    }
  };

  /*-----------------------------------------------------------------------------*/

  // Handler to delete a worker
  const deleteWorkerMutation = useDeleteWorker();

  const handleConfirmDelete = async () => {
    if (currentWorker) {
      console.log("Deleting worker:", currentWorker.id);
      deleteWorkerMutation.mutate(currentWorker.id);

      if (deleteWorkerMutation.isError) {
        setErrorMessage("Error attempting to delete the worker.");
      }

      if (deleteWorkerMutation.isSuccess) {
        setSuccessMessage("Worker successfully deleted.");
        setOpen(false);
        setOpenConfirmDelete(false);
      }
    }
  };

  /*-----------------------------------------------------------------------------*/

  // Utility to get the full name of the worker
  const fullName = currentWorker
    ? `${currentWorker.first_name} ${currentWorker.last_name}`
    : "No Worker Selected";

  /*-----------------------------------------------------------------------------*/

  return (
    <>
      {/* Popup to edit a worker */}
      <PopUp
        title={"Edit Worker Profile Info"}
        submitFunc={handleEdit}
        open={open}
        setOpen={setOpen}
        handleOpen={() => {}}
      >
        <main className="flex flex-col w-full px-6 justify-start items-center md:px-32">
          {/* Display the current worker's avatar or a default image */}
          <Avatar
            src={
              currentWorker
                ? currentWorker.profile_picture || "/img/people/persona2.avif"
                : "/img/people/persona2.avif"
            }
            size="xxl"
          />

          <section className="flex flex-col w-full items-center justify-start my-4 space-y-4">
            {/* Change first name */}
            <Typography color="gray">
              Change the worker's first name:
            </Typography>
            <Input
              value={firstNameEdit}
              onChange={(event) => setFirstNameEdit(event.target.value)}
              placeholder="Enter new first name"
              error={!!errors.firstName}
              helperText={errors.firstName}
              label="First Name"
            />

            {/* Change last name */}
            <Typography color="gray">Change the worker's last name:</Typography>
            <Input
              value={lastNameEdit}
              onChange={(event) => setLastNameEdit(event.target.value)}
              placeholder="Enter new last name"
              error={!!errors.lastName}
              helperText={errors.lastName}
              label="Last Name"
            />

            {/* Change email */}
            <Typography color="gray">Change worker email:</Typography>
            <Input
              value={emailEdit}
              onChange={(event) => setEmailEdit(event.target.value)}
              placeholder="Enter new email"
              error={!!errors.email}
              helperText={errors.email}
              label="Email"
            />

            {/* Select area */}
            <Typography color="gray">Select worker's area:</Typography>
            <Select
              value={selectedArea}
              onChange={(val) => setSelectedArea(val)}
              label="Select Area"
              variant="outlined"
             
            >
              {areas && areas.length > 0 ? (
                areas.map((area) => (
                  <Option  value={area.id}>
                    {area.value}
                  </Option>
                ))
              ) : (
                <Option value="" disabled>
                  No areas available
                </Option>
              )}
            </Select>
            {errors.area && (
              <Typography color="red" variant="small">
                {errors.area}
              </Typography>
            )}

            {/* Select role */}
            <Typography color="gray">Select worker's role:</Typography>
            <Select
              value={selectedRole}
              onChange={(val) => setSelectedRole(val)}
              label="Select Role"
              variant="outlined"      
            >
              <Option value="Area Admin">Area Admin</Option>
              <Option value="Project Manager">Project Manager</Option>
            </Select>
            {errors.role && (
              <Typography color="red" variant="small">
                {errors.role}
              </Typography>
            )}

            <div className="w-2/3 h-0.5 bg-blue-gray-200">



            </div>

            {/* Icon to delete */}
            <button
              onClick={(event) => {
                event.stopPropagation();
                console.log("TrashIcon clicked");
                setOpenConfirmDelete(true);
              }}
              className="p-0 m-0 focus:outline-none"
              aria-label="Delete Worker"
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

      {/* Popup to confirm delete */}
      <PopUp
        title={"Confirm Deletion"}
        submitFunc={handleConfirmDelete}
        open={openConfirmDelete}
        setOpen={setOpenConfirmDelete}
        handleOpen={setOpenConfirmDelete} // Not necessary if using setOpenConfirmDelete
      >
        <div className="flex flex-col items-center justify-center">
          <Typography color="gray">
            Are you sure you want to delete <strong>{fullName}</strong>'s
            account?
          </Typography>

          <Typography color="red">
            {errorMessage ? errorMessage : ""}
          </Typography>

          <Typography color="green">
            {successMessage ? successMessage : ""}
          </Typography>

          <div className="flex flex-row space-x-4">
            {/* Add buttons for confirmation if needed */}
          </div>
        </div>
      </PopUp>
    </>
  );
}

export default EditWorkerPopup;
