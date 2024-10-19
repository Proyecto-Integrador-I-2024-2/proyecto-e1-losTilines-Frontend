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
  selectLabel,
  selectOptions,
  setSelectedValue,
  setCurrentRow,
  rowId,
}) {
  const [openCollapse, setOpenCollapse] = useState(false); //Used to open the collapse
  const [editSelection, setEditSelection] = useState(false); //Used to edit the selection
  const [selectedValue, setSelectedValueInner] = useState(null); //Used to store the selected value

  /*-----------------------------------------*/

  // Select input state and handler

  const handleSelectChange = (value) => {
    setSelectedValueInner(value);
    // Puedes realizar otras acciones aquí, como enviar el valor al backend
  };

  /*-----------------------------------------*/

  const toggleOpen = (event) => {
    event.stopPropagation();
    console.log("toggleOpen");
    setOpenCollapse((cur) => !cur);
    console.log("rowId", rowId);
    setCurrentRow(rowId)
    
  };

  return (
    <>
      <main
        onClick={toggleOpen}
        className="flex flex-col space-y-2 md:space-y-0 items-start mb-6 md:flex-row md:justify-between md:items-center overflow-visible"
      >
        {/*Edit profile*/}
        <section className="flex flex-row w-full space-x-2 justify-start items-center  md:w-1/2 group">
          <Avatar
            variant="circular"
            alt="user 1"
            className="border-2 border-white hover:z-10 focus:z-10"
            src="/img/people/persona1.jpg"
          />

          <div className="flex flex-col justify-center items-start">
            <Typography>{rowName}</Typography>

            <Typography>{description}</Typography>
          </div>

          <PencilIcon
            className="  h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            color="gray"
            onClick={() => {
              setOpenPopup((prev) => !prev);
              console.log("PencilIcon clicked");
            }}
          />
        </section>

        {/*Edit areas*/}
        <section className="flex flex-row justify-evenly h-full w-full mt-1 space-x-2 md:mt-0  md:justify-end items-center md:w-1/2 group">
          {editSelection ? (
            <div className="flex flex-col space-y-2 md:space-x-4 md:flex-row ">
              <Chip
                variant="ghost"
                className="flex items-center justify-center"
                z
                value={chipValue1}
              />

              <div className="flex flex-row justify-between items-center">
                <div
                  className="w-1/2 relative z-50"
                  onClick={(event) => event.stopPropagation()}
                >
                  <Select
                    size="md"
                    label={selectLabel}
                    onChange={handleSelectChange}
                  >
                    {selectOptions ? (
                      selectOptions.map((option) => (
                        <Option
                          key={option.id}
                          value={{ id: option.id, value: option.value }}
                        >
                          {option.value}
                        </Option>
                      ))
                    ) : (
                      <SpinnerCustom />
                    )}
                  </Select>
                </div>

                <CheckIcon
                  color="gray"
                  className="h-6 w-6"
                  onClick={(event) => {
                    event.stopPropagation();
                    setEditSelection(false);
                    setSelectedValue(selectedValue);
                  }}
                />
              </div>
            </div>
          ) : (
            <>
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

              <button
                onClick={(event) => {
                  event.stopPropagation();
                  console.log("PencilIcon clicked - Edit Profile");
                  setCurrentRow(rowId); // Establece el trabajador seleccionado
                  setOpenPopup(true); // Abre el popup de edición
                }}
                className="p-0 m-0 focus:outline-none"
                aria-label="Edit Worker Profile"
              >
                <PencilIcon
                  className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                  color="gray"
                />
              </button>
            </>
          )}
        </section>
      </main>

      <Collapse open={openCollapse}>
        <Card>{children}</Card>
      </Collapse>
    </>
  );
}

export default ListCollapseGeneral;
