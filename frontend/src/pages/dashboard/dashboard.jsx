import { NavigationTopBar } from "@/widgets/layout";
import { ListCard, ListRowWithImage } from "@/widgets/list";
import ListRowStructure from "@/widgets/list/listRowStructure";
import { NumberInfo } from "@/widgets/statistics/numberInfo";
import Chart from "@/widgets/statistics/chart";
import { Button, Card, Typography } from "@material-tailwind/react";

function Dashboard() {
  const workers = [
    {
      rowName: "Kevin Nieto Curaca",
      description: "Project Manager",
      area: "Area 1",
    },
    { rowName: "John Doe", description: "Developer", area: "Area 2" },
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
    <div className="md:flex h-full md:flex-row w-full  my-2 px-2 min-h-0 ">
      {/* Columna izquierda */}
      <div className="w-full max-h-96 flex flex-col min-h-0 md:h-full md:max-h-none md:w-1/3 md:mr-6">
        <ListCard 
          numberOfItems={33}
          title={"Areas"}
          hasAdd={true}
          hasSeeAll={false}
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
      </div>

      {/* Columna derecha */}
      <div className="flex flex-col h-auto md:h-full w-full md:w-2/3 min-h-0  ">
        <div className="mb-2 space-y-2 h flex flex-col w-full md:space-x-6 md:space-y-0 md:flex-row md:h-1/2 min-h-0">
          {/* Aquí iría el contenido para trabajadores y finanzas */}
          <ListCard
            title={"Workers"}
            hasAdd={true}
            hasSeeAll={false}
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

          <ListCard title={"Finance"} hasAdd={false} hasSeeAll={true}>
            <NumberInfo
              description={"Total investment in projects"}
              number={"$2.500.000"}
            />
          </ListCard>
        </div>
        <div className="flex flex-col h-96 md:h-1/2 md:mt-2 ">
          {/* Aquí iría el contenido para estadísticas */}

          <div className="flex flex-col h-full w-full  ">
            <Card className="flex h-full w-full flex-col justify-center items-center">
              <div className="flex h-auto w-full flex-col md:flex-row md:h-full justify-center items-center">
                <Chart
                  description={"Percentage of budget by area"}
                  type={"bar"}
                />
                <Chart description={"Monthly expenses for 2024"} type={"pie"} />
                <Chart
                  description={"Percentage of projects by status"}
                  type={"pie"}
                />
              </div>

              <Button
                color="gray"
                size="sm"
                variant="outlined"
                className="mb-4"
              >
                See all
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
