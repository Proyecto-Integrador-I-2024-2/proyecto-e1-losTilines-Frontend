import { ListCard, ListRowWithImage } from "@/widgets/list";
import ListRowStructure from "@/widgets/list/listRowStructure";
import { NumberInfo } from "@/widgets/statistics/numberInfo";
import Chart from "@/widgets/statistics/chart";
import { Button, Card, Typography } from "@material-tailwind/react";
import { useUser, useAreas } from "@/hooks";
import useWorkers from "@/hooks/useWorkers";
function Dashboard() {
  const user = useUser();

  const { data: areas, isLoading: areasLoading } = useAreas();

  const { data: workersData, isLoading: workersLoading } = useWorkers();

  console.log("WORKERS: ", workersData);
  console.log("USUARIO: ", user.data);

  console.log("AREAS IDENTIFICADAS", areas);

  console.log(sessionStorage.getItem("token"));

  return (
    <div className="h-full md:flex md:flex-row w-full my-2 px-2 min-h-0">
      {/* Columna izquierda */}
      <section className="w-full h-96 flex flex-col md:mb-0 md:w-1/3 md:h-full md:max-h-none md:mr-6">
        <ListCard
          numberOfItems={33}
          title={"Areas"}
          hasAdd={true}
          hasSeeAll={true}
          addDescription={"New Area"}
        >
          {areas != undefined ? (
            areas.map((area, index) => (
              <ListRowStructure
                key={index}
                rowName={area.name}
                statistics={""}
                chipValue={"$1.500.230"}
              />
            ))
          ) : (
            <div>Cargando...</div>
          )}
        </ListCard>
      </section>

      {/* Columna derecha */}
      <section className="flex flex-col md:w-2/3">
        <div className="flex flex-col h-auto min-h-0 w-full mb-2 my-4 md:my-0 md:flex-row md:h-1/2">
          <div className="flex flex-col h-auto w-full md:space-x-6 md:flex-row md:h-full">
            <div className="h-96 my-4 md:my-0 md:h-full md:w-full">
              <ListCard
                title={"Workers"}
                hasAdd={false}
                hasSeeAll={true}
                addDescription={"New worker"}
              >
                {workersData != undefined ? (
                  workersData.map((worker, index) => (
                    <ListRowWithImage
                      key={index}
                      rowName={`${worker.first_name}  ${worker.last_name}` }
                      description={worker.email  }
                      chipValue={worker.phone_number}
                    />
                  ))
                ) : (
                  <div>Cargando...</div>
                )}
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

        <Card className="flex w-full flex-col mb-2 p-4 h-auto items-center md:h-1/2 md:mt-2 md:mb-0">
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
