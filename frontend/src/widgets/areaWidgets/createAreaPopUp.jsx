import { useUser, useCreateArea, useAdminAvailables } from "@/hooks";
import { useEffect, useState } from "react";
import { PopUp } from "@/widgets/popUp";
import { Typography, Input } from "@material-tailwind/react";
import { TableWithCheckBox } from "@/widgets/areaWidgets/tableWithCheckbox";
import { SpinnerCustom } from "../layout";

export function CreateAreaPopUp({ open, setOpen, handleOpen }) {
  //Fetchers

  const { data: user, isLoading: isUserLoading } = useUser(); // Get the current user
  
  const createAreaMutation = useCreateArea(); // Mutation hook for creating an area

  const { data: adminsAvailable, isLoading: isLoadingAdminAvailable } =
    useAdminAvailables(); // Query hook for available admins

  /*----------------------------------------------------------------------------------*/

  // Selected values for creation

  const [areaName, setAreaName] = useState("");
  const [selectId, setSelectedId] = useState(null);

  /*----------------------------------------------------------------------------------*/

  //Form validation

  const [errors, setErrors] = useState({
    areaName: "",
    selectId: "",
  }); // Storages errors messages for form validation

  const [isFormValid, setIsFormValid] = useState(false); // Form validation state

  const [infoFetch, setInfoFetch] = useState(""); // Feedback message for area creation

  // Handle changes to the area name input
  const handleAreaNameChange = (event) => {
    setAreaName(event.target.value);
  };

  // Function to validate form inputs
  const validate = () => {
    let valid = true;
    let tempErrors = {
      areaName: "",
      selectId: "",
    };

    // Validate area name
    if (!areaName.trim()) {
      tempErrors.areaName = "Area name cannot be empty.";
      valid = false;
    }

    // Validate selected user
    if (!selectId) {
      tempErrors.selectId = "Please select a user.";
      valid = false;
    }

    setErrors(tempErrors);
    return valid;
  };

  // Re-validate form whenever inputs change

  useEffect(() => {
    const tempIsValid = validate();
    setIsFormValid(tempIsValid);
  }, [areaName, selectId]);

  /*----------------------------------------------------------------------------------*/

  // Handler to create a new area

  const handleAreaCreation = async () => {
    console.log("Area creation AREA NAME: ", areaName);
    console.log("Area creation SELECT ID: ", selectId);

    // Reset feedback message
    setInfoFetch("");

    // Validate form inputs
    if (!validate()) return;

    // Prepare data for the mutation
    const areadata = {
      name: areaName.trim(),
      company: user.company,
      user: selectId, // Use the selected user ID
    };

    // Execute the mutation with success and error handlers
    createAreaMutation.mutate(areadata, {
      onSuccess: () => {
        setInfoFetch("Successful area creation process");
      },
      onError: (error) => {
        setInfoFetch(`Error creating the area: ${error.message}`);
      },
    });
  };

  /*----------------------------------------------------------------------------------*/

  return (
    <PopUp
      title={"Create New Area"}
      submitFunc={handleAreaCreation}
      open={open}
      setOpen={setOpen}
      handleOpen={handleOpen}
      disableSubmit={!isFormValid} // Disable submit button if form is invalid
    >
      <div className="px-2 space-y-2">
        <Typography>
          Please enter the name of the new area being created:
        </Typography>

        <div className="flex flex-row justify-center items-center w-full md:w-full ">
          <Input
            onChange={handleAreaNameChange}
            label="Area name"
            value={areaName}
            error={!!errors.areaName}
            helperText={errors.areaName}
          />
        </div>

        <Typography>Select the user in charge of managing the area:</Typography>
      </div>

      <div className="overflow-auto h-5/6 w-full px-8">
        {isLoadingAdminAvailable ? (
          <SpinnerCustom />
        ) : (
          <div className="flex flex-col w-full justify-center items-center">
            <TableWithCheckBox
              content={adminsAvailable}
              selectedId={selectId} 
              setSelectedId={setSelectedId}
            />
            {/* Display validation error for user selection */}
            {errors.selectId && (
              <Typography color="red" variant="small">
                {errors.selectId}
              </Typography>
            )}
          </div>
        )}
      </div>

      {/* Display feedback messages */}
      <div className="flex  flex-col justify-center items-center w-full">
        {createAreaMutation.isLoading && (
          <SpinnerCustom />
        )}
        {infoFetch && (
          <Typography color={createAreaMutation.isSuccess ? "blue" : "red"  }>
            {infoFetch}
          </Typography>
        )}
      </div>
    </PopUp>
  );
}
