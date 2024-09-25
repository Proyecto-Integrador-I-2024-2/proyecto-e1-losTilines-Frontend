// Importaciones necesarias
import {
  ChevronUpDownIcon,
} from "@heroicons/react/24/outline";
import {
  Card,
  Typography,
  CardBody,
  Avatar,
  Checkbox,
} from "@material-tailwind/react";
import { useState } from "react";

// Definición de los encabezados de la tabla
const TABLE_HEAD = ["Member", "Is Check?"];

// Componente TableWithCheckBox
export function TableWithCheckBox({ content, selectedId, setSelectedId }) {

  // Función para manejar la selección del checkbox
  const handleSelect = (id) => {
    if (selectedId === id) {
      setSelectedId(null);
    } else {
      setSelectedId(id);
    }
    console.log("SELECTED ID: ", selectedId); 
  }

  return (
    <Card className="h-full w-full">
      <CardBody className="overflow-scroll px-0">
        <table className="m-4 w-full table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD.map((head, index) => (
                <th
                  key={head}
                  className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50"
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                  >
                    {head}{" "}
                    {index !== TABLE_HEAD.length - 1 && (
                      <ChevronUpDownIcon strokeWidth={2} className="h-4 w-4" />
                    )}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {content && content.length > 0 ? (
              content.map(
                ({ img, name, email, id }, index) => {
                  const isLast = index === content.length - 1;
                  const classes = isLast
                    ? "p-4"
                    : "p-4 border-b border-blue-gray-50";

                  return (
                    <tr key={id}>
                      <td className={classes}>
                        <div className="flex items-center gap-3">
                          <Avatar src={img} alt={name} size="sm" />
                          <div className="flex flex-col">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {name}
                            </Typography>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal opacity-70"
                            >
                              {email}
                            </Typography>
                          </div>
                        </div>
                      </td>
                      <td className={classes}>
                        <div className="w-max">
                          <Checkbox
                            checked={selectedId === id}
                            onChange={() => handleSelect(id)}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                },
              )
            ) : (
              // Mostrar una fila con un mensaje cuando no hay datos
              <tr>
                <td colSpan={TABLE_HEAD.length} className="p-4 text-center">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal opacity-70"
                  >
                   No area admins available
                  </Typography>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </CardBody>
    </Card>
  );
}

export default TableWithCheckBox;
