import { CollapseCustom, PopoverCustom, SelectCustom } from "@/widgets/buttons";
import { ChartCustom } from "@/widgets/statistics";
import { TableThreeColumns } from "@/widgets/tables";
import { areasData } from "@/data";
import { Card, Input } from "@material-tailwind/react";

import { TrashIcon, BookmarkSquareIcon} from "@heroicons/react/24/solid";
import ListAreasCollapse from "@/widgets/list/listCollapseAreas";

function Areas() {
  //Info for collapse buttons.

  const addContent =
    "Give this code to your workers to add them to your team #42123";

  //Info for select buttons.
  const sortContent = ["name"];

  const areaInfo = ["Area1", "Area2", "Area3", "Area4"];

  //Info for table creation.

  const TABLE_HEAD = ["Worker", "Project Name", "Status"];

  return (
    <Card
      className="flex  flex-col items-center 
                h-full w-full p-2   
                md:w-8/12 md:mx-auto md:my-4"
    >
      <header className="flex flex-col w-full h-auto   md:flex-row md:justify-start md:items-center  ">
        <section className="w-full md:w-3/4 md:mr-4">
          <Input label="search" />
        </section>

        <section className="flex flex-row justify-between h-10 w-full md:w-auto md:h-full">
          <CollapseCustom title={"Sort"}>
            <SelectCustom
              description={"sort by"}
              options={sortContent}
              label={"Select type"}
            />
          </CollapseCustom>
          <CollapseCustom title={"Filter"}>
            <SelectCustom
              label={"area"}
              description={"filter by"}
              options={areaInfo}
            />
          </CollapseCustom>
          <PopoverCustom title={"Add"} content={addContent} />
        </section>
      </header>

      <main className="flex flex-col h-full w-full mt-2   overflow-y-auto">
        {areasData.map((area) => (
          <ListAreasCollapse
            AreasCollapse
            key={area.id}
            title={area.area}
            rowName={area.admin}
            chipValue1={area.quantity}
            chipValue2={area.budget}
          >
            <div className="flex flex-col w-full  space-y-2">
              <div className="flex flex-row w-full md:space-x-4  my-2 md:  md:items-center md:justify-center md:mx-auto md:w-1/2 ">
                <SelectCustom
                  description={"Assign area"}
                  options={areaInfo}
                  label={"area"}
                />

                <div className="flex flex-row justify-center items-center   ">
                <BookmarkSquareIcon className="h-6 w-6 text-gray-700 cursor-pointer" />

                <TrashIcon className="h-6 w-6 text-gray-700 cursor-pointer" />
            
                </div>
               
              </div>
              <div className="flex flex-col w-full space-y-6  md:flex-row md:space-y-0 ">
                <TableThreeColumns
                  titles={TABLE_HEAD}
                  content={area.projects}
                />
              </div>
            </div>
          </ListAreasCollapse>
        ))}
      </main>
    </Card>
  );
}

export default Areas;
