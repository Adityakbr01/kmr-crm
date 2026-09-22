import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";

import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { ButtonCancel, ButtonCss } from "@/components/common/ButtonCss";
import QuickAddModal, {
  FieldLabelWithAdd,
} from "@/components/common/QuickAddModal";
import {
  CreatedVendor,
  QuickAddVendorForm,
} from "@/components/common/QuickAddForms";
import {
  CREATE_VENDOR_SPOT_RATES,
  VENDOR_SPOT_RATES_LIST_BY_ID,
} from "@/pages/api/UseApi";

interface SpotRateForm {
  vendor_id: string;
  vendor_spot_heading: string;
  vendor_spot_details: string;
}

const AddSpotList: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [addSpotRate, setAddSpotRate] = useState<SpotRateForm>({
    vendor_id: "",
    vendor_spot_heading: "",
    vendor_spot_details: "",
  });

  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);
  const onInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ): void => {
    setAddSpotRate({
      ...addSpotRate,
      [e.target.name]: e.target.value,
    });
  };

  const [vendorsData, setVendorsData] = useState<Record<string, any>[]>([]);
  const [showVendorModal, setShowVendorModal] = useState<boolean>(false);

  const fetchVendors = useCallback(async (): Promise<
    Record<string, any>[]
  > => {
    try {
      const response: any = await VENDOR_SPOT_RATES_LIST_BY_ID();
      const list = response?.data?.vendor || [];
      setVendorsData(list);
      return list;
    } catch (error: any) {
      console.error("Error fetching vendors data:", error);
      return [];
    }
  }, []);

  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);

  // Refresh the vendor dropdown in place after an inline "Add New" save
  // and auto-select the newly created vendor without losing form state.
  const handleVendorCreated = async (created: CreatedVendor): Promise<void> => {
    const list = await fetchVendors();
    const match =
      list.find(
        (vendor) =>
          (created.id != null && String(vendor.id) === String(created.id)) ||
          (created.vendor_mobile &&
            vendor.vendor_mobile === created.vendor_mobile) ||
          vendor.vendor_name === created.vendor_name
      ) ?? list.find((vendor) => vendor.vendor_name === created.vendor_name);
    if (match) {
      setAddSpotRate((prev) => ({ ...prev, vendor_id: String(match.id) }));
    }
    setShowVendorModal(false);
  };
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("vendor_id", addSpotRate.vendor_id);
    formData.append("vendor_spot_heading", addSpotRate.vendor_spot_heading);
    formData.append("vendor_spot_details", addSpotRate.vendor_spot_details);

    const formElement = document.getElementById(
      "addSpotRateForm"
    ) as HTMLFormElement | null;

    if (!formElement || !formElement.checkValidity()) {
      formElement?.reportValidity();
      return;
    }

    try {
      setIsButtonDisabled(true);
      setLoading(true);

      const res: any = await CREATE_VENDOR_SPOT_RATES(formData);

      if (res.data.code === 200) {
        toast.success(res.data.msg || "Data inserted successfully");
        navigate("/app-update/spot");
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
            onClick={() => navigate("/app-update/spot")}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft />
          </button>
          <h1 className="text-2xl font-semibold text-gray-800 ml-2">
            Create Spot Rate
          </h1>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 w-full">
          <form id="addSpotRateForm" autoComplete="off" onSubmit={onSubmit}>
            <div className="space-y-6">
              {/* Vendor Dropdown */}
              <div>
                <FieldLabelWithAdd
                  label="Vendor"
                  required
                  onAdd={() => setShowVendorModal(true)}
                />
                <select
                  name="vendor_id"
                  value={addSpotRate.vendor_id}
                  onChange={onInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all"
                  required
                >
                  <option value="" disabled>
                    Select Vendor
                  </option>
                  {vendorsData.map((vendor) => (
                    <option key={vendor.id} value={vendor.id}>
                      {vendor.vendor_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Heading Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Heading <span className="text-red-700">*</span>
                </label>
                <input
                  type="text"
                  name="vendor_spot_heading"
                  value={addSpotRate.vendor_spot_heading}
                  onChange={onInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all"
                  placeholder="Enter Heading"
                  required
                />
              </div>

              {/* Spot Details Textarea */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Spot Details <span className="text-red-700">*</span>
                </label>
                <textarea
                  name="vendor_spot_details"
                  value={addSpotRate.vendor_spot_details}
                  onChange={onInputChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all"
                  placeholder="Enter Spot Details"
                  required
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end mt-8 space-x-4">
              <button
                type="button"
                onClick={() => navigate("/app-update/spot")}
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

        {/* Inline vendor creation: saves in place, refreshes the dropdown
            above and auto-selects the new vendor without leaving this form */}
        {showVendorModal && (
          <QuickAddModal
            title="Add New Vendor"
            wide
            onClose={() => setShowVendorModal(false)}
          >
            <QuickAddVendorForm
              defaultTrader="3"
              onCreated={handleVendorCreated}
              onClose={() => setShowVendorModal(false)}
            />
          </QuickAddModal>
        )}
      </div>
    </Layout>
  );
};

export default AddSpotList;
