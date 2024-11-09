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
    <div className="flex flex-col justify-center w-full h-full ">
      {milestone && (
        <Card className="w-full h-full space-y-4 pb-2">
          <CardHeader
            color="transparent"
            floated={false}
            shadow={false}
            className="flex items-center h-1/6"
          >
            <div className="flex w-full flex-col h-auto    space-y-4">
              <div className="flex flex-row items-center  justify-between group">


                <div className=""></div>
      
                <Typography variant="h4" color="blue-gray" className="text-center">
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
            </div>
          </CardHeader>
          <CardBody className="h-full flex flex-col justify-start items-start space-y-2">
            <Typography  color="blue-gray">
              {milestone.description
                ? milestone.description
                : "Milestone description is not available"}
            </Typography>

            <div className=" w-full h-full overflow-y-auto">
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

            </div>

         
          </CardBody>
          <footer className="flex flex-row justify-center items-center w-full  mt-2">
            {/* Button to open the create deliverable pop-up */}
            <Button variant="text" color="cyan" onClick={handleOpenCreateDeliverable}>
              Create Deliverable
            </Button>
          </footer>
        </Card>
      )}
    </div>
  );
}

export default MilestonesInfo;
