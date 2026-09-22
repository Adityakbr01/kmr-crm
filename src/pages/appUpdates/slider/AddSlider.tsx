import { ArrowLeft } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Layout from "@/components/Layout";
import { CREATE_VENDOR_SLIDER } from "@/pages/api/UseApi";

interface SliderForm {
  slider_url: string;
  slider_images: string;
}

const AddSlider: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [slider, setSlider] = useState<SliderForm>({
    slider_url: "",
    slider_images: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);

  // Handle input change
  const onInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    setSlider({
      ...slider,
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
    formData.append("slider_url", slider.slider_url);
    if (selectedFile) {
      formData.append("slider_images", selectedFile);
    }

    const formElement = document.getElementById(
      "addSliderForm"
    ) as HTMLFormElement | null;
    const isFormValid = formElement?.checkValidity() ?? false;
    formElement?.reportValidity();

    if (isFormValid) {
      setIsButtonDisabled(true);
      setLoading(true);

      try {
        const response: any = await CREATE_VENDOR_SLIDER(formData);

        if (response.data.code == 200) {
          navigate("/app-update/slider");
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
            onClick={() => navigate("/app-update/slider")}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft />
          </button>
          <h1 className="text-2xl font-semibold text-gray-800 ml-2">
            Create Slider
          </h1>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 w-full">
          <form id="addSliderForm" autoComplete="off" onSubmit={onSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Url <span className="text-red-700">*</span>
                </label>
                <input
                  name="slider_url"
                  value={slider.slider_url}
                  onChange={onInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all"
                  placeholder="Enter Url "
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
                  name="slider_images"
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
                onClick={() => navigate("/app-update/slider")}
                className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isButtonDisabled}
                className="px-6 py-2 text-sm font-medium text-white bg-accent-500 rounded-lg hover:bg-accent-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
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

export default AddSlider;
