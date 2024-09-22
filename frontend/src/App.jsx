import { Routes, Route, Navigate } from "react-router-dom";
import { DashboardLayout } from "./layouts/dashboardLayout";
import { ProfileLayout, Auth, ProjectLayout } from "./layouts";

function App() {
  return (
    <Routes>
      <Route path="/dashboard/*" element={<DashboardLayout />} />
      <Route path="/profile/*" element={<ProfileLayout />} />
      <Route path="/auth/*" element={<Auth />} />
      <Route path="/project/*" element={<ProjectLayout />} />
    </Routes>
  );
}

export default App;
