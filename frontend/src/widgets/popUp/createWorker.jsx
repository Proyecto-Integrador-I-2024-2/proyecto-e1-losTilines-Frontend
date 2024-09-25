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

export function CreateWorker({ description, setAreaName, submitFunc, children }) {
  const [open, setOpen] = React.useState(false);
  const [localAreaName, setLocalAreaName] = useState("");
  const handleAreaNameChange = (event) => {
    const { value } = event.target;
    setLocalAreaName(value);
    setAreaName(value);
  };

  const handleOpen = () => setOpen(!open);

  const handleConfirm = async () => {
    const result = await submitFunc();

    if (result) setOpen(!open);
  };

  return (
    <>
      <Button onClick={handleOpen} variant="gradient">
        {description}
      </Button>
      <Dialog className="w-full  " open={open} handler={handleOpen}>
        <DialogHeader className="flex flex-row justify-center items-center">
            Create new worker
        </DialogHeader>
        <DialogBody className="flex flex-col justify-start items-center p-0 w-full space-y-4">
          <div className="px-2 space-y-2">
            <Typography>
                Please enter th basic information to create the new worker:
            </Typography>

            <div className="flex flex-row justify-center items-center w-full md:w-full ">
              <Input onChange={handleAreaNameChange} label="First name"></Input>
              <Input onChange={handleAreaNameChange} label="Last name"></Input>

            </div>

            <div className="flex flex-row justify-center items-center w-full md:w-full ">
              <Input onChange={handleAreaNameChange} label="Username"></Input>
              <Input onChange={handleAreaNameChange} label="Phone number"></Input>
            </div>

            <div className="flex flex-row justify-center items-center w-full md:w-full ">
              <Input onChange={handleAreaNameChange} label="email"></Input>
            </div>
            <Typography>
                Select the role of the new worker:
            </Typography>

        

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

export default CreateWorker