import { Switch, Route } from "wouter";
// import { Toaster } from "@/core/components/ui/toaster";
import { TooltipProvider } from "@/ui/tooltip";
import { Layout } from "@/layout/layout";
import POS from "@/features/pos/pos-page";
import Patients from "@/features/patients/patients-page";
import Settings from "@/features/settings/settings-page";
import Reports from "@/features/reports/reports-page";
import Invoices from "@/features/invoices/invoices-page";
import NotFound from "@/features/not-found/not-found-page";
import DashboardPage from "@/pages/DashboardPage";
import InventoryPage from "@/pages/InventoryPage";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={DashboardPage} />
        <Route path="/inventory" component={InventoryPage} />
        <Route path="/pos" component={POS} />
        <Route path="/patients" component={Patients} />
        <Route path="/reports" component={Reports} />
        <Route path="/invoices" component={Invoices} />
        <Route path="/settings" component={Settings} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <TooltipProvider>
      {/* <Toaster /> */}
      <Router />
    </TooltipProvider>
  );
}

export default App;
