import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Typography,
} from "@material-tailwind/react";

export function CreateArea({ description, setAreaName, submitFunc, children }) {
  const [open, setOpen] = React.useState(false);
  const [localAreaName, setLocalAreaName] = useState("");

  const handleAreaNameChange = (event) => {

    const {value} = event.target;
    setLocalAreaName(value); 
    setAreaName(value);

  }

  const handleOpen = () => setOpen(!open);

  const handleConfirm = async () => {

    const result = await submitFunc();

    if (result) setOpen(!open)

  }

  return (
    <>
      <Button onClick={handleOpen} variant="gradient">
        {description}
      </Button>
      <Dialog className="w-full  " open={open} handler={handleOpen}>
        <DialogHeader className="flex flex-row justify-center items-center">
          Create New Area{" "}
        </DialogHeader>
        <DialogBody className="flex flex-col justify-center items-center p-0 w-full space-y-4 ">
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

          <div className=" overflow-auto h-80 ">{children}</div>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="black"
            onClick={handleOpen}
            className="mr-1"
          >
            <span>Cancel</span>
          </Button>
          <Button variant="gradient" color="cyan" onClick={handleConfirm}>
            <span>Confirm</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}

export default CreateArea;
