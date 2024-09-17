import React from "react";
import {
  List,
  ListItem,
  Card,
  Typography,
  Button,
  Chip,
} from "@material-tailwind/react";

export function ListRowStructure({ rowName, statistics, children }) {
  return (
    <ListItem className="flex-row justify-between">
      <div className="flex flex-col justify-start">
        <Typography color="black" variant="lead">{rowName}</Typography>
        <Typography color="blue-gray" size="sm">
          {statistics} completed
        </Typography>
      </div>
      <div>
        <Chip variant="ghost" size="chip small" value = {children} />

        
      </div>
    </ListItem>
  );
}

export default ListRowStructure;
