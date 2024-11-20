import { CollapseCustom, PopoverCustom, SelectCustom } from "@/widgets/buttons";
import { TableProjects } from "@/widgets/tables";
import { projectsDataDashboard } from "@/data";
import { Card, Input } from "@material-tailwind/react";

import { TrashIcon, BookmarkSquareIcon } from "@heroicons/react/24/solid";
import { ListProjectCollapse } from "@/widgets/list";

function Projects() {
  //Info for collapse buttons.

  const addContent =
    "Give this code to your workers to add them to your team #42123";

  //Info for select buttons.
  const sortContent = ["name"];

  const areaInfo = ["Area1", "Area2", "Area3", "Area4"];

  //Info for table creation.

  const TABLE_HEAD = ["Worker", "Milestone", "Status"];

  return (
    <Card
      className="flex  flex-col items-center 
                h-full w-full p-2   
                md:w-8/12 md:mx-auto md:my-4"
    >
      <header className="flex flex-col w-full h-auto   md:flex-row md:justify-start md:items-center  ">
        <section className="w-full md:w-3/4 md:mr-4">
          <Input id="search" label="search" />
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
        {projectsDataDashboard.map((project) => (
          <ListProjectCollapse
            AreasCollapse
            key={project.id}
            title={project.project}
            chipValue1={project.quantity}
            chipValue2={project.budget}
          >
            <div className="flex flex-col w-full  space-y-2">
              <div className="flex flex-col w-full space-y-6  md:flex-row md:space-y-0 ">
                <TableProjects
                  titles={TABLE_HEAD}
                  content={project.milestones}
                />
              </div>
            </div>
          </ListProjectCollapse>
        ))}
      </main>
    </Card>
  );
}

export default Projects;
