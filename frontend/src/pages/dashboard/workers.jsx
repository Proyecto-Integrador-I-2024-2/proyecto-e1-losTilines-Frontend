import { CollapseCustom, PopoverCustom, SelectCustom } from "@/widgets/buttons";
import { ListWorkersCollapse } from "@/widgets/list";
import { ChartCustom } from "@/widgets/statistics";
import { TableTwoColums } from "@/widgets/tables";
import { workerData } from "@/data";
import { Card, Input } from "@material-tailwind/react";
import { useUser } from "@/hooks";
import { TrashIcon } from "@heroicons/react/24/solid";

function Workers() {
  //Info for collapse buttons.
  const user = useUser();
  console.log(user.data)
  const addContent =
    "Give this code to your workers to add them to your team #42123";

  //Info for select buttons.
  const sortContent = ["name", "area"];

  const roleInfo = ["Area admin", "Project maanger"];

  const areaInfo = ["Area1", "Area2", "Area3", "Area4"];

  //Info for table creation.

  const TABLE_HEAD = ["Project Name", "Status"];

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
        {workerData.map((worker) => (
          <ListWorkersCollapse
            key={worker.id}
            rowName={worker.name}
            chipValue1={worker.role}
            chipValue2={worker.area}
          >
            <div className="flex flex-col w-full p-4 space-y-2">
              <div className="flex flex-col w-full space-y-2 md:flex-row md:items-center md:justify-evenly mb-5 ">
                <SelectCustom
                  description={"Assign area"}
                  options={areaInfo}
                  label={"area"}
                />
                <SelectCustom
                  description={"Assign role"}
                  options={roleInfo}
                  label={"role"}
                />
              </div>
              <div className="flex flex-col w-full space-y-6  md:flex-row md:space-y-0 ">
                <TableTwoColums titles={TABLE_HEAD} content={worker.projects} />

                <div className="flex flex-row">
                  <ChartCustom description={"Project status distribution"} />

                  <div className="flex flex-col justify-end mb-6">
                    <TrashIcon className="h-6 w-6 text-gray-800 cursor-pointer" />
                  </div>
                </div>
              </div>
            </div>
          </ListWorkersCollapse>
        ))}
      </main>
    </Card>
  );
}

export default Workers;
