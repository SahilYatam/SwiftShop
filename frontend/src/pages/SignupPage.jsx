import { useState } from "react";
import Button from "../components/Button.jsx"
import Input from "../components/Input.jsx"
import { FaEnvelope, FaEye, FaEyeSlash, FaUser } from "react-icons/fa";

import {Link} from "react-router-dom"

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState("password");

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-4xl flex shadow-lg rounded-lg overflow-hidden">

        <div className="w-1/2 bg-black text-white flex flex-col justify-center items-center p-10">
          <h2 className="text-3xl font-bold mb-4">SAFE. SIMPLE. SMART.</h2>
          <p className="text-[1em] text-center">
            We respect your privacy. Signing up is quick and easy.
          </p>
        </div>

        <div className="w-1/2 bg-white text-black p-10">
          <h2 className="text-2xl font-bold mb-6 text-center">Signup</h2>

          <div className="mb-4 relative">
            <Input
              type="text"
              placeholder={"User"}
              className="w-full border-b-2 placeholder:text-black border-gray-400 py-2"
            />
            <FaUser className="absolute top-3 right-2 text-black" />
          </div>

          <div className="mb-4 relative">
            <Input
              type="text"
              placeholder={"Email"}
              className="w-full border-b-2 placeholder:text-black border-gray-400 py-2"
            />
            <FaEnvelope className="absolute top-3 right-2 text-black" />
          </div>

          <div className="mb-6 relative">
            <Input
              type={showPassword ? "password" : "text"}
              placeholder={"Password"}
              className="w-full border-b-2 text-black placeholder:text-black border-gray-400 py-2"
            />

            {showPassword ? (
              <FaEyeSlash
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-3 right-2 text-black cursor-pointer"
              />
            ) : (
              <FaEye
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-3 right-2 text-black cursor-pointer"
              />
            )}
          </div>
          <div className="flex flex-col justify-center items-center py-3">
            
            <Button
              type="Submit"
              className={"bg-black text-white rounded-full w-27"}
            >
              Sign up
            </Button>

            <p className="mt-4 text-sm">
              Don't have an account?{" "}
              <Link to={"/login"}>
              <span className="text-black font-bold hover:underline cursor-pointer">
                Login
              </span>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
