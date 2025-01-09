import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import RegistrationPage from "./pages/auth/RegistrationPage";
import DashboardPage from "./pages/DashboardPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Common/Layout";
import CreateInvoicePage from "./pages/CreateInvoicePage";
import InvoiceHistoryPage from "./pages/InvoiceHistorypage";
import ClientDetailPage from "./pages/client/ClientDetailPage";
import './App.scss'
import ReportPage from "./pages/ReportPage";
import ItemsPage from "./pages/ItemsPage";
import ClientsListPage from "./pages/client/ClientsListPage";
import InvoiceDetails from "./components/Invoice/InvoiceDetails";
import SettingPage from "./pages/SettingPage";
import ConfigSettingPage from "./pages/auth/ConfigSettingPage";

const App = () => {
  const [visibleSidebar, setVisibleSidebar] = React.useState(false);

  return (
    <div className="body-container h-full">
      <Router>
        <div className="main-content">
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/register" element={<RegistrationPage />} />
            <Route path="/configSetting" element={<ConfigSettingPage />} />
            <Route path="/" element={<Layout />}>
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute
                    element={<DashboardPage />}
                    path="/dashboard"
                  />
                }
              />
              <Route
                path="/Invoice"
                element={
                  <ProtectedRoute
                    element={<CreateInvoicePage />}
                    path="/Invoice"
                  />
                }
              />
              <Route
                path="/Invoices"
                element={
                  <ProtectedRoute
                    element={<InvoiceHistoryPage />}
                    path="/Invoices"
                  />
                }
              />
              <Route
                path="/Client"
                element={
                  <ProtectedRoute
                    element={<ClientDetailPage />}
                    path="/Client"
                  />
                }
              />
               <Route
                path="/Clients"
                element={
                  <ProtectedRoute
                    element={<ClientsListPage />}
                    path="/Clients"
                  />
                }
              />
               <Route
                path="/reportsPage"
                element={
                  <ProtectedRoute
                    element={<ReportPage />}
                    path="/reportsPage"
                  />
                }
              />
              <Route
                path="/InvoiceDetails"
                element={
                  <ProtectedRoute
                    element={<InvoiceDetails />}
                    path="/InvoiceDetails"
                  />
                }
              />
               <Route
                path="/itemsPage"
                element={
                  <ProtectedRoute
                    element={<ItemsPage />}
                    path="/itemsPage"
                  />
                }
              />
               <Route
                path="/Settings"
                element={
                  <ProtectedRoute
                    element={<SettingPage />}
                    path="/Settings"
                  />
                }
              />
            </Route>
          </Routes>
        </div>
      </Router>
    </div>
  );
};

export default App;
