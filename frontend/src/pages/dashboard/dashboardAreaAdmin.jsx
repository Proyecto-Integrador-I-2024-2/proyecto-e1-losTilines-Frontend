import { ListCard } from "@/widgets/list";
import { NumberInfo } from "@/widgets/statistics/numberInfo";
import Chart from "@/widgets/statistics/chart";
import { Button, Card } from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import { useUser, useQueryParams, useProjects} from "@/hooks";
import {  useEffect, useState } from "react";
import { SpinnerCustom } from "@/widgets/layout";
import { useNavigateWithQuery } from "@/hooks/utils";
import { useWorkers } from "@/hooks/workers";
import { ListRowStructure } from "@/widgets/list";
import { ListRowWithImage } from "@/widgets/list";
import {Typography} from "@material-tailwind/react";

export function DashboardAreaAdmin() {
  //Popup


  /*-----------------------------------------------*/

  //Utils

  const [selectItem, setSelectecItem] = useState(null); //Used to define the area selected.

  /*-----------------------------------------------*/

  // Fetchers


  const { data: user, isLoading: userLoading } = useUser();

 
  if (userLoading) {
    return <SpinnerCustom />;
  }



  console.log("user id and company", { worker: user.id, company: user.company });

  const { data: workers, isLoading: isLoadingWorkers, isError:isWorkersError } = useWorkers({
    company: user.company, area: user.area.id
  }); // Fetch workers

  /*--------------------------------------------*/



  //Navigation and url staff

  const navigateTo = useNavigate();

  const navigateWithQuery = useNavigateWithQuery();

  const { getParams, setParams } = useQueryParams();

  useEffect(()=>{

    setParams({ area: user.area.id });


  },[user?.area?.id])


  /*-----------------------------------------------*/


  console.log("Parameters: ", user.company, user.area);

  const { data: projects, isLoading: isLoadingProjects, error: projectsError } = useProjects( {company: user.company, area:user.area.id}); // Fetch projects by area

  let workersFilteredBusinessManager = [];

  if (!isLoadingWorkers && !isWorkersError) {
    workersFilteredBusinessManager = workers.filter(
      (item) => item.role != "Business Manager"
    ); // Filter workers to show workers with role different to Business Manager
  }

  /*-----------------------------------------------*/

  //Handlers for navigation when a row is selected

  const handleSelectedProject = (item) => {

    navigateTo(`/project/detail/${item}`); 

}

 
  /*-----------------------------------------------*/

  return (
      <div className="h-full md:flex md:flex-row w-full my-2 px-2 min-h-0">
        {/*------------------------------------ Areas ------------------------------------*/}
        <section className="w-full h-96 flex flex-col md:mb-0 md:w-1/3 md:h-full md:max-h-none md:mr-6">
          <ListCard
            title={"Projects"}
            hasSeeAll={() => navigateTo("/project/")}
            addContent={ <></>}
          >
            {isLoadingProjects ? (
              <SpinnerCustom />
            ) : (
              <>
              {/*----------------------------Render projects of an area----------------------------*/}
              {projects && projects.length > 0 ? (
                projects.map((item) => {
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

                        {
                          isWorkersError? (

                            <Typography>There was an error loading the workers</Typography>
                          ) : (

                            <Typography>There aren't elements to show.</Typography>

                          )


                        }

                        <Typography> </Typography>
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

    
  );
}


