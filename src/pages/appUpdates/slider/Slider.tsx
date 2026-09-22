import { Pencil } from "lucide-react";
import { CircularProgress, Tooltip } from "@mui/material";
import DataTable from "@/components/common/DataTable";
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { VENDOR_SLIDER_LIST } from "@/pages/api/UseApi";
import { encryptId } from "@/components/common/EncryptionDecryption";
import LoaderComponent from "@/components/common/LoaderComponent";

type SliderRow = Record<string, any>;

const Slider: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [SliderData, setSliderData] = useState<SliderRow[]>([]);
  const navigate = useNavigate();

  // Fetch category data
  useEffect(() => {
    const fetchSlider = async (): Promise<void> => {
      try {
        setLoading(true);

        const response: any = await VENDOR_SLIDER_LIST();

        setSliderData(response?.data?.slider || []);
      } catch (error: any) {
        console.error(
          "Error fetching data:",
          error.response ? error.response.data : error.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSlider();
  }, []);
  const RandomValue: number = Date.now();

  // Table columns
  const columns: any = useMemo(
    () => [
      {
        name: "slNo",
        label: "SL No",
        options: {
          filter: false,
          sort: false,
          customBodyRender: (value: any, tableMeta: any) => {
            return tableMeta.rowIndex + 1;
          },
        },
      },
      {
        name: "slider_images",
        label: "Image",
        options: {
          filter: false,
          sort: false,
          customBodyRender: (value: any) => (
            <img
              src={
                value
                  ? `https://kmrlive.in/storage/app/public/slider_images/${value}?t=${RandomValue}`
                  : "https://kmrlive.in/storage/app/public/no_image.jpg"
              }
              alt="Image"
              className="w-10 h-10 object-cover rounded"
            />
          ),
        },
      },
      {
        name: "slider_url",
        label: "Url",
        options: {
          filter: true,
          sort: false,
        },
      },

      {
        name: "slider_status",
        label: "Status",
        options: {
          filter: true,
          sort: false,
        },
      },
      {
        name: "id",
        label: "Actions",
        options: {
          filter: false,
          sort: false,
          customBodyRender: (value: any) => (
            <Tooltip title="Edit" placement="top">
              <span
                onClick={() => {
                  navigate(
                    `/app-update/slider/edit/${encodeURIComponent(
                      encryptId(value)
                    )}`
                  );
                }}
              >
                <Pencil className="text-gray-600 hover:text-accent-500" />
              </span>
            </Tooltip>
          ),
        },
      },
    ],
    []
  );

  // Table options
  const options: any = {
    selectableRows: "none",
    elevation: 0,
    responsive: "standard",
    viewColumns: false,
    download: false,
    print: false,
    textLabels: {
      body: {
        noMatch: loading ? <LoaderComponent /> : "Sorry, no data available",
      },
    },
    setRowProps: (row: any) => ({
      className: "hover:bg-gray-50 transition-colors",
    }),
    setTableProps: () => ({
      className: "rounded-lg shadow-sm border border-gray-200",
    }),
    customToolbar: () => (
      <button
        onClick={() => navigate("/app-update/slider/add")}
        className="bg-accent-500 text-white px-4 py-2 rounded-lg hover:bg-accent-600 transition-colors text-sm font-medium"
      >
        + Add Slider
      </button>
    ),
  };

  // Data for the table
  const data = useMemo(() => SliderData, [SliderData]);
  return (
    <Layout>
      <div className="p-2 bg-gray-50 min-h-screen">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
          <DataTable
            title="Slider List"
            data={data}
            columns={columns}
            options={options}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Slider;
