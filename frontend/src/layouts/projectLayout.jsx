import routes from "@/routes";
import { Route, Routes } from "react-router-dom";
import { NavigationTopBar, ProjectTopBar } from "@/widgets/layout";
import { SimpleFooter } from "@/widgets/footer";
import { useParams, useLocation } from "react-router-dom";

export function ProjectLayout() {
  const location = useLocation();
  const currentPath = location.pathname
  console.log("Ruta actual:", currentPath);
  const id = currentPath.substring(currentPath.lastIndexOf('/') + 1)
  console.log("ID del proyecto en layout:", id);
  return (
    <div className="flex flex-col min-h-screen h-screen md:h-screen overflow-hidden ">
      <NavigationTopBar />
      {(currentPath.includes("/project/detail") || currentPath.includes("/project/milestones")) && <ProjectTopBar projectId={id || ""} />}
      <Routes>
        {routes.map(
          ({ layout, pages }) =>
            layout === "project" &&
            pages.map(({ element, path }) => (
              <Route path={path} element={element} />
            ))
        )}
      </Routes>

    </div>
  );
}

export default ProjectLayout;
