import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "@/components/Layout";

import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { ButtonCancel, ButtonCss } from "@/components/common/ButtonCss";
import { decryptId } from "@/components/common/EncryptionDecryption";
import {
  EditLoaderComponent,
  ImageLoaderComponent,
} from "@/components/common/LoaderComponent";
import { Image_Url, No_Image_Url } from "@/config/BaseUrl";
import { UPDATE_VENDOR_NEWS, VENDOR_NEWS_LIST_BY_ID } from "@/pages/api/UseApi";

interface NewsForm {
  news_headlines: string;
  news_content: string;
  news_image: string;
  news_status: string;
}

interface StatusOption {
  value: string;
  label: string;
}

const statusOptions: StatusOption[] = [
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
];

const EditNewsList: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const decryptedId = decryptId(id as string);

  const [news, setNews] = useState<NewsForm>({
    news_headlines: "",
    news_content: "",
    news_image: "",
    news_status: "",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [imageloading, setImageLoading] = useState<boolean>(true);
  const [loadingdata, setLoadingData] = useState<boolean>(false);

  // Fetch news data by ID
  useEffect(() => {
    const fetchNews = async (): Promise<void> => {
      setLoadingData(true);

      try {
        const response: any = await VENDOR_NEWS_LIST_BY_ID(decryptedId);
        setNews(response.data.news);
      } catch (error: any) {
        console.error("Error fetching news data:", error);
        toast.error("Failed to fetch news data.");
      } finally {
        setLoadingData(false);
      }
    };

    fetchNews();
  }, [decryptedId]);

  // Handle input change
  const onInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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
    formData.append("news_status", news.news_status);
    if (selectedFile) {
      formData.append("news_image", selectedFile);
    }

    try {
      setIsButtonDisabled(true);
      setLoading(true);
      const response: any = await UPDATE_VENDOR_NEWS(decryptedId, formData);
      if (response.data.code == 200) {
        navigate("/app-update/news");
        toast.success(response.data.msg || "Data updated successfully");
      } else {
        toast.error(response.data.msg || "Duplicate Entry");
      }
    } catch (error: any) {
      console.error("Error updating news:", error);
      toast.error("Failed to update news.");
    } finally {
      setIsButtonDisabled(false);
      setLoading(false);
    }
  };
  const RandomValue: number = Date.now();

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
            Edit News
          </h1>
        </div>
        {loadingdata ? (
          <EditLoaderComponent />
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 w-full">
            <form autoComplete="off" onSubmit={onSubmit}>
              <div className="space-y-6 lg:space-y-0 flex flex-col lg:flex-row gap-0 lg:gap-2">
                <div className="relative w-48 h-48 flex justify-center items-center">
                  {imageloading && <ImageLoaderComponent />}

                  <img
                    src={
                      news?.news_image === null || news?.news_image === ""
                        ? `${No_Image_Url}`
                        : `${Image_Url}/News/${news.news_image}?t=${RandomValue}`
                    }
                    alt="News"
                    className={`w-48 h-48 object-cover rounded-lg transition-opacity duration-300 ${
                      imageloading ? "opacity-0" : "opacity-100"
                    }`}
                    onLoad={() => setImageLoading(false)}
                  />
                </div>
                <div className="flex-1">
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
                      Image
                    </label>
                    <input
                      type="file"
                      name="news_image"
                      onChange={onFileChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all"
                      accept=".jpg, .png"
                    />
                  </div>
                  {/* Status Dropdown */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status <span className="text-red-700">*</span>
                    </label>
                    <select
                      name="news_status"
                      value={news.news_status}
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

export default EditNewsList;
