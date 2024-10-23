import routes from "@/routes";
import { Route, Routes, useMatch } from "react-router-dom";
import { NavigationTopBar, ProjectTopBar } from "@/widgets/layout";
import { SimpleFooter } from "@/widgets/footer";

export function ProjectLayout() {
  const isListingPage = useMatch("/project");

  return (
    <div className="flex flex-col min-h-screen h-screen md:h-screen overflow">
      <NavigationTopBar />

      {/* Solo muestra ProjectTopBar si NO estamos en la página de listing */}
      {!isListingPage && <ProjectTopBar />}
      
      <Routes>
        {routes.map(
          ({ layout, pages }) =>
            layout === "project" &&
            pages.map(({ element, path }) => (
              <Route key={path} path={path} element={element} />
            ))
        )}
      </Routes>
    </div>
  );
}

export default ProjectLayout;
