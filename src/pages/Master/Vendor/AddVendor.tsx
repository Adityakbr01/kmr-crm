import { ArrowLeft } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  ButtonCancel,
  ButtonCss,
  ButtonRemove,
} from "@/components/common/ButtonCss";
import QuickAddModal, {
  FieldLabelWithAdd,
} from "@/components/common/QuickAddModal";
import {
  QuickAddCategoryForm,
  QuickAddSubCategoryForm,
} from "@/components/common/QuickAddForms";
import Layout from "@/components/Layout";
import {
  CREATE_VENDOR,
  FETCH_SUB_CATEGORY,
  SUB_FETCH_CATEGORY,
} from "@/pages/api/UseApi";

interface VendorForm {
  vendor_name: string;
  vendor_mobile: string;
  vendor_email: string;
  vendor_city: string;
  vendor_address: string;
  vendor_category: string;
}

interface VendorProductRow {
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

const AddVendor: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [vendor, setVendor] = useState<VendorForm>({
    vendor_name: "",
    vendor_mobile: "",
    vendor_email: "",
    vendor_city: "",
    vendor_address: "",
    vendor_category: "",
  });
  const [users, setUsers] = useState<VendorProductRow[]>([
    {
      vendor_product_category_sub: "",
      vendor_product: "",
      vendor_product_size: "",
      vendor_product_rate: "0",
    },
  ]);
  const [category, setCategory] = useState<CategoryOption[]>([]);
  const [subcategory, setSubCategory] = useState<SubCategoryOption[]>([]);
  const [traderValue, setTraderValue] = useState<string>("");
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);
  const [showCategoryModal, setShowCategoryModal] = useState<boolean>(false);
  const [subModalRow, setSubModalRow] = useState<number | null>(null);

  const traderOptions: { value: string; label: string }[] = [
    { value: "1", label: "Live" },
    { value: "2", label: "Rates" },
    { value: "3", label: "Spot Rates" },
  ];

  // Fetch categories
  const fetchCategories = useCallback(async (): Promise<void> => {
    try {
      const response: any = await SUB_FETCH_CATEGORY();
      setCategory(response?.data?.category ?? []);
    } catch (error: any) {
      toast.error("Failed to fetch categories");
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Fetch subcategories for a category name (backend resolves by name)
  const fetchSubCategories = useCallback(
    async (categoryName: string): Promise<void> => {
      if (!categoryName) {
        setSubCategory([]);
        return;
      }
      try {
        const response: any = await FETCH_SUB_CATEGORY(categoryName);
        setSubCategory(response?.data?.categorySub ?? []);
      } catch (error: any) {
        toast.error("Failed to fetch subcategories");
      }
    },
    []
  );

  useEffect(() => {
    fetchSubCategories(vendor.vendor_category);
  }, [vendor.vendor_category, fetchSubCategories]);

  // Inline "Add New" handlers: refresh the list in place and auto-select
  // the newly created entry without losing the rest of the form state.
  const handleCategoryCreated = async (categoryName: string): Promise<void> => {
    await fetchCategories();
    setVendor((prev) => ({ ...prev, vendor_category: categoryName }));
    setShowCategoryModal(false);
  };

  const handleSubCategoryCreated = async (
    subCategoryName: string
  ): Promise<void> => {
    if (subModalRow === null) return;
    await fetchSubCategories(vendor.vendor_category);
    const rowIndex = subModalRow;
    setUsers((prevUsers) =>
      prevUsers.map((user, i) =>
        i === rowIndex
          ? { ...user, vendor_product_category_sub: subCategoryName }
          : user
      )
    );
    setSubModalRow(null);
  };

  const openSubCategoryModal = (index: number): void => {
    if (!vendor.vendor_category) {
      toast.warning("Please select a category first.");
      return;
    }
    setSubModalRow(index);
  };

  // Handle input change for vendor details
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setVendor({ ...vendor, [e.target.name]: e.target.value });
  };

  // Handle input change for product details
  const handleUserChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
    index: number
  ) => {
    const updatedUsers = users.map((user, i) =>
      i === index ? { ...user, [e.target.name]: e.target.value } : user
    );
    setUsers(updatedUsers);
  };

  // Handle trader selection
  const handleTraderChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setTraderValue(e.target.value);
  };

  // Add more product fields
  const addItem = () => {
    setUsers((prevUsers) => [
      ...prevUsers,
      {
        vendor_product_category_sub: "",
        vendor_product: "",
        vendor_product_size: "",
        vendor_product_rate: "0",
      },
    ]);
  };

  // Remove product fields
  const removeUser = (index: number) => {
    setUsers((prevUsers) => prevUsers.filter((_, i) => i !== index));
  };

  // Handle form submission
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      ...vendor,
      vendor_no_of_products: users.length,
      vendor_trader: traderValue,
      vendorProduct_sub_data: users,
    };

    try {
      setIsButtonDisabled(true);
      setLoading(true);
      const response: any = await CREATE_VENDOR(data);

      if (response.data.code == 200) {
        navigate("/master/vendor");
        toast.success(response.data.msg || "Data inserted successfully");
      } else if (response.data.code == 403) {
        toast.error(response.data.msg || "Vendor Duplicate Entry.");
      } else if (response.data.code == 401) {
        toast.error(response.data.msg || "Email Duplicate Entry.");
      } else if (response.data.code == 402) {
        toast.error(response.data.msg || "Mobile Number Duplicate Entry.");
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
            Create Vendor
          </h1>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 w-full">
          <form id="addVendorForm" autoComplete="off" onSubmit={onSubmit}>
            <div className="space-y-4">
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
                <div className=" col-span-3">
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
                  <FieldLabelWithAdd
                    label="Category"
                    required
                    onAdd={() => setShowCategoryModal(true)}
                  />
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
                    {category.map((option) => (
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
                  <select
                    value={traderValue}
                    onChange={handleTraderChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all"
                    required
                  >
                    <option value="" disabled>
                      Select Trader
                    </option>
                    {traderOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Product Details */}
              {users.map((user, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6"
                >
                  <div>
                    <FieldLabelWithAdd
                      label="Sub Category"
                      required
                      onAdd={() => openSubCategoryModal(index)}
                    />
                    <select
                      name="vendor_product_category_sub"
                      value={user.vendor_product_category_sub}
                      onChange={(e) => handleUserChange(e, index)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all"
                      required
                    >
                      <option value="" disabled>
                        Select Sub Category
                      </option>
                      {subcategory.map((option) => (
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
                      value={user.vendor_product}
                      onChange={(e) => handleUserChange(e, index)}
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
                      value={user.vendor_product_size}
                      onChange={(e) => handleUserChange(e, index)}
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
                      value={user.vendor_product_rate}
                      onChange={(e) => handleUserChange(e, index)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all"
                      placeholder="Enter Rate"
                      required
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() => removeUser(index)}
                      className={ButtonRemove}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}

              {/* Add More Button */}
              <div className="flex justify-start">
                <button type="button" onClick={addItem} className={ButtonCss}>
                  Add More
                </button>
              </div>
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
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        </div>

        {/* Inline category creation with in-place list refresh */}
        {showCategoryModal && (
          <QuickAddModal
            title="Add New Category"
            onClose={() => setShowCategoryModal(false)}
          >
            <QuickAddCategoryForm
              onCreated={handleCategoryCreated}
              onClose={() => setShowCategoryModal(false)}
            />
          </QuickAddModal>
        )}

        {/* Inline sub category creation for the selected product row */}
        {subModalRow !== null && (
          <QuickAddModal
            title="Add New Sub Category"
            onClose={() => setSubModalRow(null)}
          >
            <QuickAddSubCategoryForm
              categories={category}
              initialCategoryId={String(
                category.find(
                  (option) => option.category_name === vendor.vendor_category
                )?.id ?? ""
              )}
              onCreated={handleSubCategoryCreated}
              onClose={() => setSubModalRow(null)}
            />
          </QuickAddModal>
        )}
      </div>
    </Layout>
  );
};

export default AddVendor;
