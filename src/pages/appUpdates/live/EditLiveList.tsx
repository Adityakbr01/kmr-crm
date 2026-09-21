import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "@/components/Layout";

import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { ButtonCancel, ButtonCss } from "@/components/common/ButtonCss";
import { decryptId } from "@/components/common/EncryptionDecryption";
import { EditLoaderComponent } from "@/components/common/LoaderComponent";
import { UPDATE_VENDOR_LIVE, VENDOR_LIVE_LIST_BY_ID } from "@/pages/api/UseApi";

interface VendorForm {
  vendor_product_category_sub: string;
  vendor_product: string;
  vendor_product_size: string;
  vendor_product_rate: string;
  vendor_product_status: string;
}

interface StatusOption {
  value: string;
  label: string;
}

const statusOptions: StatusOption[] = [
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
];

const EditLiveList: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const decryptedId = decryptId(id as string);

  const [vendor, setVendor] = useState<VendorForm>({
    vendor_product_category_sub: "",
    vendor_product: "",
    vendor_product_size: "",
    vendor_product_rate: "",
    vendor_product_status: "",
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [loadingdata, setLoadingData] = useState<boolean>(false);

  // Fetch vendor data by ID
  useEffect(() => {
    const fetchVendor = async (): Promise<void> => {
      setLoadingData(true);

      try {
        const response: any = await VENDOR_LIVE_LIST_BY_ID(decryptedId);
        setVendor(response.data.vendor);
      } catch (error: any) {
        console.error("Error fetching vendor data:", error);
        toast.error("Failed to fetch vendor data.");
      } finally {
        setLoadingData(false);
      }
    };

    fetchVendor();
  }, [decryptedId]);

  // Handle input change
  const onInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    setVendor({
      ...vendor,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    const data = {
      vendor_product: vendor.vendor_product,
      vendor_product_size: vendor.vendor_product_size,
      vendor_product_rate: vendor.vendor_product_rate,
      vendor_product_status: vendor.vendor_product_status,
    };

    try {
      setLoading(true);
      const response: any = await UPDATE_VENDOR_LIVE(decryptedId, data);
      if (response.data.code == 200) {
        navigate("/app-update/live");
        toast.success(response.data.msg || "Data updated successfully");
      } else if (response.data.code == 403) {
        toast.error(response.data.msg || "Duplicate Entry", {
          position: "top-right",
        });
      }
    } catch (error: any) {
      console.error("Error updating vendor:", error);
      toast.error("Failed to update vendor.");
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
            onClick={() => navigate("/app-update/live")}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft />
          </button>
          <h1 className="text-2xl font-semibold text-gray-800 ml-2">
            Edit Vendor
          </h1>
        </div>

        {loadingdata ? (
          <EditLoaderComponent />
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 w-full">
            <form autoComplete="off" onSubmit={onSubmit}>
              <div className="space-y-2">
                {/* Sub Category Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sub Category
                  </label>
                  <input
                    type="text"
                    name="vendor_product_category_sub"
                    value={vendor.vendor_product_category_sub}
                    onChange={onInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all"
                    placeholder="Enter Sub Category"
                    disabled
                  />
                </div>

                {/* Product Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product <span className="text-red-700">*</span>
                  </label>
                  <input
                    type="text"
                    name="vendor_product"
                    value={vendor.vendor_product}
                    onChange={onInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all"
                    placeholder="Enter Product"
                    required
                  />
                </div>

                {/* Size Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Size <span className="text-red-700">*</span>
                  </label>
                  <input
                    type="text"
                    name="vendor_product_size"
                    value={vendor.vendor_product_size}
                    onChange={onInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all"
                    placeholder="Enter Size"
                    required
                  />
                </div>

                {/* Rate Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rate <span className="text-red-700">*</span>
                  </label>
                  <input
                    type="number"
                    name="vendor_product_rate"
                    value={vendor.vendor_product_rate}
                    onChange={onInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all"
                    placeholder="Enter Rate"
                    required
                    min={0}
                  />
                </div>

                {/* Status Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status <span className="text-red-700">*</span>
                  </label>
                  <select
                    name="vendor_product_status"
                    value={vendor.vendor_product_status}
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
                  onClick={() => navigate("/app-update/live")}
                  className={ButtonCancel}
                >
                  Cancel
                </button>
                <button type="submit" disabled={loading} className={ButtonCss}>
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

export default EditLiveList;
