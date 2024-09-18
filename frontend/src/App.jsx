import { Routes, Route, Navigate } from "react-router-dom";
import { DashboardLayout } from "./layouts/dashboardLayout";

function App() {
  return(

    <Routes>

      <Route path="/dashboard/*" element={<DashboardLayout />} />
      
    </Routes>


  ); 
  
}

export default App;
