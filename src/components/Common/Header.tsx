import React, { useEffect, useRef, useState } from "react";
import { Avatar } from "primereact/avatar";
import { Badge } from "primereact/badge";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import "../../assets/styles/base.scss";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "primereact/tooltip";
import { Toast } from "primereact/toast";
import authService from "../../services/authentication/authService";
import { BaseCommonService } from "../../services/baseServices/BaseCommonService";
import { Button } from "primereact/button";

interface HeaderComponentProps {
  setSidebarVisible: React.Dispatch<React.SetStateAction<boolean>>;
  buttonVisible: boolean;
}

const HeaderComponent: React.FC<HeaderComponentProps> = ({
  setSidebarVisible,
  buttonVisible,
}) => {
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);
  const userInfo = [
    { name: "Settings", action: "setting" },
    { name: "Log out", action: "logout" },
  ];
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [isSync, setIsSync] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState(userInfo[0]);
  const getuserEmail = authService.getUserEmail();
  const commanService = new BaseCommonService();

  useEffect(() => {
    const getSyncDetails = async () => {
      try {
        const data = await commanService.getCompanyDetails(getuserEmail!);

        if (data?.systemConfiguration) {
          setIsSync(true);
          setLastUpdate(data?.systemConfiguration?.mostRecentSyncDateTime ?? null)
        } else {
          setIsSync(false);
        }
        console.log("From the Header", isSync);
      } catch (err) {
        console.error(err);
      }
    };

    getSyncDetails();
  }, []);

  const toSettingpage = () => {
    navigate("/Settings");
  };
  const handleSyncData = () => {
    const now = new Date(); // Current date and time
    setLastUpdate(now);
    toast.current?.show({
      severity: "success",
      summary: "Success",
      detail: "Synced successfully",
    });
  };

  const formatDate = (date: Date | string | null): string => {
    let validDate: Date;
  
    if (typeof date === "string") {
      validDate = new Date(date);
    } else if (date instanceof Date) {
      validDate = date;
    } else {
      return ""; 
    }
  
    if (isNaN(validDate.getTime())) {
      return ""; 
    }
  
    const isDateOnly = validDate.getHours() === 0 && validDate.getMinutes() === 0 && validDate.getSeconds() === 0;
    if (isDateOnly) {
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(validDate);
    }
  
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    }).format(validDate);
  };
  
  const handleDropdownChange = (e: DropdownChangeEvent) => {
    setSelectedOption(e.value);

    // Perform action based on selection
    if (e.value.action === "setting") {
      navigate("/Settings");
    } else if (e.value.action === "logout") {
      navigate("/");
    }
  };

  return (
    <div
      className={`flex justify-content-between bg-primary-500 items-center transition-all duration-300 shadow-1 ${
        !buttonVisible ? "sidebar-open" : "main-header"
      }`}
    >
      <Toast ref={toast} />

      {/* Left Section (Menu Icon) */}
      <div className="flex align-items-center p-3">
        <i
          className={`pi ${
            !buttonVisible ? "pi-chevron-left" : "pi-bars"
          } text-white`}
          style={{ fontSize: "1.5rem" }}
          onClick={() => setSidebarVisible((prev) => !prev)}
        ></i>
      </div>

      {/* Right Section (Sync, Notifications, Avatar, and Dropdown) */}
      <div className="flex align-items-center p-3 gap-4 sm:gap-3">
        <span className="font-medium text-white hidden sm:block">
          Last sync: {lastUpdate ? formatDate(lastUpdate) : "Not synced yet"}
        </span>

        <Tooltip target=".pi-sync" position="bottom" />
        <Button
          icon="pi pi-sync"
          rounded
          text
          size="large"
          className="text-white"
          style={{ fontSize: "1.5rem" }}
          tooltip={
            isSync
              ? "Sync now"
              : "Setup System Configuration in Settings in order to sync with an external system"
          }
          tooltipOptions={{ position: 'bottom', showOnDisabled: true }} 
          onClick={handleSyncData}
          disabled={!isSync}
        />

        <i
          className="pi pi-bell p-overlay-badge text-white"
          style={{ fontSize: "1.5rem" }}
        >
          <Badge severity="danger"></Badge>
        </i>

        {/* Avatar */}
        <Avatar
          image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png"
          shape="circle"
        />

        {/* User Dropdown */}
        <div className="card flex justify-content-center">
          <Dropdown
            value={getuserEmail!}
            onChange={handleDropdownChange}
            options={userInfo}
            optionLabel="name"
            placeholder={getuserEmail!}
            className="w-full md:w-14rem border-none"
          />
        </div>
      </div>
    </div>
  );
};

export default HeaderComponent;
