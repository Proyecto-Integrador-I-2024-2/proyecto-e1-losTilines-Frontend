import React from "react";
import {
  ListItem,
  Typography,
  Chip,
} from "@material-tailwind/react";
import { getStatusColor } from "@/services/colorBaseOnStatus";

export function ListRowStructure({
  rowName,
  chipValue,
  chipValue2,
  id,
  setSelected,
}) {
  return (
    <ListItem className="flex flex-col justify-start items-start md:flex-row md:justify-between" onClick={() => setSelected(id)}>
      <div className="flex flex-col justify-start">
        <Typography color="black" variant="lead">
          {rowName != undefined ? rowName : "No rowname assigned"}
        </Typography>
      </div>
      <div className=" flex  flex-row space-x-2">
        {chipValue && (
          <Chip
            variant="ghost"
            className="flex items-center justify-center"
            size="lg"
            value={chipValue}
            color={`${getStatusColor(chipValue)}`}
          />
        )}

        {chipValue2 && (
          <Chip
            variant="ghost"
            className=" flex items-center justify-center"
            size="lg"
            value={chipValue2}
          />
        )}
      </div>
    </ListItem>
  );
}

export default ListRowStructure;
