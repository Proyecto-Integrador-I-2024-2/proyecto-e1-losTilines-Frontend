import React, { useState, useEffect } from "react";
import { PopUp } from "@/widgets/popUp/popUp"; // Custom PopUp component
import {
  Avatar,
  Input,
  Typography,
  Button,
  Select,
  Option,
} from "@material-tailwind/react";
import { useCreateWorker } from "@/hooks/workers";

export function CreateWorkerPopup({ open, setOpen, areas }) {
  // State to manage form inputs
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedRole, setSelectedRole] = useState("");

  // State for form validation errors
  const [errors, setErrors] = useState({
    email: "",
    firstName: "",
    lastName: "",
    area: "",
    role: "",
  });

  // State to provide feedback to the user
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Reset form fields and messages when the popup is opened or closed
  useEffect(() => {
    if (open) {
      setEmail("");
      setFirstName("");
      setLastName("");
      setSelectedArea("");
      setSelectedRole("");
      setErrors({
        email: "",
        firstName: "",
        lastName: "",
        area: "",
        role: "",
      });
      setSuccessMessage("");
      setErrorMessage("");
    }
  }, [open]);

  /*-----------------------------------------------------------------------------*/

  // Function to validate form inputs
  const validate = () => {
    let valid = true;
    let tempErrors = {
      email: "",
      firstName: "",
      lastName: "",
      area: "",
      role: "",
    };

    // Validate first name
    if (!firstName.trim()) {
      tempErrors.firstName = "First name cannot be empty.";
      valid = false;
    }

    // Validate last name
    if (!lastName.trim()) {
      tempErrors.lastName = "Last name cannot be empty.";
      valid = false;
    }

    // Validate email
    const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    if (!email.trim()) {
      tempErrors.email = "Email cannot be empty.";
      valid = false;
    } else if (!emailRegex.test(email)) {
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

  // Mutation hook for creating a worker
  const createWorkerMutation = useCreateWorker();

  // Handler to create a new worker
  const handleCreate = () => {
    // Reset feedback messages
    setSuccessMessage("");
    setErrorMessage("");

    // Validate form inputs
    if (!validate()) return;

    // Prepare data for POST request
    const newWorker = {
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      email: email.trim(),
      area: selectedArea,
      role: selectedRole,
    };

    // Execute the mutation
    createWorkerMutation.mutate(newWorker);
  };

  /*-----------------------------------------------------------------------------*/

  console.log("Areas given to create worker popup:", areas);

  useEffect(() => {

        console.log("Area selected", selectedArea);


  }, [selectedArea])

  return (
    <>
      {/* Popup to create a new worker */}
      <PopUp
        title={"Create New Worker"}
        submitFunc={handleCreate}
        open={open}
        setOpen={setOpen}
        handleOpen={() => {}} // Can be used to toggle the popup if needed
      >
        <main className="flex flex-col w-full px-6 justify-start items-center md:px-32">
          {/* Optional: Display an avatar or icon for new workers 
          <Avatar
            src={"/img/people/default-avatar.png"} // Placeholder image
            size="xxl"
          />
            */}
          <section className="flex flex-col w-full items-center justify-start my-4 space-y-4">
            {/* First Name Input */}
            <Typography color="gray">Enter the worker's first name:</Typography>
            <Input
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              error={!!errors.firstName}
              helperText={errors.firstName}
              label="First Name"
            />

            {/* Last Name Input */}
            <Typography color="gray">Enter the worker's last name:</Typography>
            <Input
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              error={!!errors.lastName}
              helperText={errors.lastName}
              label="Last Name"
            />

            {/* Email Input */}
            <Typography color="gray">Enter the worker's email:</Typography>
            <Input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              error={!!errors.email}
              helperText={errors.email}
              label="Email"
            />

            {/* Select Area */}
            <Typography color="gray">Select worker's area:</Typography>
            <Select
              value={selectedArea}
              onChange={(val) => setSelectedArea(val)}
              label="Select Area"
              variant="outlined"
              error={!!errors.area}
            >
              {areas && areas.length > 0 ? (
                areas.map((area) => (
                  <Option value={area.id}>
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

            {/* Select Role */}
            <Typography color="gray">Select worker's role:</Typography>
            <Select
              value={selectedRole}
              onChange={(val) => setSelectedRole(val)}
              label="Select Role"
              variant="outlined"
              error={!!errors.role}
            >
              <Option value="Area Admin">Area Admin</Option>
              <Option value="Business Manager">Business Manager</Option>
              <Option value="Project Manager">Project Manager</Option>
            </Select>
            {errors.role && (
              <Typography color="red" variant="small">
                {errors.role}
              </Typography>
            )}

            {/* Divider (optional) */}

            {/* Feedback Messages */}
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
    </>
  );
}
