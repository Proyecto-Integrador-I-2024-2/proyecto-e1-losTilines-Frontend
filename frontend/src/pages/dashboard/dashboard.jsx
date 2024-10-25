import { ListCard } from "@/widgets/list";
import { NumberInfo } from "@/widgets/statistics/numberInfo";
import Chart from "@/widgets/statistics/chart";
import { Button, Card, Spinner } from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import {
  useUser,
  useCreateArea,
  useQueryParams,
  useCustomFethc,
} from "@/hooks";
import { useState, useEffect } from "react";
import { CreateAreaPopUp } from "@/widgets/areaWidgets";
import { LeftColumnRows, MidColumnRows } from "@/widgets/dashboard";
import { SpinnerCustom } from "@/widgets/layout";
import { useNavigateWithQuery } from "@/hooks/utils";
function Dashboard() {
  //Open popUps logic
  const [openCreateaArea, setOpenCreateArea] = useState(false); //This state is for open  the create area popUp

  //Utils



  const [selectItem, setSelectecItem] = useState(null);

  /*-----------------------------------------------*/

  // Define the user and its role (this one, is stored in the sessionStorage)
  
  const { data: user, isLoading: userLoading } = useUser();

  const role = sessionStorage.getItem("role");

  /*-----------------------------------------------*/

  //Navigation and url staff

  const navigateTo = useNavigate();

  const navigateWithQuery = useNavigateWithQuery();

  const { getParams, setParams } = useQueryParams();


  /*-----------------------------------------------*/

  //TanksQuery

  /**
   * dataMidColumn manages informaction about:
   * 1. Freelancer milestones.
   * 2. Workers of a company and area.
   * 3. Freelancer related to projects of a project manager.
   */
  const [queryParamsMidColumn, setQueryparamsMidColum] = useState({});

  const [urlFetchMidColumn, setUrlFetchMidColumn] = useState("");

  const [midColumnTitle, setMidColumnTitle] = useState("");

  const fetchIdenfierMidColumn =
    role === "Business Manager"
      ? "Workers"
      : role === "Area Admin"
      ? "Workers"
      : role === "Project Manager"
      ? "FreelancersHired"
      : "Milestones";

  const {
    data: dataMidColumn,
    error: midColumnError,
    isLoading: isLoadingMidColumn,
  } = useCustomFethc(
    fetchIdenfierMidColumn,
    urlFetchMidColumn,
    queryParamsMidColumn
  );

  // When the role is Business Manager or area admin, we dont want to post the business manager in the midColumn 
  let midColumnFiltered = [];
  if((role === "Business Manager" || role === "Area Admin") && dataMidColumn != undefined){

    midColumnFiltered = dataMidColumn.filter((item) => item.role != "Business Manager" );

  }

  /*-----------------------------------------------*/

  /**
   * dataLeftColumns manages information abaout:
   * 1. Areas from a business manager.
   * 2. Area admin projects.
   * 3. Project manager projects
   * 4. Freelancer projects.
   */

  const [queryParams, setQueryParams] = useState({});

  const [urlFetch, setUrlFetch] = useState("");

  const [leftColumnTitle, setLeftColumnTitle] = useState("");

  const fetchIdenfierLeftColum =
    role === "Business Manager" ? "Areas" : "Projects";

  const {
    data: dataLeftColumn,
    error: errorLeftColumn,
    isLoading: isLoadingLeftColumn,
  } = useCustomFethc(fetchIdenfierLeftColum, urlFetch, queryParams);


  /*-----------------------------------------------*/

  //Set the fetch route and the title for the leftColumn and midColumn

  useEffect(() => {
    if (!userLoading) {
      if (sessionStorage.getItem("role") === "Business Manager") {
        //Define the fetch route for the leftColumn

        setLeftColumnTitle("Areas");
        setUrlFetch("areas/");
        setQueryParams({ company: user.company });

        //Define the fetch route for the midColumn
        setUrlFetchMidColumn("workers/");
        setQueryparamsMidColum({ company: user.company });
        setMidColumnTitle("Workers");

        //Define url params

        setParams({ company: user.company });
      }

      if (sessionStorage.getItem("role") === "Area Admin") {
        //Define the fetch route for the leftColumn

        setLeftColumnTitle("Area projects");
        setUrlFetch("projects/");
        setQueryParams({ area: user.area });

        //Define the fetch route for the midColumn

        setUrlFetchMidColumn("workers/");
        setQueryparamsMidColum({ area: user.area });
        setMidColumnTitle(`Area workers`);

        //Define url params
        setParams({ area: user.area });
      }

      if (sessionStorage.getItem("role") === "Project Manager") {
        setLeftColumnTitle("Projects");
        setParams({ rows: "projects" });
        setUrlFetch("projects/");
        setQueryParams({ worker: user.id });

        //Falta definir la ruta de fetch para MidColumn
        setMidColumnTitle("Hired freelancers");
      }

      if (sessionStorage.getItem("role") === "Freelancer") {
        setLeftColumnTitle("Projects");
        setParams({ rows: "projects" });
        setUrlFetch("projects/");
        setQueryParams({ freelancer: user.id});
        
        setMidColumnTitle("My milestones");
      }
    }
  }, [user]);


  /*-----------------------------------------------*/

  return (
    <>
      <div className="h-full md:flex md:flex-row w-full my-2 px-2 min-h-0">

        {/* Left Column */}

        <section className="w-full h-96 flex flex-col md:mb-0 md:w-1/3 md:h-full md:max-h-none md:mr-6">
          <ListCard
            title={leftColumnTitle}
            hasSeeAll={
              sessionStorage.getItem("role") === "Business Manager"
                ? () => navigateTo("areas/")
                : () => navigateTo("projects/")
            }
            addContent={
              sessionStorage.getItem("role") === "Business Manager" ? (
                <Button
                  onClick={() => setOpenCreateArea(!openCreateaArea)}
                  variant="gradient"
                >
                  New area
                </Button>
              ) : (
                false
              )
            }
          >
            {isLoadingLeftColumn ? (
              <SpinnerCustom />
            ) : (
              <LeftColumnRows
                setSelectedId={setSelectecItem}
                contentInfo={dataLeftColumn}
              />
            )}
          </ListCard>
        </section>

        {/* Right Big Column Container*/}

        <div className="flex flex-col  md:w-2/3  ">
          <section className="flex flex-col h-auto min-h-0 w-full mb-2 my-4 md:my-0 md:flex-row md:h-1/2  ">
            
            {/*MidColumn section */}
            
            <section className="flex flex-col h-auto w-full md:space-x-6  md:flex-row  md:h-full">
              <div className="h-96 my-4 md:my-0 md:h-full md:w-full">
                <ListCard
                  title={midColumnTitle}
                  addContent={false}
                  hasSeeAll={() => navigateWithQuery("workers/")}
                >
                  {!isLoadingMidColumn ? (
                    <MidColumnRows contentInfo={midColumnFiltered} />
                  ) : (
                    <SpinnerCustom />
                  )}
                </ListCard>
              </div>
              <ListCard title={"Finance"} hasAdd={false} hasSeeAll={() => {}}>
                <NumberInfo
                  description={"Total investment in projects"}
                  number={"$2.500.000"}
                />
              </ListCard>
            </section>
          </section>

          {/* Statistics content */}

          <Card className="flex w-full flex-col mb-2 p-4 h-auto items-center md:h-1/2 md:mt-2 md:mb-0">
            <div className="flex h-auto w-full flex-col md:flex-row md:h-full justify-center items-center">
              <Chart description={"Monthly expenses for 2024"} type={"pie"} />
              <Chart
                description={"Percentage of budget by area"}
                type={"bar"}
              />
              <Chart
                description={"Percentage of projects by status"}
                type={"pie"}
              />
            </div>
            <Link to="stats/">
              <Button
                color="gray"
                size="sm"
                variant="outlined"
                className="w-32"
              >
                See all
              </Button>
            </Link>
          </Card>
        </div>
      </div>

      <CreateAreaPopUp
        open={openCreateaArea}
        setOpen={setOpenCreateArea}
        handleOpen={() => setOpenCreateArea(!openCreateaArea)}
      />
    </>
  );
}

export default Dashboard;
