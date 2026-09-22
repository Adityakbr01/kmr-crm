import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { toast } from "sonner";
import mainLogo from "@/assets/kmrlive.png"; // Ensure the path is correct
import { ButtonCss } from "@/components/common/ButtonCss";
import { FORGOT_PASSWORD } from "@/pages/api/UseApi";

const ForgetPassword: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const navigate = useNavigate();

  const onResetPassword = async () => {
    if (!username || !email) {
      toast.warning("Please enter a Username & Email");
      return;
    }

    try {
      const res = await FORGOT_PASSWORD(username, email);

      if (res?.data?.code === 200) {
        toast.success("New Password Sent to your Email");
        navigate("/");
      } else {
        toast.error(
          res?.data?.msg || "This email is not registered with us."
        );
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.msg || "Email Not Sent.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src={mainLogo} alt="Main Logo" className=" h-16" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
          Reset Password
        </h2>

        {/* Form */}
        <div className="space-y-6">
          {/* Username Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              User Name
            </label>
            <input
              type="text"
              name="username"
              value={username}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors placeholder-gray-400"
              placeholder="Enter User Name"
              required
            />
          </div>

          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors placeholder-gray-400"
              placeholder="Enter Email Address"
              required
            />
          </div>

          {/* Reset Password Button */}
          <button onClick={onResetPassword} className={`${ButtonCss} w-full`}>
            Reset Password
          </button>

          {/* Back to Login Link */}
          <div className="text-center">
            <Link
              to="/"
              className="text-sm text-accent-500 hover:text-accent-600"
            >
              Already have an account? Login
            </Link>
          </div>
        </div>
      </div>

      {/* Toast Container */}
    </div>
  );
};

export default ForgetPassword;
