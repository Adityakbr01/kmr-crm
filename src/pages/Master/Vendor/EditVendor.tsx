import { ArrowLeft } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { ButtonCancel, ButtonCss } from "@/components/common/ButtonCss";
import { decryptId } from "@/components/common/EncryptionDecryption";
import { EditLoaderComponent } from "@/components/common/LoaderComponent";
import Layout from "@/components/Layout";
import {
  FETCH_SUB_CATEGORY,
  FETCH_SUB_VENDOR_BY_ID,
  SUB_FETCH_CATEGORY,
  UPDATE_VENDOR,
} from "@/pages/api/UseApi";

const statusOptions: { value: string; label: string }[] = [
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
];

const traderOptions: { value: string; label: string }[] = [
  { value: "1", label: "Live" },
  { value: "2", label: "Rates" },
  { value: "3", label: "Spot Rates" },
];

interface VendorForm {
  vendor_name: string;
  vendor_mobile: string;
  vendor_email: string;
  vendor_city: string;
  vendor_address: string;
  vendor_category: string;
  vendor_trader: string;
  vendor_no_of_products: string;
  vendor_status: string;
}

interface VendorProductRow {
  id: string;
  vendor_product_category_sub: string;
  vendor_product: string;
  vendor_product_size: string;
  vendor_product_rate: string;
}

interface CategoryOption extends Record<string, any> {
  id: number | string;
  category_name: string;
}

interface SubCategoryOption extends Record<string, any> {
  id: number | string;
  category_sub_name: string;
}

const EditVendor: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const decryptedId: string = decryptId(id ?? "");

  const [vendor, setVendor] = useState<VendorForm>({
    vendor_name: "",
    vendor_mobile: "",
    vendor_email: "",
    vendor_city: "",
    vendor_address: "",
    vendor_category: "",
    vendor_trader: "",
    vendor_no_of_products: "",
    vendor_status: "",
  });

  const [vendorProducts, setVendorProducts] = useState<VendorProductRow[]>([
    {
      id: "",
      vendor_product_category_sub: "",
      vendor_product: "",
      vendor_product_size: "",
      vendor_product_rate: "0",
    },
  ]);

  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [subcategories, setSubCategories] = useState<SubCategoryOption[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);
  const [loadingdata, setLoadingData] = useState<boolean>(false);

  // Fetch vendor data by ID
  useEffect(() => {
    const fetchVendor = async () => {
      setLoadingData(true);

      try {
        const response: any = await FETCH_SUB_VENDOR_BY_ID(decryptedId);
        setVendor(response.data.vendor);
        setVendorProducts(response.data.vendorSub);
      } catch (error: any) {
        console.error("Error fetching vendor data:", error);
        toast.error("Failed to fetch vendor data.");
      } finally {
        setLoadingData(false);
      }
    };

    fetchVendor();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [decryptedId]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response: any = await SUB_FETCH_CATEGORY();
        setCategories(response.data.category);
      } catch (error: any) {
        toast.error("Failed to fetch categories.");
      }
    };

    fetchCategories();
  }, []);

  // Fetch subcategories based on selected category
  useEffect(() => {
    const fetchSubCategories = async () => {
      if (vendor.vendor_category) {
        try {
          const response: any = await FETCH_SUB_CATEGORY(vendor.vendor_category);
          setSubCategories(response.data.categorySub);
        } catch (error: any) {
          toast.error("Failed to fetch subcategories.");
        }
      }
    };

    fetchSubCategories();
  }, [vendor.vendor_category]);

  // Handle input change for vendor details
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setVendor((prevVendor) => ({ ...prevVendor, [name]: value }));
  };

  // Handle input change for product details
  const handleProductChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
    index: number
  ) => {
    const { name, value } = e.target;
    const updatedProducts = [...vendorProducts];
    updatedProducts[index] = { ...updatedProducts[index], [name]: value };
    setVendorProducts(updatedProducts);
  };

  // Handle form submission
  const onSubmit = async (e: React.FormEvent) => {
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
        navigate("/master/vendor");
        toast.success(response.data.msg || "Data updated successfully");
      } else if (response.data.code == 403) {
        toast.error(response.data.msg || "Duplicate Entry.");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.msg || "An error occurred");
    } finally {
      setIsButtonDisabled(false);
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="p-2 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="flex items-center mb-4 p-4 bg-white shadow-sm rounded-lg">
          <button
            onClick={() => navigate("/master/vendor")}
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
              <div className="space-y-6">
                {/* Vendor Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vendor Name <span className="text-red-700">*</span>
                    </label>
                    <input
                      type="text"
                      name="vendor_name"
                      value={vendor.vendor_name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all"
                      placeholder="Enter Vendor Name"
                      required
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mobile <span className="text-red-700">*</span>
                    </label>
                    <input
                      type="text"
                      name="vendor_mobile"
                      value={vendor.vendor_mobile}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all"
                      placeholder="Enter Mobile"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email <span className="text-red-700">*</span>
                    </label>
                    <input
                      type="email"
                      name="vendor_email"
                      value={vendor.vendor_email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all"
                      placeholder="Enter Email"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address <span className="text-red-700">*</span>
                    </label>
                    <input
                      type="text"
                      name="vendor_address"
                      value={vendor.vendor_address}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all"
                      placeholder="Enter Address"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City <span className="text-red-700">*</span>
                    </label>
                    <input
                      type="text"
                      name="vendor_city"
                      value={vendor.vendor_city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all"
                      placeholder="Enter City"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category <span className="text-red-700">*</span>
                    </label>
                    <select
                      name="vendor_category"
                      value={vendor.vendor_category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all"
                      required
                    >
                      <option value="" disabled>
                        Select Category
                      </option>
                      {categories.map((option) => (
                        <option key={option.id} value={option.category_name}>
                          {option.category_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Trader <span className="text-red-700">*</span>
                    </label>
                    <input
                      type="text"
                      name="vendor_trader"
                      value={vendor.vendor_trader}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all"
                      placeholder="Enter Trader"
                      required
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status <span className="text-red-700">*</span>
                    </label>
                    <select
                      name="vendor_status"
                      value={vendor.vendor_status}
                      onChange={handleInputChange}
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

                {/* Product Details */}
                {vendorProducts.map((product, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sub Category <span className="text-red-700">*</span>
                      </label>
                      <select
                        name="vendor_product_category_sub"
                        value={product.vendor_product_category_sub}
                        onChange={(e) => handleProductChange(e, index)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all"
                        required
                      >
                        <option value="" disabled>
                          Select Sub Category
                        </option>
                        {subcategories.map((option) => (
                          <option
                            key={option.id}
                            value={option.category_sub_name}
                          >
                            {option.category_sub_name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Product Name <span className="text-red-700">*</span>
                      </label>
                      <input
                        type="text"
                        name="vendor_product"
                        value={product.vendor_product}
                        onChange={(e) => handleProductChange(e, index)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all"
                        placeholder="Enter Product Name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Size <span className="text-red-700">*</span>
                      </label>
                      <input
                        type="text"
                        name="vendor_product_size"
                        value={product.vendor_product_size}
                        onChange={(e) => handleProductChange(e, index)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all"
                        placeholder="Enter Size"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rate <span className="text-red-700">*</span>
                      </label>
                      <input
                        type="number"
                        name="vendor_product_rate"
                        value={product.vendor_product_rate}
                        onChange={(e) => handleProductChange(e, index)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all"
                        placeholder="Enter Rate"
                        required
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Buttons */}
              <div className="flex justify-end mt-8 space-x-4">
                <button
                  type="button"
                  onClick={() => navigate("/master/vendor")}
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

export default EditVendor;
