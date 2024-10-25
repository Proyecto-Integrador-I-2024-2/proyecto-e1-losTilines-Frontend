import React, { Children, useEffect } from "react";
import { PencilIcon, CheckIcon } from "@heroicons/react/24/solid";
import { TableThreeColumns } from "@/widgets/tables";
import {
  ListItem,
  Typography,
  Avatar,
  Chip,
  Collapse,
  Card,
  Input,
} from "@material-tailwind/react";
import { useState } from "react";
import apiClient from "@/services/apiClient";
import { SpinnerCustom } from "../layout";
import { PopUpChangeAreaAdmin } from ".";
import { useMutation, useQueryClient } from "@tanstack/react-query";
export function ListAreasCollapse({
  title,
  areaId,
  currentAreaAdmin,
  projects,
}) {
  const [openCollapsedRow, setOpenCollapsableRow] = useState(false); // State used to open the collapsable row
  const [openPopup, setOpenPopup] = useState(false); // State used to open the popUp
  const [projectSumBudget, setProjectSumBudget] = useState(0);
  const [areNameChange, setAreaNameChange] = useState(false); // State used to change the area name
  const [areaName, setAreaName] = useState(title); // State used to change the area name
  const [remenberAreaName, setRemenberAreaName] = useState(areaName); // State used to change the area name
  const queryClient = useQueryClient();
  useEffect(() => {

    if (projects) {
      const sum = projects.reduce((acc, project) => {
        return acc + Number(project.budget || 0);
      }, 0);

      setProjectSumBudget(sum);

    }
  }, [projects]);

  const mutationPatchArea = useMutation(
    async () => {
      return await apiClient.patch(`areas/${areaId}/`, { name: areaName });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("Areas");
        setRemenberAreaName(areaName);
      },
      onError: (error) => {
        console.error("Error al actualizar el área del administrador:", error);
        alert(
          `There was an error updating the administrator area name: \n Error: ${error} `
        );
        setAreaName(remenberAreaName);
      },
    }
  );

  const handleDoneChangeArea = (event) => {
    event.stopPropagation();


    if (areaName !== "") {
      mutationPatchArea.mutate();
      setAreaNameChange(false);
    }
  };

  const handleOpenPopUp = (event) => {
    event.stopPropagation();
    setOpenPopup(!openPopup);
  };

  const toggleOpen = () => {
    setOpenCollapsableRow((cur) => !cur);
  };

  const TABLE_HEAD = ["Project Manager", "Project Name", "Status"];

  return (
    <>
      <div>
        <ListItem
          onClick={toggleOpen}
          className="flex flex-col items-start md:flex-row md:justify-between md:items-center"
        >
          <header className="relative z-10 flex flex-col md:flex-row w-full space-y-2 md:-space-y-0">
            <div className="flex flex-col w-5/6 pr-3  md:items-center md:flex-row space-y-2 md:-space-y-0  ">
              <section className="flex flex-row space-x-4 pr-8 md:w-2/3 group">
                {areNameChange ? (
                  <div className="flex flex-row items-center w-full space-x-4">
                    <Input
                      placeholder={areaName}
                      variant="Static"
                      onChange={(e) => setAreaName(e.target.value)}
                    />
                    <CheckIcon
                      color="gray"
                      className="h-6 w-6  "
                      onClick={handleDoneChangeArea}
                    />
                  </div>
                ) : (
                  <>
                    <Typography color="black" variant="h5">
                      {areaName}
                    </Typography>

                    <div className="flex flex-col ml-2 justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <PencilIcon
                        className="h-4 w-4"
                        color="gray"
                        onClick={() => setAreaNameChange(true)}
                      />
                    </div>
                  </>
                )}
              </section>

              <section className="flex flex-row w-full space-x-2 justify-start items-center  md:w-1/2 group ">
                <Avatar
                  variant="circular"
                  alt="user 1"
                  className="border-2 border-white hover:z-10 focus:z-10"
                  src = {currentAreaAdmin.profile_picture || "/img/people/noProfile1.jpg"}
                />

                <div className="flex flex-col justify-center">
                  <Typography variant="small">{`${currentAreaAdmin.first_name} ${currentAreaAdmin.last_name}`}</Typography>
                  <Typography variant="small">
                    {currentAreaAdmin.email}
                  </Typography>
                </div>

                <div>
                  <div className=" flex flex-col ml-2 justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <PencilIcon
                      className="h-4 w-4"
                      color="gray"
                      onClick={handleOpenPopUp}
                    />
                  </div>
                </div>
              </section>
            </div>

            <div className="flex w-full md:w-1/3 flex-row justify-evenly md:justify-between md:items-center  ">
              <Chip
                variant="ghost"
                className="flex items-center justify-center h-fit"
                value={`Projects:  ${projects ? projects.length : 0}`}
              />

              <Chip
                variant="ghost"
                className="flex items-center justify-center w-auto h-fit"
                color="green"
                value={`Budget: $${projectSumBudget}`}
              />
            </div>
          </header>
        </ListItem>

        <Collapse open={openCollapsedRow} className="">
          <Card className="relative z-0 mt-4">
            <div className="flex flex-col w-full">
              <div className=" flex flex-row justify-center mb-4">
                <Typography variant="h6" color="gray">
                  {" "}
                  Area projects{" "}
                </Typography>
              </div>
              <div className="flex flex-col w-full space-y-6  md:flex-row md:space-y-0 ">
                {projects ? (
                  <TableThreeColumns titles={TABLE_HEAD} content={projects} />
                ) : (
                  <SpinnerCustom />
                )}
              </div>
            </div>
          </Card>
        </Collapse>
      </div>

      <PopUpChangeAreaAdmin
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
        handleOpenPopUp={handleOpenPopUp}
        currentAdmin={currentAreaAdmin}
      />
    </>
  );
}
