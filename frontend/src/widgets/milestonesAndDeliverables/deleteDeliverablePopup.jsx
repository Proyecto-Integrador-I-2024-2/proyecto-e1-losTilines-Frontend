// DeleteDeliverablePopup.jsx
import React, { useState, useEffect } from "react";
import { PopUp } from "../popUp";
import { Typography, Button, Spinner } from "@material-tailwind/react";
import apiClient from "@/services/apiClient";

export function DeleteDeliverablePopup({
  openConfirmDelete,
  setOpenConfirmDelete,
  deliverable,
  fetchDeliverables,
}) {
  // Estados para manejo de mensajes y errores
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  
  // Estado para manejar la carga durante la eliminación
  const [isLoading, setIsLoading] = useState(false);

  // useEffect para resetear mensajes cuando cambia el deliverable o se abre/cierra el popup
  useEffect(() => {
    if (openConfirmDelete) {
      setSuccessMessage("");
      setErrorMessage("");
      setIsLoading(false);
    }
  }, [openConfirmDelete, deliverable]);

  const handleConfirmDelete = async () => {
    if (!deliverable || !deliverable.id) {
      setErrorMessage("Invalid deliverable selected.");
      return;
    }

    // Limpiar mensajes anteriores y establecer estado de carga
    setErrorMessage("");
    setSuccessMessage("");
    setIsLoading(true);

    // Intentar eliminar el deliverable
    try {
      await apiClient.delete(`/deliverables/${deliverable.id}/`);
      setSuccessMessage("Deliverable deleted successfully.");

      // Actualizar la lista de deliverables en el componente padre
      if (fetchDeliverables) {
        await fetchDeliverables();
      }

      // Cerrar el pop-up después de un breve retraso para mostrar el mensaje de éxito
      setTimeout(() => {
        setOpenConfirmDelete(false);
      }, 1500);
    } catch (error) {
      // Manejar errores más detalladamente
      if (error.response && error.response.data) {
        const errorDetails = Object.values(error.response.data).join(" ");
        setErrorMessage(errorDetails || "Failed to delete deliverable.");
      } else {
        setErrorMessage("Failed to delete deliverable.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PopUp
      title="Confirm Deletion"
      submitFunc={handleConfirmDelete}
      open={openConfirmDelete}
      setOpen={setOpenConfirmDelete}
      handleOpen={() => setOpenConfirmDelete(!openConfirmDelete)}
      isFit={true}
      // Deshabilitar el botón de submit mientras está cargando
      submitDisabled={isLoading}
    >
      <div className="flex flex-col items-center justify-center space-y-4">
        <Typography color="gray">
          Are you sure you want to delete this deliverable?
        </Typography>

        {/* Mensajes de retroalimentación */}
        {errorMessage && (
          <Typography color="red" className="text-center">
            {errorMessage}
          </Typography>
        )}
        {successMessage && (
          <Typography color="green" className="text-center">
            {successMessage}
          </Typography>
        )}

        {/* Indicador de carga */}
        {isLoading && <Spinner color="blue" />}
      </div>

   
    </PopUp>
  );
}

export default DeleteDeliverablePopup;
