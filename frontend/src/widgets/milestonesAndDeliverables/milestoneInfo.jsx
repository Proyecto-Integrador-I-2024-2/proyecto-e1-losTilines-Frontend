import React, { useState } from "react";
import {
  Card,
  Typography,
  CardHeader,
  CardBody,
  Button,
  Input,
} from "@material-tailwind/react";
import { DeliverableCard } from "../cards";
import { PencilIcon } from "@heroicons/react/24/solid";
import { PopUp } from "../popUp";
import apiClient from "@/services/apiClient";

export function MilestonesInfo({ milestone, deliverables }) {
  const [openEdit, setOpenEdit] = useState(false); // For edit pop-up
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false); // For delete confirmation pop-up

  // State variables for creating a deliverable
  const [openCreateDeliverable, setOpenCreateDeliverable] = useState(false);


  // Handler for opening/closing the edit pop-up
  const handleOpenEdit = () => setOpenEdit(!openEdit);

  
  // Handler for opening/closing the create deliverable pop-up
  const handleOpenCreateDeliverable = () =>
    setOpenCreateDeliverable(!openCreateDeliverable);



  return (
    <div className="flex flex-col w-full h-full">
      {milestone && (
        <>
          <Card
            color="transparent"
            shadow={true}
            className="w-full h-full overflow-auto p-5"
          >
            <CardHeader
              color="transparent"
              floated={false}
              shadow={false}
              className="mx-0 flex items-center pt-0 pb-8 justify-between"
            >
              <div className="flex w-full flex-col gap-0.5 m-3 space-y-4">
                <div className="flex flex-row items-center justify-between group">
                  <div></div>
                  <Typography variant="h5" color="blue-gray">
                    {milestone.name
                      ? milestone.name
                      : "Milestone Name is not available"}
                  </Typography>
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      // Open the edit pop-up
                      setOpenEdit(true);
                    }}
                    className="p-0 m-0 focus:outline-none"
                    aria-label="Edit Milestone"
                  >
                    <PencilIcon
                      className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                      color="gray"
                    />
                  </button>
                </div>
                <Typography color="blue-gray">
                  {milestone.description
                    ? milestone.description
                    : "Milestone description is not available"}
                </Typography>
              </div>
            </CardHeader>
            <CardBody className="py-0 px-6 h-full flex flex-col justify-start items-start space-y-2">
              {deliverables?.length > 0 ? (
                deliverables.map((deliverable) => (
                  <DeliverableCard
                    key={deliverable.id}
                    deliverable={deliverable}
                  />
                ))
              ) : (
                <Typography variant="h6" color="gray">
                  There are no deliverables available.
                </Typography>
              )}
            </CardBody>
            <footer className="flex flex-row justify-center items-center w-full h-auto mt-2">
              {/* Button to open the create deliverable pop-up */}
              <Button variant="text" onClick={handleOpenCreateDeliverable}>
                Create Deliverable
              </Button>
            </footer>
          </Card>
        </>
      )}
    </div>
  );
}

export default MilestonesInfo;
