import React, { useState } from "react";
import {
  Card,
  Typography,
  CardBody,
  Button,
  Chip,
} from "@material-tailwind/react";
import { DeliverableCard } from ".";
import { PencilIcon } from "@heroicons/react/24/solid";
import { CreateDeliverable } from ".";
import { getStatusColor } from "@/services/colorBaseOnStatus";
import { EditMilestone } from "./editMilestone";

export function MilestonesInfo({
  milestone,
  deliverables,
  fetchDeliverables,
  fetchMilestones,
}) {
  console.log("Milestone on MilestonesInfo: ", milestone);

  const role = sessionStorage.getItem("role");

  if (milestone == undefined) return;

  const [openEdit, setOpenEdit] = useState(false);
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);

  const [openCreateDeliverable, setOpenCreateDeliverable] = useState(false);

  const handleOpenEdit = () => setOpenEdit(!openEdit);

  const handleOpenCreateDeliverable = () =>
    setOpenCreateDeliverable(!openCreateDeliverable);

  return (
    <div className="flex flex-col justify-center w-full h-full pt-6  ">
      {milestone && (
        <Card className="w-  h-full flex flex-col justify-start pb-2 relative ">
          <Chip
            variant="ghost"
            color={`${getStatusColor(milestone.status)}`}
            value={milestone.status}
            className=" w-fit absolute -top-6 right-6  "
          />

          <CardBody className="  h-full overflow-y-auto  flex flex-col justify-start items-start space-y-8 py-0">
            <div className="flex w-full flex-col h-auto   space-y-4 ">
              <div className="flex flex-row items-center  justify-center group">
                <Typography
                  variant="h4"
                  color="blue-gray"
                  className="text-center "
                >
                  {milestone.name
                    ? milestone.name
                    : "Milestone Name is not available"}
                </Typography>

                {role !== "Freelancer" && role !== undefined && (
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      // Open the edit pop-up
                      setOpenEdit(true);
                    }}
                    className="p-0 m-0 focus:outline-none ml-4"
                    aria-label="Edit Milestone"
                  >
                    <PencilIcon
                      className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                      color="gray"
                    />
                  </button>
                )}
              </div>
            </div>
            <Typography color="blue-gray">
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
                    fetchDeliverables = {fetchDeliverables}                  />
                ))
              ) : (
                <Typography variant="h6" color="gray">
                  There are no deliverables available.
                </Typography>
              )}
            </div>
          </CardBody>

          {role && (
            <footer className="flex flex-row justify-center items-center w-full  mt-2">
              {/* Button to open the create deliverable pop-up */}
              <Button
                variant="text"
                color="cyan"
                onClick={handleOpenCreateDeliverable}
              >
                Create Deliverable
              </Button>
            </footer>
          )}
        </Card>
      )}

      <CreateDeliverable
        openCreateDeliverable={openCreateDeliverable}
        setOpenCreateDeliverable={setOpenCreateDeliverable}
        handleOpenCreateDeliverable={() =>
          setOpenCreateDeliverable(!openCreateDeliverable)
        }
        milestone={milestone}
        fetchDeliverables={fetchDeliverables}
      />

      <EditMilestone
        milestone={milestone}
        openEdit={openEdit}
        handleOpenEdit={handleOpenEdit}
        setOpenEdit={setOpenEdit}
        fetchMilestone={fetchMilestones}
      />
    </div>
  );
}

export default MilestonesInfo;
