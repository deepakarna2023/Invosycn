import React, { useEffect, useRef, useState } from "react";
import { setSelectedConfig } from "../redux/slices/configSlice";
import { useSelector, useDispatch } from "react-redux";
import { InputNumber, InputNumberChangeEvent } from "primereact/inputnumber";
import CompanySetting from "../models/CompanyModel";
import { InputText } from "primereact/inputtext";
import { Fieldset } from "primereact/fieldset";
import { Dropdown } from "primereact/dropdown";
import { RootState } from "../redux/store";
import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";
import { FloatLabel } from "primereact/floatlabel";
import { InputSwitch } from "primereact/inputswitch";
import authService from "../services/authentication/authService";
import { BaseCommonService } from "../services/baseServices/BaseCommonService";
import { Image } from "primereact/image";
import { Card } from "@mui/material";
import { Toast } from "primereact/toast";
import { InputMask, InputMaskChangeEvent } from "primereact/inputmask";
import { ProgressSpinner } from "primereact/progressspinner";

const SettingPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [isUpdate, setUpdate] = useState(true);
  const [testEmail, setTestEmail] = useState(false);
  const [testConfig, setTestConfig] = useState(false);
  const [syncData, setSyncData] = useState(false);
  const [error, setError] = useState("");
  const commanService = new BaseCommonService();
  const toast = useRef<Toast>(null);
  const [selectedConfig, setSelectedConfig] = useState("");
  const [countries, setCountries] = useState([]);
  const [invalidFields, setInvalidFields] = useState<Set<string>>(new Set());
  const [isUseDefaultSmtp, setUseDefaultSmtp] = useState(false);
  const [isSelectDisable, setSelectDisable] = useState(false);
  const [selectedConfigState, setSelectedConfigState] = useState<{
    [key: string]: string;
  }>({});

  const configOptions = [
    { label: "QuickBooks", value: "QuickBooks" },
    { label: "Wave", value: "Wave" },
    { label: "FreshBooks", value: "FreshBooks" },
    { label: "ATS", value: "ATS" },
  ];
  // const [companySetting, setCompanySetting] = useState<CompanySetting | null>(null);
  const defaultSystemConfiguration = {
    id: "",
    companyId: "",
    systemConfigurationType: "",
    synced: false,
    mostRecentSyncDateTime: new Date(),
    quickBooksSystemConfiguration_ClientId: "",
    quickBooksSystemConfiguration_ClientSecret: "",
    quickBooksSystemConfiguration_RedirectUri: "",
    quickBooksSystemConfiguration_AccessToken: "",
    quickBooksSystemConfiguration_RefreshToken: "",
    quickBooksSystemConfiguration_CompanyId: "",
    waveSystemConfiguration_ApiKey: "",
    waveSystemConfiguration_BusinessId: "",
    waveSystemConfiguration_AccessToken: "",
    freshBooksSystemConfiguration_ClientId: "",
    freshBooksSystemConfiguration_ClientSecret: "",
    freshBooksSystemConfiguration_RedirectUri: "",
    freshBooksSystemConfiguration_AccessToken: "",
    freshBooksSystemConfiguration_AccountId: "",
    atsSystemConfiguration_atsName: "",
    atsSystemConfiguration_atsApiUrl: "",
    atsSystemConfiguration_atsApiKey: "",
  };
  const [companySetting, setCompanySetting] = useState<CompanySetting>({
    id: "",
    companyName: "",
    smtpHost: "",
    smtpPort: 0,
    smtpUsername: "",
    smtpPassword: "",
    image: "",
    logo: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    country: "",
    zip: "",
    personDetails: {
      id: "",
      companyId: "",
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: null,
    },
    systemConfiguration: defaultSystemConfiguration,
  });

  useEffect(() => {
    const getCompanyDetails = async () => {
      setLoading(true);
      try {
        const getuserEmail = await authService.getUserEmail();
        const data = await commanService.getCompanyDetails(getuserEmail!);
        if (data?.systemConfiguration) {
          setCompanySetting(data);
          setSelectedConfig(data?.systemConfiguration?.systemConfigurationType ?? "");
         setSelectDisable(data?.systemConfiguration?.systemConfigurationType  !== "" ? true : false)
        } else {
          setCompanySetting((prev) => ({
            ...prev,
            systemConfiguration: defaultSystemConfiguration,
          }));
        }
      } catch (err) {
        setError("Error fetching company details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getCompanyDetails();
    commanService.getCountries().then(setCountries);
  }, []);

  const handleUpdateSetting = async () => {
    debugger;
    setLoading(true);
    if (!companySetting.id) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Company ID is required to update settings.",
      });
      return;
    }

    try {
      debugger;
      await commanService.updateCompanyDetails(companySetting);
      setTimeout(() => {
        setLoading(false);
        setUpdate(true);
        toast.current?.show({
          severity: "success",
          summary: "Success",
          detail: "Setting updated successfully",
        });
      }, 2000);
    } catch (error) {
      setLoading(true);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to update settings. Please try again.",
      });
    }
  };

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | InputNumberChangeEvent
      | InputMaskChangeEvent,
    path: string | string[]
  ) => {
    const value = "target" in e ? e.target.value : e.value;
    const pathArray = Array.isArray(path) ? path : path.split(".");
    setUpdate(false);
    setCompanySetting((prevState) => {
      let updatedSetting = { ...prevState };
      let current = updatedSetting;

      for (let i = 0; i < pathArray.length - 1; i++) {
        current = current[pathArray[i]];
      }
      current[pathArray[pathArray.length - 1]] = value;

      const fieldKey = pathArray[pathArray.length - 1];
      setInvalidFields((prevInvalidFields) => {
        const newInvalidFields = new Set(prevInvalidFields);
        if (!value) {
          newInvalidFields.add(fieldKey);
        } else {
          newInvalidFields.delete(fieldKey);
        }
        return newInvalidFields;
      });

      return updatedSetting;
    });

    const configKey = pathArray[pathArray.length - 1];
    setSelectedConfigState((prevState: any) => ({
      ...prevState,
      [configKey]: value,
    }));

    areAllFieldsFilled();
  };

  const isSmtpConfigComplete = () => {
    const { smtpUsername, smtpPassword, smtpHost, smtpPort } = companySetting;
    return smtpUsername && smtpPassword && smtpHost && smtpPort! > 0;
  };

  const handleConfigChange = (e: { value: string | null }) => {
    debugger;
    setSelectedConfig(e.value ?? "");
    setInvalidFields(new Set());
    const configPrefix = e.value
      ? `${
          e.value.charAt(0).toLowerCase() + e.value.slice(1)
        }SystemConfiguration_`
      : "";

    const systemConfig = Object.entries(companySetting?.systemConfiguration!)
      .filter(([key]) => key.startsWith(configPrefix))
      .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {} as { [key: string]: string });

    setSelectedConfigState(systemConfig);

    setCompanySetting((prev : any) => ({
      ...prev,
      systemConfiguration: {
        ...prev.systemConfiguration,
        systemConfigurationType: e.value ?? "",
      },
    }));
  };

  const areAllFieldsFilled = () => {
    return Object.values(selectedConfigState).every((value) => value !== "");
  };

  const customBase64Uploader = async (event: { files: any[] }) => {
    const file = event.files[0];
    const reader = new FileReader();
    let blob = await fetch(file.objectURL).then((r) => r.blob());

    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      const base64data = reader.result;
    };
  };

  const sendTestEmail = () => {
    setTestEmail(true);
    setTimeout(() => {
      setTestEmail(false);
      toast.current?.show({
        severity: "success",
        summary: "Success",
        detail: "Test Email Successfully Sent",
      });
    }, 2000);
  };

  const testSystemConfiguration = () => {
    setTestConfig(true);
    setTimeout(() => {
      setTestConfig(false);
      toast.current?.show({
        severity: "success",
        summary: "Success",
        detail: "Configuration Successfully tested",
      });
    }, 2000);
  };

  const handleSystemSync = async () => {
    setSyncData(true);

    const updatedSystemConfiguration = companySetting.systemConfiguration
        ? {
            ...companySetting.systemConfiguration,
            id: companySetting.systemConfiguration?.id ?? "",
            synced: true,
            mostRecentSyncDateTime: new Date(),
            systemConfigurationType: selectedConfig,
          }
        : companySetting.systemConfiguration;

    const updatedCompanySetting = {
        ...companySetting,
        systemConfiguration: updatedSystemConfiguration,
    };

    // Update the state and call the API with updated data
    setCompanySetting(updatedCompanySetting);

    try {
        await commanService.updateCompanyDetails(updatedCompanySetting);
        toast.current?.show({
            severity: "info",
            summary: "Clients",
            detail: "214 Clients are synced",
        });
    } catch (error) {
        console.error("Sync error:", error);
        toast.current?.show({
            severity: "error",
            summary: "Error",
            detail: "Failed to sync clients. Please try again.",
        });
    } finally {
        setSyncData(false);
    }
};

  const onUpload = () => {
    toast.current?.show({
      severity: "info",
      summary: "Success",
      detail: "File Uploaded",
    });
  };

  const formatLabel = (field: string): string => {
    return field
      .replace(/^[^_]*_/, "")
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/_/g, " ");
  };
  return (
    <div className="surface-0 p-4 shadow-2 border-round ">
      <Toast ref={toast} />
      <div className="text-4xl flex  justify-content-between font-semibold text-600 mb-3">
        Settings
        <Button
          label="Update"
          icon="pi pi-pencil"
          disabled={isUpdate}
          onClick={handleUpdateSetting}
          className="p-button-info"
        />
      </div>
      {/* <div className="gap-2 mb-4 flex flex-column align-items-center">
        <Card className="flex justify-content-center shadow-2 border-round w-8rem h-8rem">
          <Image
            src="https://primefaces.org/cdn/primereact/images/galleria/galleria7.jpg"
            alt="Image"
            width="250"
            preview
          />
        </Card>
        <div className="">
          <FileUpload
            mode="basic"
            name="demo[]"
            url="/api/upload"
            accept="image/*"
            maxFileSize={1000000}
            onUpload={onUpload}
          />
        </div>
      </div> */}
      <div>
        {loading && (
          <div className="flex justify-content-center align-items-center w-full h-24rem absolute">
            <ProgressSpinner />
          </div>
        )}

        <div className="flex gap-3">
          <div className="w-4 p-3 flex flex-column gap-2 border-round justify-content-start shadow-2">
            <div className=" flex flex-row gap-2 mb-2">
              <i className="pi pi-user text-blue-500 text-xl"></i>
              <span className="text-400 mb-2">Profile</span>
            </div>
            <div className=" flex flex-row gap-2 mb-2">
              <span className="text-400 text-sm mb-2">Company details</span>
            </div>

            <div className="flex-row flex gap-4 my-2">
              <FloatLabel>
                <label htmlFor="companyName" className="block text-sm">
                  Company Name
                </label>
                <InputText
                  id="companyName"
                  value={companySetting!.companyName}
                  onChange={(e) => handleChange(e, "companyName")}
                  placeholder="Enter company name"
                  className="w-full"
                />
              </FloatLabel>
              <FloatLabel>
                <label htmlFor="address1" className="block text-sm">
                  Address 1
                </label>
                <InputText
                  id="address1"
                  className="w-full "
                  value={companySetting!.address1}
                  onChange={(e) => handleChange(e, "address1")}
                />
              </FloatLabel>
            </div>
            <div className="flex-row flex gap-4 my-2">
              <FloatLabel>
                <label htmlFor="address2" className="block text-sm">
                  Address 2
                </label>
                <InputText
                  id="address2"
                  className="w-full"
                  value={companySetting!.address2}
                  onChange={(e) => handleChange(e, "address2")}
                />
              </FloatLabel>
              <FloatLabel>
                <label htmlFor="city" className="block text-sm">
                  City
                </label>
                <InputText
                  id="city"
                  className="w-full "
                  value={companySetting!.city}
                  onChange={(e) => handleChange(e, "city")}
                />
              </FloatLabel>
            </div>
            <div className="flex-row flex gap-4 my-2">
              <FloatLabel>
                <label htmlFor="state" className="block text-sm">
                  State
                </label>
                <InputText
                  id="state"
                  className="w-full"
                  value={companySetting!.state}
                  onChange={(e) => handleChange(e, "state")}
                />
              </FloatLabel>
              <FloatLabel>
                <label htmlFor="zipCode" className="block text-sm">
                  ZIP Code
                </label>
                <InputText
                  id="zipCode"
                  className="w-full "
                  value={companySetting!.zip}
                  onChange={(e) => handleChange(e, "zip")}
                />
              </FloatLabel>
            </div>
            <div className="flex-row flex gap-4 my-2">
              <FloatLabel>
                <label htmlFor="country" className="block text-sm">
                  Country
                </label>
                <InputText
                  id="country"
                  className="w-full"
                  value={companySetting!.country}
                  onChange={(e) => handleChange(e, "country")}
                />
              </FloatLabel>
              {/* <Dropdown
              id="country"
              value={companySetting!.country}
              options={countries}
              onChange={(e) => handleConfigChange(e)}
              placeholder="Select a country"
              className="w-full"
            /> */}
            </div>
            <div className=" flex flex-row gap-2 mb-2">
              <span className="text-400 text-sm mb-2">Person details</span>
            </div>
            <div className="flex-row flex gap-4 my-2">
              <FloatLabel>
                <label htmlFor="firstName" className="block text-sm">
                  First Name
                </label>
                <InputText
                  id="firstName"
                  value={companySetting!.personDetails!.firstName}
                  type="firstName"
                  onChange={(e) => handleChange(e, "personDetails.firstName")}
                  placeholder="Enter your firstName"
                  className="w-full"
                />
              </FloatLabel>
              <FloatLabel>
                <label htmlFor="lastName" className="block text-sm">
                  Last Name
                </label>
                <InputText
                  id="lastName"
                  value={companySetting!.personDetails!.lastName}
                  type="lastName"
                  onChange={(e) => handleChange(e, "personDetails.lastName")}
                  placeholder="Enter your lastName"
                  className="w-full"
                />
              </FloatLabel>
            </div>
            <div className="flex-row flex gap-4 my-2">
              <FloatLabel>
                <label htmlFor="email" className="block text-sm">
                  Email
                </label>
                <InputText
                  id="email"
                  value={companySetting!.personDetails!.email}
                  type="email"
                  onChange={(e) => handleChange(e, "personDetails.email")}
                  placeholder="Enter your email"
                  className="w-full"
                />
              </FloatLabel>
              <FloatLabel>
                <label htmlFor="phoneNumber" className="block text-sm">
                  Phone number
                </label>
                <InputMask
                  id="phoneNumber"
                  placeholder="Enter phone number"
                  value={
                    companySetting!.personDetails!.phoneNumber?.toString() || ""
                  }
                  onChange={(e: InputMaskChangeEvent) =>
                    handleChange(e, "personDetails.phoneNumber")
                  }
                  className="w-full"
                  mask="(999) 999-9999"
                />
              </FloatLabel>
            </div>
          </div>
          <div className="w-4 p-3 flex flex-column gap-2 border-round justify-content-start shadow-2 ">
            <div className="flex  justify-content-between align-items-center font-semibold text-600">
              <div className=" flex flex-row gap-2 mb-2">
                <i className="pi pi-envelope text-blue-500 text-xl"></i>
                <span className="text-400  mb-2">SMTP configuration</span>
              </div>
            </div>
            <div className="flex flex-row gap-3 mb-2 justify-content-between align-items-center h-3rem">
              <div className="flex align-items-center gap-2">
                <span className="text-600">Use Default</span>
                <InputSwitch
                  checked={isUseDefaultSmtp}
                  onClick={(e) => {
                    setUseDefaultSmtp(!isUseDefaultSmtp);
                    setUpdate(!isUpdate);
                  }}
                ></InputSwitch>
              </div>

              <Button
                label="Test"
                onClick={sendTestEmail}
                className="p-button-info"
                loading={testEmail}
                disabled={!isSmtpConfigComplete()}
                visible={!isUseDefaultSmtp}
              />
            </div>
            <p className="text-gray-700 text-center text-md m-2">
              {!isUseDefaultSmtp
                ? "This will use your SMTP service to send emails.  It will come from the email address you provide"
                : "This will use our SMTP service to send emails.  Your clients will see our email address but your letterhead on the invoice"}
            </p>
            {!isUseDefaultSmtp && (
              <>
                <label htmlFor="username" className="block text-sm">
                  User name
                </label>
                <InputText
                  id="username"
                  value={companySetting!.smtpUsername!}
                  onChange={(e) => handleChange(e, "smtpUsername")}
                  placeholder="Enter username"
                  className="w-full"
                />
                <label htmlFor="password" className="block text-sm">
                  Password
                </label>
                <InputText
                  id="password"
                  type="password"
                  value={companySetting!.smtpPassword!}
                  onChange={(e) => handleChange(e, "smtpPassword")}
                  placeholder="Enter password"
                  className="w-full"
                />
                <label htmlFor="smtpHost" className="block text-sm">
                  SMTP Host
                </label>
                <InputText
                  id="smtpHost"
                  value={companySetting!.smtpHost}
                  onChange={(e) => handleChange(e, "smtpHost")}
                  placeholder="Enter SMTP Host"
                  className="w-full"
                />
                <label htmlFor="smtpPort" className="block text-sm">
                  SMTP Port
                </label>
                <InputNumber
                  id="smtpPort"
                  value={companySetting?.smtpPort!}
                  onChange={(e: InputNumberChangeEvent) =>
                    handleChange(e, "smtpPort")
                  }
                  placeholder="Enter SMTP Port"
                  min={1}
                  max={65535}
                  className="w-full"
                />
              </>
            )}
          </div>
          <div className="w-4 p-3 flex flex-column gap-2 border-round justify-content-start shadow-2 h-auto">
            <div className="flex justify-content-between align-items-center font-semibold text-600">
              <div className=" flex flex-row gap-2 mb-2">
                <i className="pi pi-envelope text-blue-500 text-xl"></i>
                <span className="text-400 pb-2">System Configuration</span>
              </div>
            </div>
            <div className="flex flex-row gap-3 mb-2 justify-content-between align-items-center h-3rem">
              <span className="text-600 text-sm">
                System Configuration Type
              </span>
              <div className="flex align-items-center">
                <Button
                  label="Test"
                  onClick={testSystemConfiguration}
                  className="p-button-info mr-2"
                  loading={testConfig}
                  visible={selectedConfig !== ""}
                  disabled={!areAllFieldsFilled()}
                />
                <Button
                  label="Sync"
                  onClick={handleSystemSync}
                  loading={syncData}
                  icon="pi pi-sync"
                  visible={selectedConfig !== ""}
                  disabled={!areAllFieldsFilled()}
                />
              </div>
            </div>

            <Dropdown
              id="configType"
              value={selectedConfig}
              options={configOptions}
              onChange={(e) => handleConfigChange(e)}
              placeholder="Select a Configuration"
              className="w-full"
              disabled={ companySetting?.systemConfiguration?.systemConfigurationType !== "" && companySetting?.systemConfiguration?.synced }
            />
            {selectedConfig === "QuickBooks" && (
              <div className="mb-4 text-base card">
                <h3 className="text-lg font-semibold">
                  QuickBooks Configuration
                </h3>
                {Object.entries(companySetting?.systemConfiguration!)
                  .filter(([key]) =>
                    key.startsWith("quickBooksSystemConfiguration_")
                  )
                  .map(([field, value]) => (
                    <div className="field mb-3 flex flex-column" key={field}>
                      <label htmlFor={field} className="block text-sm">
                        {formatLabel(field)}
                      </label>
                      <InputText
                        id={field}
                        value={value as string}
                        className={`${
                          invalidFields.has(field) ? "p-invalid" : ""
                        }`}
                        onChange={(e) =>
                          handleChange(e, `systemConfiguration.${field}`)
                        }
                        placeholder={`Enter ${formatLabel(field)}`}
                      />
                      {invalidFields.has(field) && (
                        <span className="text-red-500 text-xs mt-2">
                          This field is required
                        </span>
                      )}
                    </div>
                  ))}
              </div>
            )}

            {selectedConfig === "Wave" && (
              <div className="mb-4 text-base card">
                <h3 className="text-lg font-semibold">Wave Configuration</h3>
                {Object.entries(companySetting?.systemConfiguration!)
                  .filter(([key]) => key.startsWith("waveSystemConfiguration_"))
                  .map(([field, value]) => (
                    <div className="field mb-3 flex flex-column" key={field}>
                      <label htmlFor={field} className="block text-sm">
                        {formatLabel(field)}
                      </label>
                      <InputText
                        id={field}
                        value={value as string}
                        className={`${
                          invalidFields.has(field) ? "p-invalid" : ""
                        }`}
                        onChange={(e) =>
                          handleChange(e, `systemConfiguration.${field}`)
                        }
                        placeholder={`Enter ${formatLabel(field)}`}
                      />
                      {invalidFields.has(field) && (
                        <span className="text-red-500 text-xs mt-2">
                          This field is required
                        </span>
                      )}
                    </div>
                  ))}
              </div>
            )}
            {selectedConfig === "FreshBooks" && (
              <div className="mb-4 text-base card">
                <h3 className="text-lg font-semibold">
                  FreshBooks Configuration
                </h3>
                {Object.entries(companySetting?.systemConfiguration!)
                  .filter(([key]) =>
                    key.startsWith("freshBooksSystemConfiguration_")
                  )
                  .map(([field, value]) => (
                    <div className="field mb-3 flex flex-column" key={field}>
                      <label htmlFor={field} className="block text-sm">
                        {formatLabel(field)}
                      </label>
                      <InputText
                        id={field}
                        value={value as string}
                        className={`${
                          invalidFields.has(field) ? "p-invalid" : ""
                        }`}
                        onChange={(e) =>
                          handleChange(e, `systemConfiguration.${field}`)
                        }
                        placeholder={`Enter ${formatLabel(field)}`}
                      />
                      {invalidFields.has(field) && (
                        <span className="text-red-500 text-xs mt-2">
                          This field is required
                        </span>
                      )}
                    </div>
                  ))}
              </div>
            )}

            {selectedConfig === "ATS" && (
              <div className="mb-4 text-base card">
                <h3 className="text-lg font-semibold">ATS Configuration</h3>
                {Object.entries(companySetting?.systemConfiguration!)
                  .filter(([key]) => key.startsWith("atsSystemConfiguration_"))
                  .map(([field, value]) => (
                    <div className="field mb-3 flex flex-column" key={field}>
                      <label htmlFor={field} className="block text-sm">
                        {formatLabel(field)}
                      </label>
                      <InputText
                        id={field}
                        value={value as string}
                        className={`${
                          invalidFields.has(field) ? "p-invalid" : ""
                        }`}
                        onChange={(e) =>
                          handleChange(e, `systemConfiguration.${field}`)
                        }
                        placeholder={`Enter ${formatLabel(field)}`}
                      />
                      {invalidFields.has(field) && (
                        <span className="text-red-500 text-xs mt-2">
                          This field is required
                        </span>
                      )}
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingPage;
