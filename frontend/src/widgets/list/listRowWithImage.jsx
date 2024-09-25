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

export function ListRowWithImage({ rowName, description, chipValue }) {
  return (
    <ListItem className="flex-row justify-between">
      <div className="flex flex-row justify-start">
        <Avatar
          variant="circular"
          alt="user 1"
          className="border-2 border-white hover:z-10 focus:z-10"
          src="/img/people/persona1.jpg"
        />
        <div className="flex flex-col justify-center ml-3">
          <Typography className="font-medium" color="black" variant="paragraph">
            {rowName}
          </Typography>
          <Typography color="blue-gray" size="sm">
            {description} 
          </Typography>
        </div>
      </div>
      <div>
        <Chip variant="ghost" className="w-28 flex items-center justify-center"  value={chipValue} />
      </div>
    </ListItem>
  );
}

export default ListRowWithImage;
