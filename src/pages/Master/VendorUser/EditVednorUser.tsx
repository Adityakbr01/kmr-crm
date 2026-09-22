import { ArrowLeft } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { ButtonCancel, ButtonCss } from "@/components/common/ButtonCss";
import { decryptId } from "@/components/common/EncryptionDecryption";
import { EditLoaderComponent } from "@/components/common/LoaderComponent";
import Layout from "@/components/Layout";
import { FETCH_VENDOR_USER_BY_ID, UPDATE_VENDOR_USER } from "@/pages/api/UseApi";

const statusOptions: { value: string; label: string }[] = [
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
];

interface VendorUserForm {
  name: string;
  mobile: string;
  email: string;
  remarks: string;
  status: string;
}

const EditVednorUser: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const decryptedId: string = decryptId(id ?? "");

  const [vendorUser, setVendorUser] = useState<VendorUserForm>({
    name: "",
    mobile: "",
    email: "",
    remarks: "",
    status: "",
  });

  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingdata, setLoadingData] = useState<boolean>(false);

  // Fetch vendor user data by ID
  useEffect(() => {
    const fetchVendorUser = async () => {
      setLoadingData(true);

      try {
        const response: any = await FETCH_VENDOR_USER_BY_ID(decryptedId);
        setVendorUser(response.data.adminUser);
      } catch (error: any) {
        console.error("Error fetching vendor user data:", error);
        toast.error("Failed to fetch vendor user data.");
      } finally {
        setLoadingData(false);
      }
    };

    fetchVendorUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [decryptedId]);

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
    formData.append("status", vendorUser.status);

    const formEl = document.getElementById(
      "editVendorUserForm"
    ) as HTMLFormElement | null;
    const isFormValid = formEl?.checkValidity() ?? false;
    formEl?.reportValidity();

    if (isFormValid) {
      setIsButtonDisabled(true);
      setLoading(true);

      try {
        const response: any = await UPDATE_VENDOR_USER(decryptedId, formData);
        if (response.data.code == 200) {
          navigate("/master/vendor-user");
          toast.success(response.data.msg || "Data updated successfully");
        } else {
          toast.error(response.data.msg || "Duplicate Entry");
        }
      } catch (error: any) {
        console.error("Error updating vendor user:", error);
        toast.error("Failed to update vendor user.");
      } finally {
        setIsButtonDisabled(false);
        setLoading(false);
      }
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
            Edit Vendor User
          </h1>
        </div>
        {loadingdata ? (
          <EditLoaderComponent />
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 w-full">
            <form
              id="editVendorUserForm"
              autoComplete="off"
              onSubmit={onSubmit}
            >
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
                    disabled
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

                {/* Status Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status <span className="text-red-700">*</span>
                  </label>
                  <select
                    name="status"
                    value={vendorUser.status}
                    onChange={onInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all"
                    required
                  >
                    <option value="" disabled>
                      Select Status
                    </option>
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
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
                  {loading ? "Updating..." : "Update"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default EditVednorUser;
