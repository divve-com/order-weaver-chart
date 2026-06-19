import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/AppLayout";
import Dashboard from "./pages/Dashboard";
import ListView from "./pages/ListView";
import DetailView from "./pages/DetailView";
import CalendarView from "./pages/CalendarView";
import SettingsView from "./pages/SettingsView";
import Components from "./pages/Components";
import SignIn from "./pages/SignIn";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/sign-in" element={<SignIn />} />
          <Route element={<AppLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/customers" element={<ListView />} />
            <Route path="/list" element={<ListView />} />
            <Route path="/list/:id" element={<DetailView />} />
            <Route path="/calendar" element={<CalendarView />} />
            <Route path="/contracts" element={<ListView />} />
            <Route path="/invoices" element={<ListView />} />
            <Route path="/domains" element={<Components />} />
            <Route path="/settings" element={<SettingsView />} />
            <Route path="/components" element={<Components />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
