import { NavigationbarWithDropdownMultilevelMenu } from "@/widgets/layout";
import { ListCard } from "@/widgets/area";
import ListRowStructure from "@/widgets/area/listRowStructure";
import { Button } from "@material-tailwind/react";

export function DashboardMine() {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Barra de navegación */}

      <NavigationbarWithDropdownMultilevelMenu />
      {/* Contenido principal */}
      <div className="flex flex-col md:flex-row w-full flex-grow my-2 px-2 min-h-0">
        {/* Columna izquierda */}
        <div className="w-full flex flex-col flex-grow max-h- md:max-h-none   md:w-1/3 md:mr-6 min-h-0   ">
          <ListCard
            numberOfItems={33}
            title={"Areas"}
            hasAdd={true}
            hasSeeAll={true}
            addDescription={"New Area"}
          >
            <ListRowStructure rowName={"Area 1"} statistics={10}>
              
              <p>15 Proyectos</p>
            </ListRowStructure>
            <ListRowStructure rowName={"Area 1"} statistics={10}>
              
              <p>15 Proyectos</p>
            </ListRowStructure><ListRowStructure rowName={"Area 1"} statistics={10}>
              
              <p>15 Proyectos</p>
            </ListRowStructure>
            <ListRowStructure rowName={"Area 1"} statistics={10}>
              
              <p>15 Proyectos</p>
            </ListRowStructure>
            
            <ListRowStructure rowName={"Area 1"} statistics={10}>
              
              <p>15 Proyectos</p>
            </ListRowStructure>
            <ListRowStructure rowName={"Area 1"} statistics={10}>
              
              <p>15 Proyectos</p>
            </ListRowStructure>
            <ListRowStructure rowName={"Area 1"} statistics={10}>
              
              <p>15 Proyectos</p> 
            </ListRowStructure>
            <ListRowStructure rowName={"Area 1"} statistics={10}>
              
              <p>15 Proyectos</p>
            </ListRowStructure>
            <ListRowStructure rowName={"Area 1"} statistics={10}>
              
              <p>15 Proyectos</p>
            </ListRowStructure>
          </ListCard>
        </div>

        {/* Columna derecha */}
        <div className="flex flex-col h-full w-full md:w-2/3 min-h-0">
          <div className="mb-2 space-y-2 flex flex-col w-full md:space-x-6 md:space-y-0 md:flex-row md:h-1/2 min-h-0">
            {/* Aquí iría el contenido para trabajadores y finanzas */}
          </div>
          <div className="sm:max-h-96 md:h-1/2 md:mt-2">
            {/* Aquí iría el contenido para estadísticas */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardMine;
