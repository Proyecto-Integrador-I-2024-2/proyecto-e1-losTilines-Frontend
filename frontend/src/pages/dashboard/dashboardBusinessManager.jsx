import { ListCard } from "@/widgets/list";
import { NumberInfo } from "@/widgets/statistics/numberInfo";
import Chart from "@/widgets/statistics/chart";
import { Button, Card } from "@material-tailwind/react";
import {
  Link,
  useLocation,
  useNavigate,
  useNavigationType,
} from "react-router-dom";
import { useUser, useQueryParams, useProjects } from "@/hooks";
import { useEffect, useState } from "react";
import { CreateAreaPopUp } from "@/widgets/areaWidgets";
import { SpinnerCustom } from "@/widgets/layout";
import { useNavigateWithQuery } from "@/hooks/utils";
import { Identifiers, useWorkers } from "@/hooks/workers";
import { useAreas } from "@/hooks/areas";
import { ListRowStructure } from "@/widgets/list";
import { ListRowWithImage } from "@/widgets/list";
import { Typography } from "@material-tailwind/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/services/apiClient";

export function DashboardBusinessManager() {
  //Popup

  const [openCreateaArea, setOpenCreateArea] = useState(false); //This state is for open the create area popUp

  /*-----------------------------------------------*/

  //Utils

  const [selectItem, setSelectecItem] = useState(null); //Used to define the area selected.

  const [isArea, setIsArea] = useState(true); //Used to define if there are areas or projects

  //Navigation staff

  const [queryParams, setQueryParams] = useState({});

  const { getParams, setParams } = useQueryParams();

  const location = useLocation();

  const navigationType = useNavigationType();


  /*-----------------------------------------------*/

  //FETCHERS
  
  const { data: user, isLoading: userLoading } = useUser();

  if (userLoading) return <SpinnerCustom />;


  console.log("User company id:", user.company);
  const { data: areas, isLoading: isLoadingAreas } = useAreas({
    company: user.company,
  }); // Fetch areas

  useEffect(()=> {

    if(user){
      setQueryParams({ company: user.company });
      setParams({ company: user.company });
    }


 },[])


  //fetch workers based on query params from url.

  useEffect(() => {
    const params = Object.fromEntries(getParams().entries());
    setQueryParams(params);
  }, [location, navigationType]);

  const { data: workers, isLoading: isLoadingWorkers } = useQuery(
    [Identifiers.workers, queryParams], // Incluir parámetros en la clave de consulta
    async () => {
      const { data } = await apiClient.get("workers/", {
        params: queryParams,
      });
      return data;
    },
    {
      staleTime: 5 * 60 * 1000,
      cacheTime: 30 * 60 * 1000,
    }
  );

  /*-----------------------------------------------*/

  //Navigation and url staff

  const navigateTo = useNavigate();

  const navigateWithQuery = useNavigateWithQuery();

  const areaSelected = getParams().get("area"); //Get the area from the url

  const areaId = areaSelected ? Number(areaSelected) : null;

  /*-----------------------------------------------*/

  const [projectsFetch, setProjectFetch] = useState(null);


  useEffect(() => {

      console.log("ProjectsFetch:", projectsFetch);


  }, projectsFetch)

  let workersFilteredBusinessManager = [];

  if (!isLoadingWorkers && workers) {
    workersFilteredBusinessManager = workers.filter(
      (item) =>
        item.role != "Business Manager" &&
        item.role != null &&
        item.role != "Freelancer"
    ); // Filter workers to show workers with role different to Business Manager
  }

  /*-----------------------------------------------*/

  //Handlers for navigation when a row is selected

  const handleSelecedArea = (item) => {
    setParams({ area: item });
    


  };

  const handleSelectedProject = (item) => {

      navigateTo(`/project/detail/${item}`);


  }

  /*-----------------------------------------------*/

    //Set the company id in the query params when the user is loaded
   useEffect(()=> {

      if(user){
        setParams({ company: user.company });
      }


   },[user])


  /*-----------------------------------------------*/

  // Effect use define the selected area based on query params on url
  // Area is actually the ID value of the query param "area" in the URL
  useEffect( () => {
    if (areaSelected) {

      const fetchProjects = async () => {

        console.log("Params en el hoook de useProjects: ",queryParams)
        const { data } = await apiClient.get("projects/", { params: {area: areaSelected, company: user.company} });    
        return data;
      }
      
      fetchProjects().then(data => setProjectFetch(data)); 


      setSelectecItem(areaSelected);
      setIsArea(false);
    } else {
      setSelectecItem(null);
      setIsArea(true);
    }
  }, [areaSelected, areas]);


  /*-----------------------------------------------*/

  /*-----------------------------------------------*/

  return (
    <>
      <div className="h-full md:flex md:flex-row w-full my-2 px-2 min-h-0">
        {/*------------------------------------ Areas ------------------------------------*/}
        <section className="w-full h-96 flex flex-col md:mb-0 md:w-1/3 md:h-full md:max-h-none md:mr-6">
          <ListCard
            title={isArea ? "Areas" : "Projects"}
            hasSeeAll={() => navigateTo("areas/")}
            addContent={
              <Button
                id="newArea"
                onClick={() => setOpenCreateArea(!openCreateaArea)}
                variant="gradient"
              >
                New area
              </Button>
            }
          >
            {isLoadingAreas ? (
              <SpinnerCustom />
            ) : (
              <>
                {isArea ? (
                  <>
                    {/*----------------------------Render areas or projects----------------------------*/}

                    {areas && areas.length > 0 ? (
                      areas.map((item) => {
                        return (
                          <ListRowStructure
                            key={item.id}
                            id={item.id}
                            rowName={item.name}
                            chipValue={item.user.email}
                            setSelected={handleSelecedArea}
                          />
                        );
                      })
                    ) : (
                      <div className="flex flex-row justify-center items-center">
                        <Typography>There aren't elements to show.</Typography>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {/*----------------------------Render projects of an area----------------------------*/}
                    {projectsFetch && projectsFetch.length > 0 ? (
                      projectsFetch.map((item) => {
                        return (
                          <ListRowStructure
                            key={item.id}
                            id={item.id}
                            rowName={item.name}
                            chipValue={item.status_name}
                            setSelected={handleSelectedProject}
                          />
                        );
                      })
                    ) : (
                      <div className="flex flex-row justify-center items-center">
                        <Typography>There aren't elements to show.</Typography>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </ListCard>
        </section>

        {/*------------------ Right Big Column Container ------------------*/}

        <div className="flex flex-col  md:w-2/3  ">
          <section className="flex flex-col h-auto min-h-0 w-full mb-2 my-4 md:my-0 md:flex-row md:h-1/2  ">
            {/*------------------ Workers  Section ---------------------------*/}

            <section className="flex flex-col h-auto w-full md:space-x-6  md:flex-row  md:h-full">
              <div className="h-96 my-4 md:my-0 md:h-full md:w-full">
                <ListCard
                  title={"Workers"}
                  addContent={false}
                  hasSeeAll={() => navigateWithQuery("workers/")}
                >
                  {!isLoadingWorkers ? (
                    workersFilteredBusinessManager &&
                    workersFilteredBusinessManager.length > 0 ? (
                      <>
                        {workersFilteredBusinessManager.map((item) => {
                          return (
                            <ListRowWithImage
                              key={item.id}
                              avatar={
                                item.profile_picture ||
                                "/img/people/noProfile1.jpg"
                              }
                              rowName={`${item.first_name} ${item.last_name}`}
                              description={item.email}
                              chipValue={item.role}
                            />
                          );
                        })}
                      </>
                    ) : (
                      <div className="flex flex-row justify-center items-center">
                        <Typography>There aren't elements to show.</Typography>
                      </div>
                    )
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

          {/*------------------ Statistics content ------------------ */}

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
                id="seeAllStats"
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
