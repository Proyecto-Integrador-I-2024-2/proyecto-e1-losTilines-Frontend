import { useUser } from "@/hooks";

import { DashboardBusinessManager } from "@/layouts";

import { SpinnerCustom } from "@/widgets/layout";
import { DashboardAreaAdmin, DashboardFreelancer, DashboardProjectManager } from ".";

export function DashboardRenderByrole() {
  /*-----------------------------------------------------------------------------------*/

  // Fetchers

  const role = sessionStorage.getItem("role");

  const { data: user, isLoading: userLoading } = useUser();

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
        console.log("Freelancer");
        return <DashboardFreelancer/>;
    }
  }
}
