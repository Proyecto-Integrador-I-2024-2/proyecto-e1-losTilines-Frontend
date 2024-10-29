import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { SpinnerCustom } from "../layout";

export function   PopUp({
  title,
  submitFunc,
  children,
  open,
  setOpen,
  handleOpen,
  isFit,
  disableSubmit
}) {

  const [submitStatus, setSubmit] = useState("idle");

  const handleConfirm = async () => {

    setSubmit("submitting");
    await submitFunc();
    setSubmit("completed");
    
    setOpen(!open);
  };

  const handleClose = async () => {
    
    setOpen(!open);
  };

  return (
    <>
      <Dialog className={`w-full ${ isFit?"h-fit" : "h-5/6"}  overflow-y-auto`} open={open} handler={handleOpen}>
        <DialogHeader className="flex flex-row justify-center items-center">
          {title}
        </DialogHeader>
        <DialogBody className="flex flex-col   justify-center items-center p-0 w-full space-y-4 ">
          {

            submitStatus === "submitting" ? (<SpinnerCustom/>) : (children)

          }
        </DialogBody>
        <DialogFooter className="flex-col justify-end items-end">
          <div className="flex flex-row space-x-2  ">

          <Button
            variant="text"
            color="gray"
            onClick={handleClose}
            className="mr-1"
          >
            Close
          </Button>
          <Button variant="gradient" color="cyan" onClick={handleConfirm} disabled={disableSubmit}>
            Confirm 
          </Button>

          </div>
     
        </DialogFooter>
      </Dialog>
    </>
  );
}

export default PopUp;
