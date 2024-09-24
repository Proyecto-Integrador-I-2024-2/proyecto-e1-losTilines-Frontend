import React from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Typography,
} from "@material-tailwind/react";
import { CustomList } from "../horList";

export function CreateArea({ description, children }) {
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => setOpen(!open);

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
              <Input label="Area name"></Input>
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
          <Button variant="gradient" color="cyan" onClick={handleOpen}>
            <span>Confirm</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}

export default CreateArea;
