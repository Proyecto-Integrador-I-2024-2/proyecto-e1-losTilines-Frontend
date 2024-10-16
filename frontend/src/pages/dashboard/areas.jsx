import { CollapseCustom, PopoverCustom, SelectCustom } from "@/widgets/buttons";
import { Card, Input, Typography } from "@material-tailwind/react";

import { ListAreasCollapse } from "@/widgets/areaWidgets";
import { useCustomFethc, useUser } from "@/hooks";
import { SpinnerCustom } from "@/widgets/layout";
import { useEffect, useState } from "react";
import apiClient from "@/services/apiClient";


function Areas() {
  const addContent =
    "Give this code to your workers to add them to your team #42123";

  //Info for select buttons.
  const sortContent = ["Area name"]; 

  const areaInfo = ["Area1", "Area2", "Area3", "Area4"];

  //Info for table creation.


  const [projectsByArea, setProjectsByArea] = useState([]); 

  const { data: user, isLoading: isLoadingUser } = useUser();

  const { data: areas, isLoading: isLoadingAreas } = useCustomFethc(
    "Areas",
    "areas/",
    { company: user?.company },
    { enabled: !!user }
  );

  useEffect(() => {
    //Fetch projects by area 

    if(!isLoadingAreas && areas.length > 0 ){

      const fetchProjects = async () => {


        const fetchPromises  = areas.map((area) =>{

          const fetchProject = async () => {
            const { data } = await apiClient.get("projects/", {
              params: { area: area.id },
            });
            return data;
          };
          return fetchProject();
        })

        const projectData= await Promise.all(fetchPromises);



        const projectMap = {}

        areas.forEach((area, index) => {
          projectMap[area.id] = projectData[index];
        });


        console.log("PROJECTS BY AREA: ", projectMap);  
        setProjectsByArea(projectMap);
        

      }

       fetchProjects();
    
    }
  }, [isLoadingAreas])


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
          <CollapseCustom title={"Sort"}>
            <SelectCustom
              description={"sort by"}
              options={sortContent}
              label={"Select type"}
            />
          </CollapseCustom>

          <PopoverCustom title={"Add"} content={addContent} />
        </section>
      </header>

      <main className="flex flex-col h-full w-full mt-2   overflow-y-auto">
        {isLoadingUser || isLoadingAreas ? (
          <SpinnerCustom />
        ) : (

          areas.map((area) => (
                      
            <ListAreasCollapse 
              key={area.id}

              areaId={area.id}  
              title={area.name}
              projects={projectsByArea[area.id]}
              chipValue2={1000000}
              currentAreaAdmin={area.user}
            >
             
            </ListAreasCollapse>
          )) 
        
        
        )}
      </main>
    </Card>

  
  );
}

export default Areas;
