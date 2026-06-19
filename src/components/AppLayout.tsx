import { Outlet } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";

export function AppLayout() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-background">
      <AppSidebar />
      <main className="min-w-0 max-w-full px-4 py-4 md:ml-16 md:px-8 md:py-8">
        <div className="min-w-0 max-w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}