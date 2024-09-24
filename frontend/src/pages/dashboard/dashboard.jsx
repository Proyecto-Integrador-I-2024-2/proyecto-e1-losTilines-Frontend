import { ListCard, ListRowWithImage } from "@/widgets/list";
import ListRowStructure from "@/widgets/list/listRowStructure";
import { NumberInfo } from "@/widgets/statistics/numberInfo";
import Chart from "@/widgets/statistics/chart";
import { Button, Card, Typography } from "@material-tailwind/react";
import { useUser } from "@/hooks";
function Dashboard() {

  const user = useUser();

  console.log(sessionStorage.getItem("token"));


  const workers = [
    {
      rowName: "Kevin Nieto Curaca",
      description: "Project Manager",
      area: "Area 1",
    },
    { rowName: "John Doe", description: "Developer", area: "Area 2" },
    { rowName: "Jane Smith", description: "Designer", area: "Area 3" },
    { rowName: "Jane Smith", description: "Designer", area: "Area 3" },
    { rowName: "Jane Smith", description: "Designer", area: "Area 3" },
    { rowName: "Jane Smith", description: "Designer", area: "Area 3" },

    { rowName: "Jane Smith", description: "Designer", area: "Area 3" },
  ];

  const areas = [
    {
      rowName: "Human Resources",
      statistics: "10/16",
      projects: "15 Projects",
    },
    { rowName: "Finance", statistics: "5/20", projects: "12 Projects" },
    { rowName: "Marketing", statistics: "7/18", projects: "10 Projects" },
    { rowName: "Sales", statistics: "7/18", projects: "3 Projects" },
    { rowName: "IT Support", statistics: "7/18", projects: "2 Projects" },
    { rowName: "Operations", statistics: "2/18", projects: "8 Projects" },
    {
      rowName: "Research and Development",
      statistics: "11/18",
      projects: "20 Projects",
    },
    {
      rowName: "Customer Service",
      statistics: "2/10",
      projects: "5 Projects",
    },
    { rowName: "Legal", statistics: "15/20", projects: "9 Projects" },
  ];

  return (
    <div className="h-full md:flex  md:flex-row w-full  my-2 px-2 min-h-0 ">
      {/* Columna izquierda */}
      <section className="w-full h-96 flex flex-col  md:mb-0 md:w-1/3 md:h-full md:max-h-none  md:mr-6">
        <ListCard
          numberOfItems={33}
          title={"Areas"}
          hasAdd={true}
          hasSeeAll={true}
          addDescription={"New Area"}
        >
          {areas.map((area, index) => (
            <ListRowStructure
              key={index}
              rowName={area.rowName}
              statistics={area.statistics}
              chipValue={area.projects}
            />
          ))}
        </ListCard>
      </section>

      {/* Columna derecha */}
      <section className="flex flex-col  md:w-2/3  ">
        <div className="flex flex-col h-auto min-h-0 w-full mb-2 my-4 md:my-0 md:flex-row md:h-1/2  ">
          {/* Aquí iría el contenido para trabajadores y finanzas */}

          <div className="flex flex-col h-auto w-full md:space-x-6  md:flex-row  md:h-full">
           
            <div className="h-96 my-4 md:my-0 md:h-full md:w-full">
            <ListCard
              title={"Workers"}
              hasAdd={false}
              hasSeeAll={true}
              addDescription={"New worker"}
            >
              {workers.map((worker, index) => (
                <ListRowWithImage
                  key={index}
                  rowName={worker.rowName}
                  description={worker.description}
                  chipValue={worker.area}
                />
              ))}
            </ListCard>
            </div>
            <ListCard title={"Finance"} hasAdd={false} hasSeeAll={true}>
              <NumberInfo
                description={"Total investment in projects"}
                number={"$2.500.000"}
              />
            </ListCard>
          </div>  
        </div>

        {/* Aquí iría el contenido para estadísticas */}

        <Card className="flex w-full flex-col  mb-2 p-4 
         h-auto items-center md:h-1/2 md:mt-2 md:mb-0 
        
            ">
          <div className="flex h-auto w-full flex-col md:flex-row md:h-full justify-center items-center">
            <Chart description={"Monthly expenses for 2024"} type={"pie"} />

            <Chart description={"Percentage of budget by area"} type={"bar"} />
            <Chart
              description={"Percentage of projects by status"}
              type={"pie"}
            />
          </div>

          <Button color="gray" size="sm" variant="outlined" className="w-32">
            See all
          </Button>
        </Card>
      </section>
    </div>
  );
}

export default Dashboard;
