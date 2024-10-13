import React from "react";
import {
  List,
  ListItem,
  Card,
  Typography,
  Button,
  Chip,
} from "@material-tailwind/react";

export function ListRowStructure({
  rowName,
  chipValue,
  chipValue2,
  setSelected
}) {
  return (
    <ListItem className="flex-row justify-between">
      <div className="flex flex-col justify-start">
        <Typography color="black" variant="lead">
          { rowName !=  undefined? rowName :"No rowname assigned"  }
        </Typography>
   
      </div>
      <div className=" flex  flex-row space-x-2">
        
        {chipValue && (
          <Chip
            variant="ghost"
            className="w-28 flex items-center justify-center"
            size="lg"
            value={chipValue}
          />
        )}

        {chipValue2 && (
          <Chip
            variant="ghost"
            className="w-28 flex items-center justify-center"
            size="lg"
            value={chipValue2}
          />
        )}
      </div>
    </ListItem>
  );
}

export default ListRowStructure;
