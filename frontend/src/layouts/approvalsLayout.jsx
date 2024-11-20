import routes from "@/routes"
import { NavigationTopBar } from "@/widgets/layout"
import { Route, Routes } from "react-router-dom"

export function ApprovalsLayout() {
    return (
        <div className="flex flex-col min-h-screen h-screen md:h-screen  overflow">
            <NavigationTopBar />

            <Routes>
                {routes.map(
                    ({ layout, pages }) =>
                        layout === "approvals" &&
                        pages.map(({ element, path }) => (
                            <Route path={path} element={element} />
                        ))
                )}
            </Routes>
        </div>
    )
}

export default ApprovalsLayout
