import React from "react";
import {
  List,
  ListItem,
  Card,
  Typography,
  Button,
  Chip,
  Avatar,
} from "@material-tailwind/react";

export function ListRowWithImage({ avatar, rowName, description, chipValue, setSelected, id }) {
  return (
    <ListItem className="flex-row w-full justify-start" onClick={() => setSelected(id)}>
      <section>
        <Avatar
          variant="circular"
          className="border-2 border-white hover:z-10 focus:z-10"
          src={avatar}
        />
      </section>

      <main className="flex w-full flex-col md:flex-row md:justify-between space-y-2 ">
        <div className="flex flex-col justify-center ml-3">
          <Typography className="font-medium" color="black" variant="paragraph">
            {rowName}
          </Typography>
          <Typography color="blue-gray" size="sm">
            {description}
          </Typography>
        </div>

        <div className="ml-3 flex md:flex-col md:justify-center md:items-end">
          <Chip
            variant="ghost"
            className="w-fit flex items-center justify-center"
            value={chipValue}
          />
        </div>
      </main>
    </ListItem>
  );
}

export default ListRowWithImage;
