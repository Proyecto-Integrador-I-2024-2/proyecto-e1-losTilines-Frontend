import { useUser } from "@/hooks";

import { DashboardBusinessManager } from "@/layouts";

import { SpinnerCustom } from "@/widgets/layout";
import { DashboardAreaAdmin, DashboardFreelancer, DashboardProjectManager, NoLoginDashboard } from ".";

export function DashboardRenderByrole() {
  /*-----------------------------------------------------------------------------------*/

  // Fetchers


 //If havent login, render no login dashboard.
  if(sessionStorage.getItem("role") === null){


    return <NoLoginDashboard/>



  }

  const role = sessionStorage.getItem("role");

  const { data: user, isLoading: userLoading } = useUser();

  if (userLoading) return <SpinnerCustom />;


  /*-----------------------------------------------------------------------------------*/

  //Based on role define the component to render

  if (userLoading) {
    return (
      <div className="m-auto w-full h-full">
        <SpinnerCustom />;
      </div>
    );
  } else {
    switch (user.role || role) {
      case "Business Manager":
        return <DashboardBusinessManager />;
      case "Area Admin":
        return <DashboardAreaAdmin />;
      case "Project Manager":
        return <DashboardProjectManager />;
      case "Freelancer":
        return <DashboardFreelancer/>;
      default:
        return <NoLoginDashboard/>  
    }
  }
}
