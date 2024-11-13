import React, { Children, useEffect } from "react";
import { PencilIcon, CheckIcon } from "@heroicons/react/24/solid";

import {
  Typography,
  Avatar,
  Chip,
  Collapse,
  Card,
  Select,
  Option,
  ListItem,
} from "@material-tailwind/react";
import { useState } from "react";
import { SpinnerCustom } from "../layout";

export function ListCollapseGeneral({
  rowName,
  description,
  chipValue1,
  chipValue2,
  children,
  setOpenPopup,
  setCurrentRow,
  rowId,
  colorChip2,
  imageRow,
}) {
  const [openCollapse, setOpenCollapse] = useState(false); //Used to open the collapse
  const [selectedValue, setSelectedValueInner] = useState(null); //Used to store the selected value

  /*-----------------------------------------*/

  // Select input state and handler

  const handleSelectChange = (value) => {
    console.log("Selected value:", value);
    setSelectedValueInner(value);
  };

  /*-----------------------------------------*/

  const toggleOpen = (event) => {
    event.stopPropagation();
    setOpenCollapse((cur) => !cur);
    setCurrentRow(rowId);
  };

  return (
    <div>
      <ListItem
        onClick={toggleOpen}
        className="flex flex-col space-y-2 md:space-y-0 items-start mb-10 md:flex-row md:justify-between md:items-center overflow-visible md:mb-6"
      >
        {/*Edit profile*/}
        <section className="flex flex-row w-full space-x-2 justify-start items-center  md:w-1/2 group">
          <Avatar
            variant="circular"
            alt="user 1"
            className="border-2 border-white hover:z-10 focus:z-10"
            src={imageRow || "/img/people/noProfile1.jpg"}
          />

          <div className="flex flex-col justify-center items-start">
            <Typography>{rowName}</Typography>

            <Typography>{description}</Typography>
          </div>

          <PencilIcon
            id="pencilWorker1"
            className="  h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            color="gray"
            onClick={() => {
              setOpenPopup((prev) => !prev);
              console.log("PencilIcon clicked");
            }}
          />
        </section>

        {/*Edit areas*/}
        <section className="flex flex-row justify-evenly  w-full mt-1 space-x-2 md:mt-0 md:justify-end items-center md:w-1/2 group">
          <ChipCustom color="gray" value={chipValue1} />

          <ChipCustom color={colorChip2} value={chipValue2} />

          <button
            id="pencilWorker2"
            onClick={(event) => {
              event.stopPropagation();
              console.log("PencilIcon clicked - Edit Profile");
              setCurrentRow(rowId); // Establece el trabajador seleccionado
              setOpenPopup((prev) => !prev);
            }}
            className="p-0 m-0 focus:outline-none"
            aria-label="Edit Worker Profile"
          >
            <PencilIcon
              className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
              color="gray"
            />
          </button>
        </section>
      </ListItem>

      <Collapse open={openCollapse}>{children}</Collapse>
    </div>
  );
}

function ChipCustom({ value, classes, color }) {
  return (
    <Chip
      variant="ghost"
      color={color}
      className={`flex items-center justify-center h-fit ${classes}`}
      value={value}
    />
  );
}

export default ListCollapseGeneral;
