import { PopUp } from "../popUp"
import { Input, Textarea, Typography } from "@material-tailwind/react"
import { useState } from "react";
import apiClient from "@/services/apiClient";

export function CreateDeliverable({openCreateDeliverable, setOpenCreateDeliverable, handleOpenCreateDeliverable, milestone, fetchDeliverables }){

    const [newDeliverableName, setNewDeliverableName] = useState("");
    const [newDeliverableDescription, setNewDeliverableDescription] = useState("");
    
    const [createErrors, setCreateErrors] = useState({});
    const [createSuccessMessage, setCreateSuccessMessage] = useState("");
    const [createErrorMessage, setCreateErrorMessage] = useState("");


    const handleCreateDeliverable = async () => {
      // Clear previous messages
      setCreateErrors({});
      setCreateSuccessMessage("");
      setCreateErrorMessage("");
  
      // Validate inputs
      const newErrors = {};
      if (!newDeliverableName || newDeliverableName.trim() === "") {
        newErrors.name = "Name is required";
      }
      if (!newDeliverableDescription || newDeliverableDescription.trim() === "") {
        newErrors.description = "Description is required";
      }
  
      if (Object.keys(newErrors).length > 0) {
        setCreateErrors(newErrors);
        return;
      }
  
      // Submit the create via axios (URL can be adjusted later)
      try {
        const response = await apiClient.post(`/deliverables/`, {


          name: newDeliverableName ,
          description:   newDeliverableDescription ,
          milestone: milestone.id, // Associate deliverable with the current milestone
        });
  
        setCreateSuccessMessage("Deliverable created successfully");
        // Optionally update the deliverables list
        // Close the pop-up after some time or immediately
        setOpenCreateDeliverable(false);
        // Reset the input fields
        setNewDeliverableName("");
        setNewDeliverableDescription("");

        fetchDeliverables();
        // Optionally refresh the deliverables list
      } catch (error) {

        console.error("Failed to create deliverable", error);
        setCreateErrorMessage("Failed to create deliverable");
      }
    };
  

    return(

          <PopUp
            title={"Create New Deliverable"}
            submitFunc={handleCreateDeliverable}
            open={openCreateDeliverable}
            setOpen={setOpenCreateDeliverable}
            handleOpen={handleOpenCreateDeliverable}
            isFit={true}
          >
            <main className="flex flex-col w-full px-6 justify-start items-center md:px-18">
              <section className="flex flex-col w-full items-center justify-start my-4 space-y-4">
                {/* Name input */}
                <Typography color="gray">Enter the deliverable's name:</Typography>
                <Input
                  id="name"
                  value={newDeliverableName}
                  onChange={(event) => setNewDeliverableName(event.target.value)}
                  error={!!createErrors.name}
                  helperText={createErrors.name}
                  label="Name"
                />

                {/* Description input */}
                <Typography color="gray">
                  Enter the deliverable's description:
                </Typography>
                <Textarea 
                  value={newDeliverableDescription}
                  onChange={(event) =>
                    setNewDeliverableDescription(event.target.value)
                  }
                  error={!!createErrors.description}
                  helperText={createErrors.description}
                  label="Description"
                />

                {/* Feedback messages */}
                {createSuccessMessage && (
                  <Typography color="green" className="mt-2">
                    {createSuccessMessage}
                  </Typography>
                )}
                {createErrorMessage && (
                  <Typography color="red" className="mt-2">
                    {createErrorMessage}
                  </Typography>
                )}
              </section>
            </main>
          </PopUp>
    )
}