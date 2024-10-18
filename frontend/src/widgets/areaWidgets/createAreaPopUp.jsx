import { useUser, useCreateArea, useAdminAvailables } from "@/hooks";
import { useEffect, useState } from "react";
import { PopUp } from "@/widgets/popUp";
import { Typography, Input, Button } from "@material-tailwind/react";
import { TableWithCheckBox } from "@/widgets/areaWidgets/tableWithCheckbox";
import apiClient from "@/services/apiClient";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { SpinnerCustom } from "../layout";

export function CreateAreaPopUp({ open, setOpen, handleOpen }) {
  const { data: user, isLoading: isUserLoading } = useUser();

  const [areaName, setAreaName] = useState("");

  const [selectId, setSelectedId] = useState(null);

  const [infoFetch, setInfoFetch] = useState("");

 

  const { data: adminsAvailable, isLoading: isLoadingAdminAvailable } =
    useAdminAvailables();

  /*--------------------------------------------*/

  //Create area process

  const createAreaMutation = useCreateArea();

  const handleAreaNameChange = (event) => {
    setAreaName(event.target.value);
  };

  const handleAreaCreation = async () => {
    console.log("Area creation AREA NAME: ", areaName);
    console.log("Area creation SELECT ID: ", selectId);

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

        <Typography>Select the user in charge of managing the area:</Typography>
      </div>

      <div className=" overflow-auto h-80 w-full ">
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
  );
}
