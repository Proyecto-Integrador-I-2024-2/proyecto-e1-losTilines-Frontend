// DeliverableEdit.jsx
import React, { useState, useEffect } from "react";
import { PopUp } from "../popUp";
import {
  Typography,
  Textarea,
  Button,
  Spinner,
} from "@material-tailwind/react";
import { TrashIcon } from "@heroicons/react/24/solid";
import { StatusChoices } from ".";
import apiClient from "@/services/apiClient";
import { DeleteDeliverablePopup } from ".";
export function DeliverableEdit({
  deliverable,
  open,
  setOpen,
  handleOpen,
  fetchDeliverables,
}) {
  // Estados para la edición
  const [nameEdit, setNameEdit] = useState(deliverable.name);
  const [descriptionEdit, setDescriptionEdit] = useState(
    deliverable.description
  );
  const [statusMilestone, setStatusMilestone] = useState(deliverable.status);

  // Estados para manejo de mensajes y errores
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Estado para manejar la confirmación de eliminación
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);

  // Estado para manejar la carga durante la edición
  const [isLoading, setIsLoading] = useState(false);

  // useEffect para actualizar los estados cuando cambia el prop 'deliverable'
  useEffect(() => {
    if (deliverable) {
      setNameEdit(deliverable.name);
      setDescriptionEdit(deliverable.description);
      setStatusMilestone(deliverable.status);

      // Limpiar mensajes y errores cuando cambia el deliverable
      setErrors({});
      setSuccessMessage("");
      setErrorMessage("");
      setIsLoading(false);
    }
  }, [deliverable]);

  // Handler para editar el deliverable
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
      nameEdit !== deliverable.name ||
      descriptionEdit !== deliverable.description ||
      statusMilestone !== deliverable.status;

    if (!hasChanged) {
      setErrorMessage("No changes detected to update.");
      return;
    }

    // Construir el objeto de datos con solo los campos que han cambiado
    const data = {};
    if (nameEdit !== deliverable.name) data.name = nameEdit;
    if (descriptionEdit !== deliverable.description)
      data.description = descriptionEdit;
    if (statusMilestone !== deliverable.status) data.status = statusMilestone;

    // Realizar el PATCH solo si hay cambios
    try {
      setIsLoading(true);
      const response = await apiClient.patch(
        `/deliverables/${deliverable.id}/`,
        data
      );

      setSuccessMessage("Deliverable updated successfully.");


      // Cerrar el pop-up después de un breve retraso para mostrar el mensaje de éxito
      setTimeout(() => {
        // Refrescar los deliverables en el componente padre
        if (fetchDeliverables) {
          fetchDeliverables();
        }

        handleOpen();
      }, 1500);
    } catch (error) {
      // Manejar errores más detalladamente
      if (error.response && error.response.data) {
        const errorDetails = Object.values(error.response.data).join(" ");
        setErrorMessage(errorDetails || "Failed to update deliverable.");
      } else {
        setErrorMessage("Failed to update deliverable.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Determinar si hay cambios para deshabilitar el botón de submit si no hay cambios
  const hasChanged =
    nameEdit !== deliverable.name ||
    descriptionEdit !== deliverable.description ||
    statusMilestone !== deliverable.status;

  return (
    <div>
      <PopUp
        title={"Edit Deliverable Info"}
        submitFunc={handleEdit}
        open={open}
        setOpen={setOpen}
        handleOpen={handleOpen}
        isFit={true}
        // Deshabilitar el botón de submit mientras está cargando
        submitDisabled={!hasChanged || isLoading}
      >
        <main className="flex flex-col w-full px-6 justify-start items-center md:px-12">
          <section className="flex flex-col w-full items-center justify-start my-4 space-y-4">
            {/* Cambiar nombre */}
            <Typography color="gray">Change the deliverable's name:</Typography>
            <Textarea
              id="newNameDeliverable"
              value={nameEdit}
              onChange={(event) => setNameEdit(event.target.value)}
              placeholder="Enter new name"
              error={!!errors.name}
              helperText={errors.name}
              label="Name"
            />

            {/* Cambiar descripción */}
            <Typography color="gray">
              Change the deliverable's description:
            </Typography>
            <Textarea
              id="newDescriptionDeliverable"
              value={descriptionEdit}
              onChange={(event) => setDescriptionEdit(event.target.value)}
              placeholder="Enter new description"
              error={!!errors.description}
              helperText={errors.description}
              label="Description"
            />

            {/* Cambiar estado */}
            <Typography color="gray">
              Change the deliverable's status:
            </Typography>
            <StatusChoices
              initialStatus={statusMilestone}
              onStatusChange={setStatusMilestone}
            />

            {/* Divisor */}
            <div className="w-2/3 h-0.5 bg-blue-gray-200"></div>

            {/* Icono para eliminar */}
            <button
              id="trashButton"
              onClick={(event) => {
                event.stopPropagation();
                // Abrir el pop-up de confirmación de eliminación
                setOpenConfirmDelete(true);
              }}
              className="p-0 m-0 focus:outline-none"
              aria-label="Delete Deliverable"
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

      {/* Pop-up para confirmar la eliminación del deliverable */}
      {openConfirmDelete && (
        <DeleteDeliverablePopup
          openConfirmDelete={openConfirmDelete}
          setOpenConfirmDelete={setOpenConfirmDelete}
          deliverable={deliverable}
          fetchDeliverables={fetchDeliverables}
        />
      )}
    </div>
  );
}

export default DeliverableEdit;
