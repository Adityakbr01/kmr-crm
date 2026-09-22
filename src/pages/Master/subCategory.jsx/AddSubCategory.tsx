import { ArrowLeft } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ButtonCancel, ButtonCss } from "@/components/common/ButtonCss";
import QuickAddModal, {
  FieldLabelWithAdd,
} from "@/components/common/QuickAddModal";
import { QuickAddCategoryForm } from "@/components/common/QuickAddForms";
import Layout from "@/components/Layout";
import { CREATE_SUB_CATEGORY, SUB_FETCH_CATEGORY } from "@/pages/api/UseApi";

interface SubCategoryForm {
  category_id: string;
  subcategory_name: string;
  categories_images: string;
}

interface CategoryOption extends Record<string, any> {
  id: number | string;
  category_name: string;
}

const AddSubCategory: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [categorydata, setCategorydata] = useState<CategoryOption[]>([]);
  const [category, setCategory] = useState<SubCategoryForm>({
    category_id: "",
    subcategory_name: "",
    categories_images: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);
  const [showCategoryModal, setShowCategoryModal] = useState<boolean>(false);

  // Fetch categories (extracted so it can be re-run in place after an
  // inline "Add New" save, without losing the rest of the form state)
  const fetchCategories = useCallback(async (): Promise<
    CategoryOption[]
  > => {
    try {
      const response: any = await SUB_FETCH_CATEGORY();
      const list = response?.data?.category || [];
      setCategorydata(list);
      return list;
    } catch (error: any) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to fetch categories.");
      return [];
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Refresh the category dropdown in place and auto-select the new entry.
  const handleCategoryCreated = async (
    categoryName: string
  ): Promise<void> => {
    const list = await fetchCategories();
    const match = list.find(
      (option) => option.category_name === categoryName
    );
    if (match) {
      setCategory((prev) => ({ ...prev, category_id: String(match.id) }));
    }
    setShowCategoryModal(false);
  };

  // Handle input change
  const onInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setCategory({
      ...category,
      [e.target.name]: e.target.value,
    });
  };

  // Handle file change
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  // Handle form submission
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("category_id", category.category_id);
    formData.append("category_sub_name", category.subcategory_name);
    if (selectedFile) {
      formData.append("categories_sub_images", selectedFile);
    }

    const formEl = document.getElementById(
      "addSubCategoryForm"
    ) as HTMLFormElement | null;
    const isFormValid = formEl?.checkValidity() ?? false;
    formEl?.reportValidity();

    if (isFormValid) {
      setIsButtonDisabled(true);
      setLoading(true);

      try {
        const response: any = await CREATE_SUB_CATEGORY(formData);

        if (response.data.code == 200) {
          navigate("/master/subcategory");
          toast.success(response.data.msg || "Data inserted successfully");
        } else {
          toast.error(response.data.msg || "Duplicate Entry");
        }
      } catch (error: any) {
        toast.error(error.response?.data?.msg || "An error occurred");
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
            onClick={() => navigate("/master/subcategory")}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft />
          </button>
          <h1 className="text-2xl font-semibold text-gray-800 ml-2">
            Create SubCategory
          </h1>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 w-full">
          <form id="addSubCategoryForm" autoComplete="off" onSubmit={onSubmit}>
            <div className="space-y-4">
              {/* Category Dropdown */}
              <div>
                <FieldLabelWithAdd
                  label="Category"
                  required
                  onAdd={() => setShowCategoryModal(true)}
                />
                <select
                  name="category_id"
                  value={category.category_id}
                  onChange={onInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all"
                  required
                >
                  <option value="">Select a category</option>
                  {categorydata.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.category_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sub Category Name Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sub Category Name <span className="text-red-700">*</span>
                </label>
                <input
                  type="text"
                  name="subcategory_name"
                  value={category.subcategory_name}
                  onChange={onInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all"
                  placeholder="Enter Sub Category Name"
                  required
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image <span className="text-red-700">*</span>
                </label>
                <input
                  type="file"
                  name="categories_images"
                  onChange={onFileChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all"
                  required
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end mt-8 space-x-4">
              <button
                type="button"
                onClick={() => navigate("/master/subcategory")}
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
      </div>
    </Layout>
  );
};

export default AddSubCategory;
