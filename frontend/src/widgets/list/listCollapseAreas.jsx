import React, { Children } from "react";

import {
  ListItem,
  Typography,
  Avatar,
  Chip,
  Collapse,
  Card,
} from "@material-tailwind/react";
import { useState } from "react";

export function ListAreasCollapse({
  title,
  rowName,
  chipValue1,
  chipValue2,
  children,
}) {
  const [open, setOpen] = useState(false);

  const toggleOpen = () => {
    setOpen((cur) => !cur);
  };

  return (
    <div>
      <ListItem
        onClick={toggleOpen}
        className="flex flex-col items-start md:flex-row md:justify-between md:items-center"
      >
        <header className="flex flex-row w-full ">
          <div className="flex flex-col w-5/6 pr-3 md:items-center md:flex-row  ">
            <div className="md:w-2/3">
              <Typography color="black">{title}</Typography>
            </div>

            <div className="flex flex-row w-full space-x-2 justify-start items-center  md:w-1/2 ">
              <Avatar
                variant="circular"
                alt="user 1"
                className="border-2 border-white hover:z-10 focus:z-10"
                src="/img/people/persona1.jpg"
              />

              <div className="flex flex-col justify-center">
                <Typography variant="small">{rowName}</Typography>
                <Typography variant="small">Area admin</Typography>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center space-y-2  w-1/3 md:space-y-0 md:flex-row md:justify-between md:items-center  ">
            <Chip
              variant="ghost"
              className="flex items-center justify-center h-fit"
              value={`Projects:  ${chipValue1}`}
            />

            <Chip
              variant="ghost"
              className="flex items-center justify-center h-fit"
              color="green"
              value={chipValue2}
            />
          </div>
        </header>
      </ListItem>

      <Collapse open={open}>
        <Card>{children}</Card>
      </Collapse>
    </div>
  );
}

export default ListAreasCollapse;
