import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../../services/authentication/authService";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Dummy authentication logic
    if (authService.login(email, password)) {
      navigate("/dashboard");
    } else {
      alert("Invalid credentials");
    }
  };
  // const handleGoToRegistration = () => {
  //   navigate("/register");
  // };


  return (
    <div className="h-screen flex align-items-center justify-content-center">
      <div className="surface-card p-4 shadow-2 border-round w-full lg:w-3">
        <div className="text-center mb-5">
          <i className="pi pi-user mb-3" style={{ fontSize: "2.5rem" }}></i>
          <div className="text-900 text-3xl font-medium mb-3">Welcome</div>
        </div>
        <form onSubmit={handleLogin}>
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

            <div className="flex align-items-center justify-content-between mb-6">
              <div className="flex align-items-center">
                <label htmlFor="rememberme">Remember me</label>
              </div>
              <a className="font-medium no-underline ml-2 text-blue-500 text-right cursor-pointer">
                Forgot your password?
              </a>
            </div>

            <Button label="Sign In" className="w-full" />
            <div className="flex align-items-center justify-content-center mt-2">
              <span className="text-600 font-medium line-height-3">
                Don't have an account?
              </span>
              <a className="font-medium no-underline ml-2 text-blue-500 cursor-pointer" href="/register">
                Create today!
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
