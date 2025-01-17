
import { PopUp } from "../popUp";
import { Typography } from "@material-tailwind/react";
import apiClient from "@/services/apiClient";
import { useState } from "react";

export function DeleteMilestone({openConfirmDelete, setOpenConfirmDelete, milestone, fetchMilestone}) {

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

      // Handler for confirming delete
  const handleConfirmDelete = async () => {
    // Clear previous messages
    setErrorMessage("");
    setSuccessMessage("");

    // Submit the delete request via axios (URL can be adjusted later)
    try {
      await apiClient.delete(`/milestones/${milestone.id}/`);

      setSuccessMessage("Milestone deleted successfully");

      
      setTimeout(()=>{
        fetchMilestone();
        setOpenConfirmDelete(false);
      }, 1000)


      // Optionally handle the removal of the milestone from the UI
    } catch (error) {
      setErrorMessage("Failed to delete milestone");
    }
  };
  return (
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
        {successMessage && (

          <Typography color="green">{successMessage}</Typography>
        )}
        {errorMessage && (
          <Typography color="red">{errorMessage}</Typography>
        )}

      </div>
    </PopUp>
  );
}
