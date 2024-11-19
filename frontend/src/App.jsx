import { Routes, Route, Navigate } from "react-router-dom";
import { DashboardLayout } from "./layouts/dashboardLayout";
import { ProfileLayout, Auth, ProjectLayout, HomepageLayout, ApprovalsLayout } from "@/layouts";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import FaqLayout from "./layouts/faqLayout";

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
        <Route path="/approvals/*" element={<ApprovalsLayout />} />
        <Route path="/faq/*" element={<FaqLayout />} />
        <Route path="/dashboard/*" element={<DashboardLayout />} />
        <Route path="/profile/*" element={<ProfileLayout />} />
        <Route path="/auth/*" element={<Auth />} />
        <Route path="/project/*" element={<ProjectLayout />} />
        <Route path="/*" element={<HomepageLayout />} />
      </Routes>
    </QueryClientProvider>
  );
}

export default App;
