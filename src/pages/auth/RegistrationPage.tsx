// src/RegistrationPage.js
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const RegistrationPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const toast = useRef<Toast>(null);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    toast.current?.show({
      severity: "success",
      summary: "Success",
      detail: "Registered successfully",
    });
     navigate("/configSetting");
  };
  return (
    <div className="h-screen flex align-items-center justify-content-center">
         <Toast ref={toast} />
      <div className="surface-card p-4 shadow-2 border-round w-full lg:w-3">
        <div className="text-center mb-5">
          <i className="pi pi-user-plus mb-3" style={{ fontSize: "2.5rem" }}></i>
          <div className="text-900 text-3xl font-medium mb-3">Register</div>
        </div>
        <form onSubmit={handleRegister}>
          <div>
            <label htmlFor="email" className="block text-900 font-medium mb-2">
              Email
            </label>
            <InputText
              id="email"
              type="text"
              placeholder="Email address"
              className="w-full mb-3"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label
              htmlFor="password"
              className="block text-900 font-medium mb-2"
            >
              Password
            </label>
            <InputText
              id="password"
              type="password"
              placeholder="Password"
              className="w-full mb-3"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label
              htmlFor="cofirmpassword"
              className="block text-900 font-medium mb-2"
            >
              Confirm password
            </label>
            <InputText
              id="confirmpassword"
              type="password"
              placeholder="Confirm Password"
              className="w-full mb-3"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button label="Sign Up" className="w-full" />
            <div className="flex align-items-center justify-content-center mt-2">
              Already have an account? {"  "}
              <a className="font-medium no-underline ml-2 text-blue-500 cursor-pointer" href="/">
                Sign In
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrationPage;
