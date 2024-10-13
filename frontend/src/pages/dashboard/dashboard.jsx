import { ListCard } from "@/widgets/list";
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
import { useUser, useCreateArea, useWorkers, useQueryParams } from "@/hooks";
import { PopUp } from "@/widgets/popUp";
import { TableWithCheckBox } from "@/widgets/tables";
import { useState, useEffect } from "react";
import apiClient from "@/services/apiClient";
import { FaIgloo } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
function Dashboard() {
  //utils

  const navigateTo = useNavigate();
  const { getParams, setParams } = useQueryParams();

  //STATES

  const [selectId, setSelectedId] = useState(null);

  //TanksQuery

  const { data: user, isLoading: userLoading } = useUser();

  const { data: workersData, isLoading: workersLoading } = useWorkers();

  const createAreaHook = useCreateArea();

  //GET DATA FROM CUSTOM HOOKS


  //Define initial data loading based on the user roles

  const [leftColumnTitle, setLeftColumnTitle] = useState("");


  
  const [queryParams, setQueryParams] = useState({});

  const [urlFetch, setUrlFetch] = useState("");


  useEffect(() =>{

    console.log("INFO LEFT COLUMN CONTENT:", leftColumnContent)

  }, [leftColumnContent])


  const { data: dataLeftColumn, error, isLoading } = useQuery(
    ["LeftColumnDashboard", urlFetch, queryParams],
    async () => {
      if (urlFetch) {
        const response = await apiClient.get(urlFetch, {
          params: queryParams,
        });
        return response.data;
      }
      return null;
    },
    {
      enabled: !!urlFetch,
    }
  );




  useEffect(() => {
    if (!userLoading) {

      if (sessionStorage.getItem("role") === "Business Manager") {
        console.log("dentro  del useEffect");

        setLeftColumnTitle("Areas");
        setParams({ rows: "areas" });

        setUrlFetch("areas/");
        setQueryParams({ company: user.company });
      }

      if (sessionStorage.getItem("role") === "Area Admin") {
        setLeftColumnTitle("Area projects");
        setParams({ rows: "projects" });
      }

      if (sessionStorage.getItem("role") === "Project Manager") {
        ("projects");
        setParams({ rows: "projects" });
        setLeftColumnContent(user.related_projects)

      }

      if (sessionStorage.getItem("role") === "Freelancer") {
        setLeftColumnTitle("projects");
        setParams({ rows: "projects" });
      }
    }
  }, [user]);

  const handleAreaNameChange = (name) => {
    setLeftColumnTitle(name);
    console.log("Nombre del área seleccionado:", name);
  };

  const handleAreaCreation = async () => {
    if (
      leftColumnTitle != null &&
      leftColumnTitle.length > 0 &&
      selectId != null
    ) {
      console.log("Area name: ", leftColumnTitle);
      await createAreaHook.mutateAsync({
        name: leftColumnTitle,
        user: selectId,
      });

      alert("Area created succesfully.");
      return true;
    } else {
      alert(
        "Please selecet an area and a user." +
          " Nombre de area:" +
          leftColumnTitle +
          ". Id:" +
          selectId
      );
      return false;
    }
  };

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
          title={leftColumnTitle}
          hasSeeAll={() => navigateTo("areas/")}
          addContent={createArea}
        ></ListCard>
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
              ></ListCard>
            </div>
            <ListCard
              title={"Finance"}
              hasAdd={false}
              hasSeeAll={() => {}}
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
