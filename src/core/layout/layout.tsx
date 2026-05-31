import Sidebar from "./Sidebar";
import Header from "./Header";
import { Outlet } from "react-router-dom";

export function Layout() {
  return (
    <div
      className="flex h-screen bg-background font-sans overflow-hidden"
      dir="rtl"
    >
      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <Header />

        {/* Content */}
        <main className="flex-1 overflow-auto bg-background/50 p-6">
          <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
