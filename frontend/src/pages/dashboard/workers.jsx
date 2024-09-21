import { CollapseSelection } from "@/widgets/buttons";
import PopoverCustom from "@/widgets/buttons/popOverCustom";
import {
  Card,
  Input,
  Popover,
  Select,
  Typography,
} from "@material-tailwind/react";

function Workers() {
  const orderContent = [{ description: "By name" }, { description: "By area" }];

  const addContent = "Give this code to your workers to add them to your team #42123";

  const filterContent = ["Area1", "Area2", "Area3", "Area4"];

  const sortContent = ["name", "area"];


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
          <CollapseSelection
            label={"Select type"}
            title={"Sort"}
            description={"sort by"}
            options={sortContent}
          />
          <CollapseSelection
            label={"area"}
            title={"Filter"}
            description={"filter by"}
            options={filterContent}
          />

          <PopoverCustom title={"Add"} content={addContent} />
        </section>
      </header>
    </Card>
  );
}

export default Workers;
