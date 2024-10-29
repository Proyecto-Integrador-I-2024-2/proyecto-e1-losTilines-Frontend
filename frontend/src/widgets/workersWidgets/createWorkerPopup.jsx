import React, { useState, useEffect } from "react";
import { PopUp } from "@/widgets/popUp/popUp"; // Custom PopUp component
import {
  Avatar,
  Input,
  Typography,
  Select,
  Option,
} from "@material-tailwind/react";
import { useCreateWorker } from "@/hooks/workers";

export function CreateWorkerPopup({ open, setOpen, areas }) {
  // States to manage form inputs
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedRole, setSelectedRole] = useState("");

  // State for form validation errors
  const [errors, setErrors] = useState({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    area: "",
    role: "",
  });

  // State to track if the form is valid
  const [isFormValid, setIsFormValid] = useState(false);

  // Reset form fields and messages when the popup is opened or closed
  useEffect(() => {
    if (open) {
      setEmail("");
      setFirstName("");
      setLastName("");
      setPassword("");
      setSelectedArea("");
      setSelectedRole("");
      setErrors({
        email: "",
        firstName: "",
        lastName: "",
        password: "",
        area: "",
        role: "",
      });
      setIsFormValid(false);
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
      password: "",
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

    // Validate password
    if (!password.trim()) {
      tempErrors.password = "Password cannot be empty.";
      valid = false;
    } else if (password.length < 8) {
      tempErrors.password = "Password must be at least 8 characters.";
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

  // Re-validate form whenever inputs change
  useEffect(() => {
    // Call validate but don't update errors state
    const tempIsValid = validate();
    setIsFormValid(tempIsValid);
  }, [email, firstName, lastName, password, selectedArea, selectedRole]);

  // Mutation hook for creating a worker
  const createWorkerMutation = useCreateWorker();

  // Handler to create a new worker
  const handleCreate = () => {
    // Validate form inputs
    if (!validate()) return;

    // Prepare data for POST request
    const newWorker = {
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      email: email.trim(),
      password: password.trim(),
      area: selectedArea,
      role: selectedRole,
    };

    // Execute the mutation
    createWorkerMutation.mutate(newWorker)
  };

  /*-----------------------------------------------------------------------------*/

  //Logs (optional)

  console.log("Selected role", selectedRole)
  console.log("Boolean", selectedRole === "Area Admin")

  return (
    <>
      {/* Popup to create a new worker */}
      <PopUp
        title={"Create New Worker"}
        submitFunc={handleCreate}
        open={open}
        setOpen={setOpen}
        disableSubmit={!isFormValid} // Disable submit button if form is invalid
        isFit={false} // Set the popup height to fit the content
      >
        <main className="flex flex-col w-full px-6 justify-center items-center md:px-32">
          {/* Avatar or placeholder image */}
          <Avatar
            src="/img/people/noProfile1.jpg" // Placeholder image
            size="xxl"
          />

          <section className="flex flex-col w-full h-full items-center justify-start my-4 space-y-4">
            {/* First Name Input */}
            <Typography color="gray">
              Enter the worker's first name:
            </Typography>
            <Input
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              error={!!errors.firstName}
              helperText={errors.firstName}
              label="First Name"
            />

            {/* Last Name Input */}
            <Typography color="gray">
              Enter the worker's last name:
            </Typography>
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

            {/* Password Input */}
            <Typography color="gray">
              Create a password for the worker:
            </Typography>
            <Input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              error={!!errors.password}
              helperText={errors.password}
              label="Password"
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
                  <Option key={area.id} value={area.id}>
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
              <Option value="Project Manager">Project Manager</Option>
            </Select>
            {errors.role && (
              <Typography color="red" variant="small">
                {errors.role}
              </Typography>
            )}
          </section>
        </main>
      </PopUp>
    </>
  );
}
