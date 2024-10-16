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
  title,
  submitFunc,
  children,
  open,
  setOpen,
  handleOpen,
}) {
  const handleConfirm = async () => {
    setOpen(!open);
  };

  const handleClose = async () => {
    setOpen(!open);
  };

  console.log("OPEN: ", open);

  return (
    <>
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
            color="gray"
            onClick={handleClose}
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
