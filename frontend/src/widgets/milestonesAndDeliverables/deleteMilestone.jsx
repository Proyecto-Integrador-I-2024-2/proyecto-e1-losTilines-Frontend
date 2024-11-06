import { PopUp } from "../popUp";

export function DeleteMilestone() {



      // Handler for confirming delete
  const handleConfirmDelete = async () => {
    // Clear previous messages
    setErrorMessage("");
    setSuccessMessage("");

    // Submit the delete request via axios (URL can be adjusted later)
    try {
      await apiClient.delete(`/milestones/${milestone.id}/`);
      setSuccessMessage("Milestone deleted successfully");
      // Optionally handle the removal of the milestone from the UI
      setOpenConfirmDelete(false);
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
      </div>
    </PopUp>
  );
}
