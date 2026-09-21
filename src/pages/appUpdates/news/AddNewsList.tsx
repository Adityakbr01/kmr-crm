import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";

import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { ButtonCancel, ButtonCss } from "@/components/common/ButtonCss";
import { CREATE_VENDOR_NEWS } from "@/pages/api/UseApi";

interface NewsForm {
  news_headlines: string;
  news_content: string;
  news_image: string;
}

const AddNewsList: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [news, setNews] = useState<NewsForm>({
    news_headlines: "",
    news_content: "",
    news_image: "",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);

  // Handle input change
  const onInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    setNews({
      ...news,
      [e.target.name]: e.target.value,
    });
  };

  // Handle file change
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  // Handle form submission
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("news_headlines", news.news_headlines);
    formData.append("news_content", news.news_content);
    if (selectedFile) {
      formData.append("news_image", selectedFile);
    }

    const formElement = document.getElementById(
      "addNewsForm"
    ) as HTMLFormElement | null;

    if (!formElement || !formElement.checkValidity()) {
      formElement?.reportValidity();
      return;
    }

    try {
      setIsButtonDisabled(true);
      setLoading(true);

      const res: any = await CREATE_VENDOR_NEWS(formData); // Corrected `formData` reference

      if (res.data.code === 200) {
        toast.success(res.data.msg || "Data inserted successfully");
        navigate("/app-update/news");
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
            onClick={() => navigate("/app-update/news")}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft />
          </button>
          <h1 className="text-2xl font-semibold text-gray-800 ml-2">
            Create News
          </h1>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 w-full">
          <form id="addNewsForm" autoComplete="off" onSubmit={onSubmit}>
            <div className="space-y-6">
              {/* Headlines Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Headlines <span className="text-red-700">*</span>
                </label>
                <input
                  type="text"
                  name="news_headlines"
                  value={news.news_headlines}
                  onChange={onInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all"
                  placeholder="Enter Headlines"
                  required
                />
              </div>

              {/* News Content Textarea */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  News Content <span className="text-red-700">*</span>
                </label>
                <textarea
                  name="news_content"
                  value={news.news_content}
                  onChange={onInputChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all"
                  placeholder="Enter News Content"
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
                  name="news_image"
                  onChange={onFileChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all"
                  accept=".jpg, .png"
                  required
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end mt-8 space-x-4">
              <button
                type="button"
                onClick={() => navigate("/app-update/news")}
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

export default AddNewsList;
