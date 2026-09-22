import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "@/components/Layout";

import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { decryptId } from "@/components/common/EncryptionDecryption";
import { EditLoaderComponent } from "@/components/common/LoaderComponent";
import { FETCH_SUB_VENDOR_BY_ID, UPDATE_VENDOR } from "@/pages/api/UseApi";

interface VendorForm {
  vendor_name: string;
  vendor_mobile: string;
  vendor_email: string;
  vendor_city: string;
  vendor_address: string;
  vendor_category: string;
  vendor_trader: string;
  vendor_status: string;
}

interface VendorProduct extends Record<string, any> {
  vendor_product_category_sub: string;
  vendor_product: string;
  vendor_product_size: string;
  vendor_product_rate: string;
}

interface StatusOption {
  value: string;
  label: string;
}

const statusOptions: StatusOption[] = [
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
];

const EditRatesList: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const decryptedId = decryptId(id as string);

  const [vendor, setVendor] = useState<VendorForm>({
    vendor_name: "",
    vendor_mobile: "",
    vendor_email: "",
    vendor_city: "",
    vendor_address: "",
    vendor_category: "",
    vendor_trader: "",
    vendor_status: "",
  });

  const [vendorProducts, setVendorProducts] = useState<VendorProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);
  const [loadingdata, setLoadingData] = useState<boolean>(false);

  // Fetch vendor data
  useEffect(() => {
    setLoadingData(true);
    const fetchVendor = async (): Promise<void> => {
      try {
        const response: any = await FETCH_SUB_VENDOR_BY_ID(decryptedId);
        setVendor(response.data.vendor);
        setVendorProducts(response.data.vendorSub);
      } catch (error: any) {
        toast.error("Failed to fetch vendor data.");
      } finally {
        setLoadingData(false);
      }
    };
    fetchVendor();
  }, [decryptedId]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const { name, value } = e.target;
    setVendor((prev) => ({ ...prev, [name]: value }));
  };

  const handleRateChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ): void => {
    const updatedProducts = [...vendorProducts];
    updatedProducts[index].vendor_product_rate = e.target.value;
    setVendorProducts(updatedProducts);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const data = {
      ...vendor,
      vendorProduct_sub_data: vendorProducts,
    };

    try {
      setIsButtonDisabled(true);
      setLoading(true);
      const response: any = await UPDATE_VENDOR(decryptedId, data);

      if (response.data.code == 200) {
        navigate("/app-update/rates");
        toast.success("Data updated successfully");
      } else {
        toast.error(response.data.msg || "Update failed");
      }
    } catch (error: any) {
      toast.error("An error occurred while updating");
    } finally {
      setIsButtonDisabled(false);
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="">
          {/* Header */}
          <div className="bg-white rounded-xl shadow-sm mb-4    ">
            <div className="p-2 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate("/app-update/rates")}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-6 h-6 text-gray-600" />
                </button>
                <h1 className="text-xl font-bold text-gray-900">
                  Edit Vendor Rates
                </h1>
              </div>
            </div>
          </div>
          {loadingdata ? (
            <EditLoaderComponent />
          ) : (
            <div className="bg-white rounded-xl shadow-sm">
              <form onSubmit={onSubmit} className="p-8">
                {/* Vendor Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                  {/* Personal Info Card */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Personal Information
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          Vendor Name
                        </label>
                        <p className="mt-1 text-gray-900 font-medium">
                          {vendor.vendor_name}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          Mobile
                        </label>
                        <p className="mt-1 text-gray-900">
                          {vendor.vendor_mobile}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          Email
                        </label>
                        <p className="mt-1 text-gray-900 overflow-x-auto">
                          {vendor.vendor_email}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Location Info Card */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Location Details
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          City
                        </label>
                        <p className="mt-1 text-gray-900">
                          {vendor.vendor_city}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          Address
                        </label>
                        <p className="mt-1 text-gray-900">
                          {vendor.vendor_address}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Business Info Card */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Business Information
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          Category
                        </label>
                        <p className="mt-1 text-gray-900">
                          {vendor.vendor_category}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          Trader
                        </label>
                        <p className="mt-1 text-gray-900">
                          {vendor.vendor_trader}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600">
                          Status <span className="text-red-700">*</span>
                        </label>
                        <select
                          name="vendor_status"
                          value={vendor.vendor_status}
                          onChange={handleInputChange}
                          className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
                  </div>
                </div>

                {/* Products Table */}
                <div className="mt-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">
                    Vendor Products
                  </h2>
                  <div className="overflow-x-auto rounded-xl border border-gray-200">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 w-1/4">
                            Sub Category
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 w-1/4">
                            Product Name
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 w-1/4">
                            Size
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 w-1/4">
                            Rate <span className="text-red-700">*</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {vendorProducts.map((product, index) => (
                          <tr
                            key={index}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-6 py-4 text-sm text-gray-900">
                              {product.vendor_product_category_sub}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                              {product.vendor_product}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              {product.vendor_product_size}
                            </td>
                            <td className="px-6 py-4">
                              <input
                                type="number"
                                value={product.vendor_product_rate}
                                onChange={(e) => handleRateChange(e, index)}
                                className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                required
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end mt-8 space-x-4">
                  <button
                    type="button"
                    onClick={() => navigate("/app-update/rates")}
                    className="px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isButtonDisabled}
                    className="px-6 py-3 text-sm font-medium text-white bg-accent-600 rounded-lg hover:bg-accent-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? "Updating..." : "Update"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default EditRatesList;
