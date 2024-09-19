import { Routes, Route, Navigate } from "react-router-dom";
import { DashboardLayout } from "./layouts/dashboardLayout";
import { ProfileLayout } from "./layouts";

function App() {
  return (
    <Routes>
      <Route path="/dashboard/*" element={<DashboardLayout />} />
      <Route path="/profile/*" element={<ProfileLayout />} />
    </Routes>
  );
}

export default App;
