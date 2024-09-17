import { AreaList } from "@/widgets/cards";
import { ListWithAvatar, NavigationbarWithDropdownMultilevelMenu } from "@/widgets/layout";


export function DashboardMine() {
  return (

<div className="h-screen flex flex-col "> {/* Asegúrate de que el contenedor principal use flexbox y tenga altura completa */}
    <NavigationbarWithDropdownMultilevelMenu />

      <div className="flex flex-row  w-full h-full my-2 ">

        <div className="w-1/3 ">
        <AreaList  />
        </div>


        <div className="flex flex-row w-2/3 h-full">
 <div className="flex flex-row w-full h-1/2">

          <AreaList />
          <AreaList />

          </div>

        </div>
       
      </div>
  

  </div>
  );
}

export default DashboardMine;