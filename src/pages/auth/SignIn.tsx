import { Eye, EyeOff } from "lucide-react";
import Checkbox from "@mui/material/Checkbox";
import { useFormik } from "formik";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import * as Yup from "yup";
import siginLogo from "@/assets/kmrlive.png";
import signinIllustration from "@/assets/sigin.png";
import { ButtonCss } from "@/components/common/ButtonCss";
import {
  decryptData,
  encryptData,
} from "@/components/common/EncryptionDecryption";
import { PANEL_LOGIN } from "@/pages/api/UseApi";

interface SignInFormValues {
  email: string;
  password: string;
}

const SignIn: React.FC = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const validationSchema = Yup.object({
    email: Yup.string().required("UserName is required"),
    password: Yup.string()
      .min(2, "Password should be of minimum 2 characters length")
      .required("Password is required"),
  });

  const formik = useFormik<SignInFormValues>({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values: SignInFormValues) => {
      setIsLoading(true);
      try {
        const formData = {
          username: values.email,
          password: values.password,
        };

        const response = await PANEL_LOGIN(formData);
        const data = response?.data;

        if (response?.status === 200 && (data?.UserInfo?.token || data?.token)) {
          const token = data?.UserInfo?.token || data?.token;
          const user = data?.UserInfo?.user || data?.user || {};
          const username = user?.name || values.email;
          const userType = user?.user_type ?? "";

          const encryptedToken = encryptData(token);
          const encryptedUsername = encryptData(username);
          const encryptedUserType = encryptData(userType);

          localStorage.setItem("token", encryptedToken);
          localStorage.setItem("username", encryptedUsername);
          localStorage.setItem("user_type", encryptedUserType);

          navigate("/home");
          toast.success("Login Successful.");
        } else {
          toast.error(
            data?.msg || "Login failed. Username and password are incorrect."
          );
        }
      } catch (error: any) {
        console.error("Error:", error);
        toast.error(
          error?.response?.data?.msg ||
            "An error occurred. Please try again later."
        );
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image Section */}
      <div className="hidden lg:flex w-1/2 bg-accent-600 relative overflow-hidden">
        <img
          src={signinIllustration}
          alt="SignIn Illustration"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 flex flex-col justify-center items-center text-white p-12 text-center w-full">
          <h2 className="text-4xl font-bold mb-4 drop-shadow-md">Welcome Back</h2>
          <p className="text-lg text-center max-w-md text-white/90 drop-shadow-sm">
            Manage your spice, oil, and seed inventory effortlessly with our
            CRM.
          </p>
        </div>
      </div>

      {/* Right Side - Form Section */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-10 bg-white">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img
              src={siginLogo}
              alt="Logo"
              className="h-16 w-auto object-contain"
            />
          </div>

          <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
            Welcome Back, Sign In
          </h2>
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Username
              </label>
              <input
                type="text"
                id="email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors placeholder-gray-400"
                placeholder="Enter your Username"
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-sm text-red-500 mt-1">
                  {formik.errors.email}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors placeholder-gray-400"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={handleClickShowPassword}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-500" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-500" />
                  )}
                </button>
              </div>
              {formik.touched.password && formik.errors.password && (
                <p className="text-sm text-red-500 mt-1">
                  {formik.errors.password}
                </p>
              )}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Checkbox
                  tabIndex={-1}
                  id="rememberMe"
                  name="rememberMe"
                  color="primary"
                />
                <label
                  htmlFor="rememberMe"
                  className="ml-2 text-sm text-gray-700"
                >
                  Remember Me
                </label>
              </div>
              <Link
                tabIndex={-1}
                to="/forget-password"
                className="text-sm text-accent-500 hover:text-accent-600"
              >
                Forgot Password?
              </Link>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className={`${ButtonCss} w-full`}
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
