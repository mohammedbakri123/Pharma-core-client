import Sidebar from "./Sidebar";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import { SidebarProvider } from "./sidebar-context";

export function Layout() {
  return (
    <SidebarProvider>
      <div
        className="flex h-screen bg-background font-sans overflow-hidden"
        dir="rtl"
      >
        <Sidebar />

        <div className="flex-1 flex flex-col h-screen overflow-hidden min-w-0">
          <Header />

          <main className="flex-1 overflow-auto bg-background/50 p-3 md:p-4 lg:p-6">
            <div className="max-w-7xl mx-auto space-y-4 md:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
