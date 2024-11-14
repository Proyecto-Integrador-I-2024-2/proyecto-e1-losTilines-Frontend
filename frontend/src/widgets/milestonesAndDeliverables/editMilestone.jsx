// EditMilestone.jsx
import React, { useState, useEffect } from "react";
import { PopUp } from "../popUp";
import { Typography, Textarea, Button } from "@material-tailwind/react";
import { TrashIcon } from "@heroicons/react/24/outline";
import { DeleteMilestone, StatusChoices } from ".";
import apiClient from "@/services/apiClient";

export function EditMilestone({
  milestone,
  openEdit,
  handleOpenEdit,
  setOpenEdit,
  fetchMilestone,
}) {
  const [nameEdit, setNameEdit] = useState(milestone.name);
  const [descriptionEdit, setDescriptionEdit] = useState(milestone.description);
  const [statusMilestone, setStatusMilestone] = useState(milestone.status);

  // Estados para manejo de mensajes y errores
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Estado para manejar la confirmación de eliminación
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);

  // useEffect para actualizar los estados cuando cambia la prop 'milestone'

  useEffect(() => {
    if (milestone) {
      console.log("Milestone CAMBIA EN EDIT: ", milestone);
      setNameEdit(milestone.name);
      setDescriptionEdit(milestone.description);
      setStatusMilestone(milestone.status);

      setErrors({});
      setSuccessMessage("");
      setErrorMessage("");
    }
  }, [milestone]);

  // Handler para editar el milestone
  const handleEdit = async () => {
    // Limpiar mensajes anteriores
    setErrors({});
    setSuccessMessage("");
    setErrorMessage("");

    // Validar entradas
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

    // Verificar si hay cambios
    const hasChanged =
      nameEdit !== milestone.name ||
      descriptionEdit !== milestone.description ||
      statusMilestone !== milestone.status;

    if (!hasChanged) {
      setErrorMessage("No changes detected to update.");
      return;
    }

    // Realizar el PATCH solo si hay cambios
    try {
      const response = await apiClient.patch(`/milestones/${milestone.id}/`, {
        name: nameEdit,
        description: descriptionEdit,
        status: statusMilestone,
      });

      setSuccessMessage("Milestone updated successfully");

      setTimeout(() => {
        handleOpenEdit();

        if (fetchMilestone) {
          fetchMilestone();
        }
      }, 1000);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.detail || "Failed to update milestone"
      );
    }
  };

  return (
    <>
      <PopUp
        title={"Edit Milestone Info"}
        submitFunc={handleEdit}
        open={openEdit}
        setOpen={setOpenEdit}
        handleOpen={handleOpenEdit}
        isFit={true}
      >
        <main className="flex flex-col w-full px-6 justify-start items-center md:px-12">
          <section className="flex flex-col w-full items-center justify-start my-4 space-y-4">
            {/* Cambiar nombre */}
            <Typography color="gray">Change the milestone's name:</Typography>
            <Textarea
              value={nameEdit}
              onChange={(event) => setNameEdit(event.target.value)}
              placeholder="Enter new name"
              error={!!errors.name}
              helperText={errors.name}
              label="Name"
            />

            {/* Cambiar descripción */}
            <Typography color="gray">
              Change the milestone's description:
            </Typography>
            <Textarea
              value={descriptionEdit}
              onChange={(event) => setDescriptionEdit(event.target.value)}
              placeholder="Enter new description"
              error={!!errors.description}
              helperText={errors.description}
              label="Description"
            />

            {/* Cambiar estado */}
            <Typography color="gray">Change the milestone's status:</Typography>
            <StatusChoices
              initialStatus={statusMilestone}
              onStatusChange={setStatusMilestone}
            />

            {/* Divisor */}
            <div className="w-2/3 h-0.5 bg-blue-gray-200"></div>

            {/* Icono para eliminar */}
            <button
              onClick={(event) => {
                event.stopPropagation();
                // Abrir el pop-up de confirmación de eliminación
                setOpenConfirmDelete(true);
              }}
              className="p-0 m-0 focus:outline-none"
              aria-label="Delete Milestone"
            >
              <TrashIcon className="h-6 w-6 text-black hover:text-red-500 cursor-pointer transition-colors duration-200" />
            </button>

            {/* Mensajes de retroalimentación */}
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

      <DeleteMilestone
        openConfirmDelete={openConfirmDelete}
        setOpenConfirmDelete={setOpenConfirmDelete}
        milestone={milestone}
        fetchMilestone={fetchMilestone}
      />
    </>
  );
}

export default EditMilestone;
