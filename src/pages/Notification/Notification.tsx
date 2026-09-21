import { Pencil } from "lucide-react";
import { Tooltip } from "@mui/material";
import moment from "moment/moment";
import DataTable from "@/components/common/DataTable";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ButtonCss } from "@/components/common/ButtonCss";
import { encryptId } from "@/components/common/EncryptionDecryption";
import LoaderComponent from "@/components/common/LoaderComponent";
import Layout from "@/components/Layout";
import { Image_Url, No_Image_Url } from "@/config/BaseUrl";
import { NOTIFICATION_LIST } from "@/pages/api/UseApi";

const Notification: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [NotificationData, setNotificationData] = useState<Record<string, any>[]>([]);
  const navigate = useNavigate();

  // Fetch category data
  useEffect(() => {
    const fetchNotification = async () => {
      try {
        setLoading(true);

        const response = await NOTIFICATION_LIST();

        setNotificationData(response?.data?.data || []);
      } catch (error: any) {
        console.error(
          "Error fetching data:",
          error.response ? error.response.data : error.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchNotification();
  }, []);
  const RandomValue = Date.now();

  // Table columns
  const columns: any[] = useMemo(
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
        name: "notification_image",
        label: "Image",
        options: {
          filter: false,
          sort: false,
          customBodyRender: (value: any) => (
            <img
              src={
                value
                  ? `${Image_Url}/notification_images/${value}?t=${RandomValue}`
                  : `${No_Image_Url}`
              }
              alt="Image"
              className="w-10 h-10 object-cover rounded"
            />
          ),
        },
      },
      {
        name: "notification_create_date",
        label: "Create Date",
        options: {
          filter: true,
          sort: false,
          customBodyRender: (value: any) => {
            return moment(value).format("DD-MMM-YYYY");
          },
        },
      },
      {
        name: "notification_heading",
        label: "Heading",
        options: {
          filter: true,
          sort: false,
        },
      },
      {
        name: "notification_status",
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
                    `/notification/edit/${encodeURIComponent(encryptId(value))}`
                  );
                }}
                className="cursor-pointer"
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
        onClick={() => navigate("/notification/add")}
        className={ButtonCss}
      >
        + Add Notification
      </button>
    ),
  };

  // Data for the table
  const data = useMemo(() => NotificationData, [NotificationData]);
  return (
    <Layout>
      <div className="p-2 bg-gray-50 min-h-screen">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
          <DataTable
            title="Notification List"
            data={data}
            columns={columns}
            options={options}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Notification;
