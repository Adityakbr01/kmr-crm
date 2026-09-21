import { ArrowLeft } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ButtonCancel, ButtonCss } from "@/components/common/ButtonCss";
import Layout from "@/components/Layout";
import { CREATE_CATEGORY } from "@/pages/api/UseApi";

interface CategoryForm {
  category_name: string;
  categories_images: string;
}

const AddCategory: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [category, setCategory] = useState<CategoryForm>({
    category_name: "",
    categories_images: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);

  const onInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setCategory({
      ...category,
      [e.target.name]: e.target.value,
    });
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formElement = document.getElementById(
      "addCategoryForm"
    ) as HTMLFormElement | null;
    if (!formElement || !formElement.checkValidity()) {
      formElement?.reportValidity();
      return;
    }

    const formData = new FormData();
    formData.append("category_name", category.category_name);
    if (selectedFile) {
      formData.append("categories_images", selectedFile);
    }

    setIsButtonDisabled(true);
    setLoading(true);

    try {
      const res: any = await CREATE_CATEGORY(formData);
      if (res.data.code === 200) {
        toast.success(res.data.msg || "Data inserted successfully");
        navigate("/master/category");
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
            onClick={() => navigate("/master/category")}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft />
          </button>
          <h1 className="text-2xl font-semibold text-gray-800 ml-2">
            Create Category
          </h1>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 w-full">
          <form id="addCategoryForm" autoComplete="off" onSubmit={onSubmit}>
            <div className="space-y-4">
              {/* Category Name Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name <span className="text-red-700">*</span>
                </label>
                <input
                  type="text"
                  name="category_name"
                  value={category.category_name}
                  onChange={onInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all"
                  placeholder="Enter Category Name"
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
                onClick={() => navigate("/master/category")}
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

export default AddCategory;
