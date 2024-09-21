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


export function ListRowCollapse({ rowName, chipValue1, chipValue2, children }) {
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
        <section className="flex flex-row w-full space-x-2 justify-start items-center  md:w-2/3 ">
          <Avatar
            variant="circular"
            alt="user 1"
            className="border-2 border-white hover:z-10 focus:z-10"
            src="/img/people/persona1.jpg"
          />
          <Typography  >
            {rowName}
          </Typography>
        </section>

        <section className="flex flex-row h-full w-full mt-1 space-x-2 md:mt-0  md:justify-end items-center md:w-1/3    ">
          <Chip
            variant="ghost"
            className="flex items-center justify-center"
            value={chipValue1}
          />

          <Chip
            variant="ghost"
            className="flex items-center justify-center"
            value={chipValue2}
          />
        </section>
      </ListItem>

      <Collapse open={open}>
        <Card>{children}</Card>
      </Collapse>
    </div>
  );
}

export default ListRowCollapse;
