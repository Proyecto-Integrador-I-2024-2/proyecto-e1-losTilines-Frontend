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

export function PopUp({
  buttonDescription,
  title,
  setAreaName,
  submitFunc,
  children,
}) {
  const [open, setOpen] = useState(false);
  
  const handleOpen = () => setOpen(!open);

  const handleConfirm = async () => {
    const result = await submitFunc();

    if (result) setOpen(!open);
  };

  return (
    <>
      <Button onClick={handleOpen} variant="gradient">
        {buttonDescription}
      </Button>
      <Dialog className="w-full  " open={open} handler={handleOpen}>
        <DialogHeader className="flex flex-row justify-center items-center">
          {title}
        </DialogHeader>
        <DialogBody className="flex flex-col justify-center items-center p-0 w-full space-y-4 ">
          {children}
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

export default PopUp;
