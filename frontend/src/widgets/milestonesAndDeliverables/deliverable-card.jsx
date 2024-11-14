import React, { useEffect, useState } from "react";
import {
  List,
  ListItem,
  ListItemSuffix,
  Card,
  Typography,
  Input,
  Chip,
} from "@material-tailwind/react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import { getStatusColor } from "@/services/colorBaseOnStatus";
import { DeliverableEdit } from "./deliverableEdit";

export function DeliverableCard({ deliverable, fetchDeliverables }) {
  const [open, setOpen] = useState(false); // For edit pop-up

 

  const role = sessionStorage.getItem("role");

  const handleOpen = () => setOpen(!open);


  useEffect(() => {
    console.log("Deliverable ID selected: ", deliverable.description);
  }, [deliverable]);

  console.log(deliverable.status);

  return (
    <>
      <Card className="w-full  mb-4">
        <div className="flex justify-between px-2">
          <div className="w-full ">
            <ListItem className="flex flex-row items-center group w-full space-x-2 relative">
              <div className="flex flex-col h-auto w-11/12">
                <Typography
                  variant="h6"
                  className="whitespace-normal break-words"
                >
                  {deliverable.name}
                </Typography>
                <Typography className="whitespace-normal break-words h-auto w-auto">
                  {deliverable.description}
                </Typography>
              </div>

              <div className="flex flex-col justify-center items-center">
                <Chip
                  color={`${getStatusColor(deliverable.status)}`}
                  value={deliverable.status}
                  variant="ghost"
                />
              </div>

              {role && (
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    // Open the edit pop-up
                    setOpen(true);
                  }}
                  className="p-0 m-0 focus:outline absolute right-0 top-0"
                >
                  <PencilIcon
                    className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                    color="gray"
                  />
                </button>
              )}
            </ListItem>
          </div>
        </div>
      </Card>

      {/* Pop-up for deliverable deletion */}

      <DeliverableEdit
        deliverable={deliverable}
        open={open}
        setOpen={setOpen}
        handleOpen={handleOpen}
        fetchDeliverables={fetchDeliverables}
      />
    </>
  );
}

export default DeliverableCard;
