import React, { useRef, useState } from "react";
import { Outlet } from "react-router-dom";
import SidebarComponent from "./Sidebar"; 
import HeaderComponent from "./Header"; 
import { Sidebar } from "primereact/sidebar";
import "../../assets/styles/base.scss";

const Layout: React.FC = () => {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const sidebarRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className="layout-container ">
      {/* Header Section */}
      <HeaderComponent
        setSidebarVisible={setSidebarVisible}
        buttonVisible={sidebarVisible}
      />

      {/* Main Layout */}
      <div className="layout-main">
        <Sidebar
          visible={true}
          onHide={() => {}}
          position="left"
          className={`sidebar bg-primary-500 ${sidebarVisible ? "w-6rem" : "w-2"}`}
          modal={false}
          content={({ hide }) => (
            <div className="sidebar-content">
              <SidebarComponent sidebarOpen={sidebarVisible}/>
            </div>
          )}
        ></Sidebar>

        {/* Main Content */}
        <div className={`main-content ${!sidebarVisible ? "sidebar-open" : ""}`}>

          {/* Outlet for Nested Routes */}
          <div className="content-body">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
