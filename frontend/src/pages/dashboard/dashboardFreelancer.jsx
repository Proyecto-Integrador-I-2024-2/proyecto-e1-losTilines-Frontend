import { ListCard } from "@/widgets/list";
import { NumberInfo } from "@/widgets/statistics/numberInfo";
import Chart from "@/widgets/statistics/chart";
import { Button, Card } from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import { useUser, useQueryParams, useProjects} from "@/hooks";
import {  useState } from "react";
import { SpinnerCustom } from "@/widgets/layout";
import { useNavigateWithQuery } from "@/hooks/utils";
import { ListRowStructure } from "@/widgets/list";
import { ListRowWithImage } from "@/widgets/list";
import {Typography} from "@material-tailwind/react";

export function DashboardFreelancer() {
  //Popup


  /*-----------------------------------------------*/

  //Utils

  const [selectItem, setSelectecItem] = useState(null); //Used to define the area selected.

  /*-----------------------------------------------*/

  // Fetchers


  const { data: user, isLoading: userLoading } = useUser();


  /*--------------------------------------------*/

  //Navigation and url staff

  const navigateTo = useNavigate();

  const navigateWithQuery = useNavigateWithQuery();

  const { getParams, setParams } = useQueryParams();

  /*-----------------------------------------------*/

  const { data: projects, isLoading: isLoadingProjects, error: projectsError } = useProjects( {freelancer: user?.user.id}); // Fetch projects by freelancer

  let workersFilteredBusinessManager = [];


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
                      setSelected={() => {}}
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
                  title={"Milestones"}
                  addContent={false}
                  hasSeeAll={() => {}}
                >

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


