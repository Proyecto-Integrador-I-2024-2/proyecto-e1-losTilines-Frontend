import { ListCard, ListRowWithImage } from "@/widgets/list";
import ListRowStructure from "@/widgets/list/listRowStructure";
import { NumberInfo } from "@/widgets/statistics/numberInfo";
import Chart from "@/widgets/statistics/chart";
import {
  Button,
  Card,
  Spinner,
  Typography,
  Input,
} from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import {
  useUser,
  useAreas,
  useAdminAreas,
  useCreateArea,
  useWorkers,
  useQueryParams,
} from "@/hooks";
import { PopUp } from "@/widgets/popUp";
import { TableWithCheckBox } from "@/widgets/tables";
import { useState } from "react";

function Dashboard() {
  //utils

  const navigateTo = useNavigate();
  const { getParams, setParams } = useQueryParams();
  const params = getParams();

  //STATES

  const [selectId, setSelectedId] = useState(null);
  const [areaName, setAreaName] = useState(null);

  //CUSTOM HOOKS

  const adminAreasAvailables = useAdminAreas();

  const user = useUser();

  const createAreaHook = useCreateArea();

  //GET DATA FROM CUSTOM HOOKS

  const { data: areas, isLoading: areasLoading } = useAreas();

  const { data: workersData, isLoading: workersLoading } = useWorkers();

  const handleAreaNameChange = (name) => {
    setAreaName(name);
    console.log("Nombre del área seleccionado:", name);
  };

  const handleAreaCreation = async () => {
    if (areaName != null && areaName.length > 0 && selectId != null) {
      console.log("Area name: ", areaName);
      await createAreaHook.mutateAsync({ name: areaName, user: selectId });

      alert("Area created succesfully.");
      return true;
    } else {
      alert(
        "Please selecet an area and a user." +
          " Nombre de area:" +
          areaName +
          ". Id:" +
          selectId
      );
      return false;
    }
  };

  const spinner = <Spinner className=" h-8 w-8" />;

  //Popup to create areea and select its area admin.

  const createArea = (
    <>
      <PopUp
        buttonDescription={"New area"}
        title={"Create New Area"}
        submitFunc={handleAreaCreation}
      >
        <div className="px-2 space-y-2">
          <Typography>
            Please enter the name of the new company being created
          </Typography>

          <div className="flex flex-row justify-center items-center w-full md:w-full ">
            <Input onChange={handleAreaNameChange} label="Area name"></Input>
          </div>

          <Typography>
            Select the user in charge of managing the area:
          </Typography>
        </div>

        <div className=" overflow-auto h-80 ">
          <TableWithCheckBox
            content={workersData}
            selectedId={selectId}
            setSelectedId={setSelectedId}
          />
        </div>
      </PopUp>
    </>
  );

  return (
    <div className="h-full md:flex md:flex-row w-full my-2 px-2 min-h-0">
      {/* Columna izquierda */}
      <section className="w-full h-96 flex flex-col md:mb-0 md:w-1/3 md:h-full md:max-h-none md:mr-6">
        <ListCard
          title={"Areas"}
          subtitle={"Areas availables"}
          hasSeeAll={() => navigateTo("areas/")}
          addContent={createArea}
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
            <div className="flex flex-col justify-center items-center">
              <Spinner className=" h-8 w-8" />
            </div>
          )}
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
                addContent={false}
                hasSeeAll={() => navigateTo("workers/")}
              >
                {workersData != undefined ? (
                  workersData.map((worker, index) => (
                    <ListRowWithImage
                      key={index}
                      rowName={worker.first_name + " " + worker.last_name}
                      description={worker.email}
                      chipValue={worker.area}
                    />
                  ))
                ) : (
                  <div className="flex flex-col justify-center items-center">
                    <Spinner className=" h-8 w-8" />
                  </div>
                )}
              </ListCard>
            </div>
            <ListCard
              title={"Finance"}
              hasAdd={false}
              hasSeeAll={true}
              route={"finance/"}
            >
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
          <Link to="stats/">
            <Button color="gray" size="sm" variant="outlined" className="w-32">
              See all
            </Button>
          </Link>
        </Card>
      </section>
    </div>
  );
}

export default Dashboard;
