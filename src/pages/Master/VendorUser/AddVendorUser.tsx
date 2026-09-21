import { ArrowLeft } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ButtonCancel, ButtonCss } from "@/components/common/ButtonCss";
import Layout from "@/components/Layout";
import { CREATE_VENDOR_USER_LIST } from "@/pages/api/UseApi";

interface VendorUserForm {
  name: string;
  mobile: string;
  email: string;
  remarks: string;
}

const AddVendorUser: React.FC = () => {
  const navigate = useNavigate();

  const [vendorUser, setVendorUser] = useState<VendorUserForm>({
    name: "",
    mobile: "",
    email: "",
    remarks: "",
  });

  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // Handle input change
  const onInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setVendorUser({
      ...vendorUser,
      [name]: value,
    });
  };

  // Handle form submission
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", vendorUser.name);
    formData.append("mobile", vendorUser.mobile);
    formData.append("email", vendorUser.email);
    formData.append("remarks", vendorUser.remarks);

    const formElement = document.getElementById(
      "addVendorUserForm"
    ) as HTMLFormElement | null;

    if (!formElement || !formElement.checkValidity()) {
      formElement?.reportValidity();
      return;
    }

    try {
      setIsButtonDisabled(true);
      setLoading(true);

      const res: any = await CREATE_VENDOR_USER_LIST(formData);

      if (res.data.code === 200) {
        toast.success(res.data.msg || "Data inserted successfully");
        navigate("/master/vendor-user");
      } else {
        toast.error(res.data.msg || "Duplicate Entry");
        setIsButtonDisabled(false);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.msg || "An error occurred");
      setIsButtonDisabled(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="p-2 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="flex items-center mb-4 p-4 bg-white shadow-sm rounded-lg">
          <button
            onClick={() => navigate("/master/vendor-user")}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft />
          </button>
          <h1 className="text-2xl font-semibold text-gray-800 ml-2">
            Create Vendor User
          </h1>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 w-full">
          <form id="addVendorUserForm" autoComplete="off" onSubmit={onSubmit}>
            <div className="space-y-4">
              {/* Name Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name <span className="text-red-700">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={vendorUser.name}
                  onChange={onInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all"
                  placeholder="Enter Name"
                  required
                />
              </div>

              {/* Mobile Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile <span className="text-red-700">*</span>
                </label>
                <input
                  type="text"
                  name="mobile"
                  value={vendorUser.mobile}
                  onChange={onInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all"
                  placeholder="Enter Mobile"
                  inputMode="numeric"
                  maxLength={10}
                  minLength={10}
                  required
                />
              </div>

              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-700">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={vendorUser.email}
                  onChange={onInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all"
                  placeholder="Enter Email"
                  required
                />
              </div>

              {/* Remarks Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Remarks <span className="text-red-700">*</span>
                </label>
                <input
                  type="text"
                  name="remarks"
                  value={vendorUser.remarks}
                  onChange={onInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all"
                  placeholder="Enter Remarks"
                  required
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end mt-8 space-x-4">
              <button
                type="button"
                onClick={() => navigate("/master/vendor-user")}
                className={ButtonCancel}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isButtonDisabled}
                className={ButtonCss}
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default AddVendorUser;
