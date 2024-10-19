// src/components/EditWorkerPopup.jsx

import React, { useState, useEffect } from "react";
import { PopUp } from "@/widgets/popUp/popUp";
import { Avatar, Input, Typography, Button } from "@material-tailwind/react";
import { TrashIcon } from "@heroicons/react/24/outline";
import { useQueryClient } from "@tanstack/react-query";
import { useDeleteWorker, useEditWorker } from "@/hooks/workers";

export function EditWorkerPopup({ open, setOpen, currentWorker }) {


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
  const [errors, setErrors] = useState({
    email: "",
    firstName: "",
    lastName: "",
  });

  // Reset the input fields when the currentWorker changes

  useEffect(() => {
    setEmailEdit(currentWorker ? currentWorker.email : "");
    setFirstNameEdit(currentWorker ? currentWorker.first_name : "");
    setLastNameEdit(currentWorker ? currentWorker.last_name : "");
  }, [currentWorker]);

  /*-----------------------------------------------------------------------------*/ 


  // States to give feedback to the user about its operations: delete and edit a worker.

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  /*-----------------------------------------------------------------------------*/ 

  // Function to validate the inputs when editing a worker

  const validate = () => {
    let valid = true;
    let tempErrors = { email: "", firstName: "", lastName: "" };

    // Validar primer nombre
    if (!firstNameEdit.trim()) {
      tempErrors.firstName = "El nombre no puede estar vacío.";
      valid = false;
    }

    // Validar apellido
    if (!lastNameEdit.trim()) {
      tempErrors.lastName = "El apellido no puede estar vacío.";
      valid = false;
    }

    // Validar correo electrónico
    const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    if (!emailEdit.trim()) {
      tempErrors.email = "El correo electrónico no puede estar vacío.";
      valid = false;
    } else if (!emailRegex.test(emailEdit)) {
      tempErrors.email = "El correo electrónico no es válido.";
      valid = false;
    }

    setErrors(tempErrors);
    return valid;
  };

  /*-----------------------------------------------------------------------------*/

  // Handler to edit a worker

  const editWorkerMutation = useEditWorker();

  const handleEdit = () => {
    // Resetear mensajes de feedback
    setSuccessMessage("");
    setErrorMessage("");

    // Validar inputs
    if (!validate()) return;

    // Verificar si hubo cambios solo si currentWorker está presente
    let hasFirstNameChanged = false;
    let hasLastNameChanged = false;
    let hasEmailChanged = false;

    if (currentWorker) {
      hasFirstNameChanged =
        firstNameEdit.trim() !== currentWorker.first_name.trim();
      hasLastNameChanged =
        lastNameEdit.trim() !== currentWorker.last_name.trim();
      hasEmailChanged =
        emailEdit.trim().toLowerCase() !==
        currentWorker.email.trim().toLowerCase();
    } else {
      // Si no hay currentWorker, consideramos que todos los campos han cambiado
      hasFirstNameChanged = firstNameEdit.trim() !== "";
      hasLastNameChanged = lastNameEdit.trim() !== "";
      hasEmailChanged = emailEdit.trim() !== "";
    }

    if (!hasFirstNameChanged && !hasLastNameChanged && !hasEmailChanged) {
      setErrorMessage("No se realizaron cambios.");
      return;
    }

    // Prepare data to patch
    const updatedData = {};
    if (hasFirstNameChanged) updatedData.first_name = firstNameEdit.trim();
    if (hasLastNameChanged) updatedData.last_name = lastNameEdit.trim();
    if (hasEmailChanged) updatedData.email = emailEdit.trim();

    // Exec the mutation
    if (currentWorker) {
      editWorkerMutation.mutate({ id: currentWorker.id, data: updatedData });
    } else {

      // Si no hay currentWorker, podrías manejar una creación o simplemente cerrar el popup
      
      console.log("No worker selected for editing.");
    }
  };


  /*-----------------------------------------------------------------------------*/

  //Handler to delete a worker

  
  const deleteWorkerMutation = useDeleteWorker();

  const handleConfirmDelete = () => {
    if (currentWorker) {
      deleteWorkerMutation.mutate(currentWorker.id);
    }
  };

  /*-----------------------------------------------------------------------------*/

  //Utils 

  const fullName = currentWorker
    ? `${currentWorker.first_name} ${currentWorker.last_name}`
    : "No Worker Selected";


  /*-----------------------------------------------------------------------------*/
  

  return (
    <>
      {/* Pop up to edit a worker */}

      <PopUp
        title={"Edit Worker Profile Info"}
        submitFunc={handleEdit} // Función para manejar la edición
        open={open}
        setOpen={setOpen}
        handleOpen={() => {}} // No es necesario si ya usas setOpen
      >
        <main className="flex flex-col w-full px-6 justify-start items-center md:px-32">
          {/* Imagen actual del trabajador o placeholder */}
          <Avatar
            src={
              currentWorker
                ? currentWorker.avatarUrl || "/img/people/persona2.avif"
                : "/img/people/persona2.avif"
            }
            size="xxl"
          />

          <section className="flex flex-col w-full items-center justify-start my-4 space-y-4">
            {/* Cambio de primer nombre */}
            <Typography color="gray">
              Change the worker's first name:
            </Typography>
            <Input
              value={firstNameEdit}
              onChange={(event) => setFirstNameEdit(event.target.value)}
              placeholder="Enter new first name"
              error={!!errors.firstName}
              helperText={errors.firstName}
            />

            {/* Cambio de apellido */}
            <Typography color="gray">Change the worker's last name:</Typography>
            <Input
              value={lastNameEdit}
              onChange={(event) => setLastNameEdit(event.target.value)}
              placeholder="Enter new last name"
              error={!!errors.lastName}
              helperText={errors.lastName}
            />

            {/* Cambio de correo electrónico */}
            <Typography color="gray">Change worker email:</Typography>
            <Input
              value={emailEdit}
              onChange={(event) => setEmailEdit(event.target.value)}
              placeholder="Enter new email"
              error={!!errors.email}
              helperText={errors.email}
            />

            {/* Icono para eliminar */}
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

            {/* Mensajes de feedback */}
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

      {/* Popup para confirmar la eliminación */}
      <PopUp
        title={"Confirm Deletion"}
        submitFunc={handleConfirmDelete} // Función para manejar la eliminación
        open={openConfirmDelete}
        setOpen={setOpenConfirmDelete}
        handleOpen={() => {}} // No es necesario si ya usas setOpen
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          <Typography color="gray">
            Are you sure you want to delete the account{" "}
            <strong>{fullName}</strong>?
          </Typography>
          <div className="flex flex-row space-x-4">
            <Button
              variant="outlined"
              color="red"
              onClick={() => setOpenConfirmDelete(false)}
              disabled={deleteWorkerMutation.isLoading}
            >
              Cancel
            </Button>
            <Button
              variant="filled"
              color="red"
              onClick={handleConfirmDelete}
              disabled={deleteWorkerMutation.isLoading}
            >
              {deleteWorkerMutation.isLoading ? "Deleting..." : "Confirm"}
            </Button>
          </div>
        </div>
      </PopUp>
    </>
  );
}

export default EditWorkerPopup;
