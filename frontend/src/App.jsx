import { Routes, Route, Navigate } from "react-router-dom";
import { DashboardLayout } from "./layouts/dashboardLayout";
import { ProfileLayout, Auth, ProjectLayout, HomepageLayout } from "@/layouts";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <Routes>
        <Route path="/dashboard/*" element={<DashboardLayout />} />
        <Route path="/profile/*" element={<ProfileLayout />} />
        <Route path="/auth/*" element={<Auth />} />
        <Route path="/project/*" element={<ProjectLayout />} />
        <Route path="/homepage/*" element={<HomepageLayout />} />
      </Routes>
    </QueryClientProvider>
  );
}

export default App;
