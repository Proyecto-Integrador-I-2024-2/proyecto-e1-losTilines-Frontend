import { useUser, useCreateArea, useAdminAvailables } from "@/hooks";
import { useEffect, useState } from "react";
import { PopUp } from "@/widgets/popUp";
import { Typography, Input, Button } from "@material-tailwind/react";
import { TableWithCheckBox } from "@/widgets/areaWidgets/tableWithCheckbox";
import apiClient from "@/services/apiClient";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { SpinnerCustom } from "../layout";

export function CreateAreaPopUp() {
  const { data: user, isLoading: isUserLoading } = useUser();

  const [areaName, setAreaName] = useState("");

  const [selectId, setSelectedId] = useState(null);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(!open);


  const [infoFetch, setInfoFetch] = useState("");

  const createAreaMutation = useCreateArea();

  console.log("AREA NAME: ", areaName);
  console.log("SELECT ID: ", selectId);

  const handleAreaNameChange = (event) => {
    setAreaName(event.target.value);
  };

  const { data: adminsAvailable, isLoading: isLoadingAdminAvailable } = useAdminAvailables()

    

  const handleAreaCreation = async () => {
    if (areaName != null && areaName.length > 0 && selectId != null) {
      const areadata = {
        name: areaName,
        company: user.company,
        user: user.id,
      };

      try {
        createAreaMutation.mutate(areadata);

        if (createAreaMutation.isSuccess) {
          setInfoFetch("Successful area creation process");
        }

        if (createAreaMutation.isError) {
          setInfoFetch(`Error creating the area: ${createAreaMutation.error}`);
        }
      } catch (error) {
        console.log("Error creating area catched: ", error);
      }
    } else {
      alert(
        `Please selecet an area and a user. Nombre del area: ${areaName}. Id: "${selectId}`
      );
    }
  };



  return (
    <>
      <Button onClick={handleOpen} variant="gradient">
        New area
      </Button>

      <PopUp
        buttonDescription={"New area"}
        title={"Create New Area"}
        submitFunc={handleAreaCreation}
        open={open}
        setOpen={setOpen}
        handleOpen={handleOpen}
      >
        <div className="px-2 space-y-2">
          <Typography>
            Please enter the name of the new company being created
          </Typography>

          <div className="flex flex-row justify-center items-center w-full md:w-full ">
            <Input onChange={handleAreaNameChange} label="Area name"></Input>
          </div>

          <Typography>
            Select the user in charge of managing the area:
          </Typography>
        </div>

        <div className=" overflow-auto h-80 ">
          {isLoadingAdminAvailable ? (
            <SpinnerCustom />
          ) : (
            <TableWithCheckBox
              content={adminsAvailable}
              selectedId={selectId}
              setSelectedId={setSelectedId}
            />
          )}
        </div>

        <div>
          {createAreaMutation.isSuccess ? (
            <Typography color="blue">{infoFetch}</Typography>
          ) : createAreaMutation.isError ? (
            <Typography color="red">{infoFetch}</Typography>
          ) : (
            <Typography> Waiting for your actions :) </Typography>
          )}
        </div>
      </PopUp>
    </>
  );
}
