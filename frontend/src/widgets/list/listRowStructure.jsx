import React from "react";
import {
  List,
  ListItem,
  Card,
  Typography,
  Button,
  Chip,
} from "@material-tailwind/react";

export function ListRowStructure({ rowName, statistics, chipValue }) {
  return (
    <ListItem className="flex-row justify-between">
      <div className="flex flex-col justify-start">
        <Typography color="black" variant="lead">{rowName}</Typography>
        <Typography color="blue-gray" size="sm">
          {statistics} completed
        </Typography>
      </div>
      <div>
        <Chip variant="ghost" className="w-28 flex items-center justify-center" size="lg" value = {chipValue} />
      </div>
    </ListItem>
  );
}

export default ListRowStructure;
