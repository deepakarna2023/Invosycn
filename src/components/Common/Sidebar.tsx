import React, { useRef } from "react";
import { StyleClass } from "primereact/styleclass";
import { Ripple } from "primereact/ripple";
import { Link, useLocation } from "react-router-dom";
import { Avatar } from "primereact/avatar";
import { Tooltip } from "primereact/tooltip";

interface HeaderComponentProps {
  sidebarOpen: boolean;
}

const SidebarComponent: React.FC<HeaderComponentProps> = ({ sidebarOpen }) => {
  const btnRef1 = useRef<any>(null);
  const location = useLocation();

  // Utility to check active route
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex flex-column h-full">
      <div
        className={`flex align-items-center px-4 pt-3 flex-shrink-0  ${
          !sidebarOpen ? "justify-content-between" : "justify-content-center"
        } `}
      >
        <span className="inline-flex align-items-center gap-3">
          <i className="pi pi-send text-3xl text-white"></i>
          {!sidebarOpen && (
            <span className="font-semibold text-2xl text-primary text-white">
              Invoice App
            </span>
          )}
        </span>
      </div>
      <div className="overflow-y-auto">
        <ul className="list-none p-3 m-0">
          <li>
            <StyleClass
              nodeRef={btnRef1}
              selector="@next"
              enterClassName="hidden"
              enterActiveClassName="slidedown"
              leaveToClassName="hidden"
              leaveActiveClassName="slideup"
            >
              <div
                ref={btnRef1}
                className={`p-ripple p-3 flex align-items-center text-600 cursor-pointer  ${
                  !sidebarOpen
                    ? "justify-content-between"
                    : "justify-content-center"
                }`}
              >
                <span className="font-medium text-white">MENU</span>
                <Ripple />
              </div>
            </StyleClass>
            <ul className="list-none p-0 m-0 overflow-hidden">
              <li className="mb-2">
                <Link
                  to="/dashboard"
                  className={`no-underline p-ripple flex align-items-center gap-3 cursor-pointer px-3 py-2 border-round text-700 hover:bg-blue-300 transition-duration-150 transition-colors w-full ${
                    isActive("/dashboard") ? "bg-blue-300" : ""
                  }`}
                >
                  <div
                    className="flex align-items-center justify-content-center border-round"
                    style={{ width: "2.5rem", height: "2.5rem" }}
                  >
                    <Tooltip target=".pi-home" />
                    <i
                      className="pi pi-home text-blue-400 text-xl text-white"
                      data-pr-tooltip="Dasboard"
                    ></i>
                  </div>
                  {!sidebarOpen && (
                    <span className="font-medium text-lg text-white">
                      Dashboard
                    </span>
                  )}
                  <Ripple />
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/Clients"
                  className={`no-underline p-ripple flex align-items-center gap-3 cursor-pointer px-3 py-2 border-round text-700 hover:bg-blue-300 transition-duration-150 transition-colors w-full ${
                    isActive("/Clients") ? "bg-blue-300" : ""
                  }`}
                >
                  <div
                    className="flex align-items-center justify-content-center  border-round"
                    style={{ width: "2.5rem", height: "2.5rem" }}
                  >
                    <Tooltip target=".pi-users" />
                    <i
                      className="pi pi-users text-blue-400 text-xl text-white"
                      data-pr-tooltip="Clients"
                    ></i>
                  </div>
                  {!sidebarOpen && (
                    <span className="font-medium text-lg text-white">
                      Clients
                    </span>
                  )}
                  <Ripple />
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/Invoices"
                  className={`no-underline p-ripple flex align-items-center gap-3 cursor-pointer px-3 py-2 border-round text-700 hover:bg-blue-300 transition-duration-150 transition-colors w-full ${
                    isActive("/Invoices") ? "bg-blue-300" : ""
                  }`}
                >
                  <div
                    className="flex align-items-center justify-content-center border-round"
                    style={{ width: "2.5rem", height: "2.5rem" }}
                  >
                    <Tooltip target=".pi-receipt" />
                    <i
                      className="pi pi-receipt text-blue-400 text-xl text-white"
                      data-pr-tooltip="Invoices"
                    ></i>
                  </div>
                  {!sidebarOpen && (
                    <span className="font-medium text-lg text-white">
                      Invoices
                    </span>
                  )}
                  <Ripple />
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/itemsPage"
                  className={`no-underline p-ripple flex align-items-center gap-3 cursor-pointer px-3 py-2 border-round text-700 hover:bg-blue-300 transition-duration-150 transition-colors w-full ${
                    isActive("/itemsPage") ? "bg-blue-300" : ""
                  }`}
                >
                  <div
                    className="flex align-items-center justify-content-center  border-round"
                    style={{ width: "2.5rem", height: "2.5rem" }}
                  >
                    <Tooltip target=".pi-objects-column" />
                    <i
                      className="pi pi-objects-column text-blue-400 text-xl text-white"
                      data-pr-tooltip="Items"
                    ></i>
                  </div>
                  {!sidebarOpen && (
                    <span className="font-medium text-lg text-white">
                      Items
                    </span>
                  )}
                  <Ripple />
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/reportsPage"
                  className={`no-underline p-ripple flex align-items-center gap-3 cursor-pointer px-3 py-2 border-round text-700 hover:bg-blue-300 transition-duration-150 transition-colors w-full ${
                    isActive("/reportsPage") ? "bg-blue-300" : ""
                  }`}
                >
                  <div
                    className="flex align-items-center justify-content-center  border-round"
                    style={{ width: "2.5rem", height: "2.5rem" }}
                  >
                    <Tooltip target=".pi-file" />
                    <i
                      className="pi pi-file text-blue-400 text-xl text-white"
                      data-pr-tooltip="Reports"
                    ></i>
                  </div>
                  {!sidebarOpen && (
                    <span className="font-medium text-lg text-white">
                      Reports
                    </span>
                  )}
                  <Ripple />
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/Settings"
                  className={`no-underline p-ripple flex align-items-center gap-3 cursor-pointer px-3 py-2 border-round text-700 hover:bg-blue-300 transition-duration-150 transition-colors w-full ${
                    isActive("/Settings") ? "bg-blue-300" : ""
                  }`}
                >
                  <div
                    className="flex align-items-center justify-content-center  border-round"
                    style={{ width: "2.5rem", height: "2.5rem" }}
                  >
                    <Tooltip target=".pi-cog" />
                    <i
                      className="pi pi-cog text-blue-400 text-xl text-white"
                      data-pr-tooltip="Settings"
                    ></i>
                  </div>
                  {!sidebarOpen && (
                    <span className="font-medium text-lg text-white">
                      Settings
                    </span>
                  )}
                  <Ripple />
                </Link>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <div className="mt-auto">
        <hr className="mb-3 mx-3 border-top-1 border-none surface-border" />
        <Link
          to="/"
          className=" no-underline m-3 flex align-items-center cursor-pointer p-3 gap-2 border-round text-700 hover:bg-blue-300 transition-duration-150 transition-colors p-ripple"
        >
          <i
            className="pi pi-sign-out text-blue-400 text-xl text-white"
          />
          {!sidebarOpen && (
            <span className="font-bold text-white">Log Out</span>
          )}
        </Link>
      </div>
    </div>
  );
};

export default SidebarComponent;
