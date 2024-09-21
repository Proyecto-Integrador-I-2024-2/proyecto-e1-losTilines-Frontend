import {
  Card,
  Typography,
  CardBody,
  Chip,

} from "@material-tailwind/react";
 
  
export function TableTwoColums({titles, content}) {
  return (
    <Card className="h-full w-full">

      <CardBody className="overflow-scroll px-0 p-0">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {titles.map((head) => (
                <th
                  key={head}
                  className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70"
                  >
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {content.map(
              ({id, status, projectName  }, index) => {
                const isLast = index === content.length - 1;
                const classes = isLast
                  ? "p-4"
                  : "p-4 border-b border-blue-gray-50";
 
                return (
                  <tr key={id}>

                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {projectName}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <div className="w-max">
                        <Chip
                          variant="ghost"
                          size="sm"
                          value={status}
                          color={status === "done"? "green" : "cyan"}
                        />
                      </div>
                    </td>
                  </tr>
                );
              },
            )}
          </tbody>
        </table>
      </CardBody>
    </Card>
  );
}

export default TableTwoColums;