import { CircularProgress } from "@mui/material";
import DataTable from "@/components/common/DataTable";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { WEBSITE_ENQUIRY } from "@/pages/api/UseApi";

const WebsiteEnquiry: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [WebsiteEnquiryData, setWebsiteEnquiryData] = useState<Record<string, any>[]>([]);
  const navigate = useNavigate();

  // Fetch category data
  useEffect(() => {
    const fetchWebsiteEnquiry = async () => {
      try {
        const response = await WEBSITE_ENQUIRY();

        setWebsiteEnquiryData(response?.data?.contact || []);
      } catch (error: any) {
        console.error(
          "Error fetching data:",
          error.response ? error.response.data : error.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchWebsiteEnquiry();
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
        name: "contact_name",
        label: "Name",
        options: {
          filter: true,
          sort: false,
        },
      },
      {
        name: "contact_mobile",
        label: "Mobile",
        options: {
          filter: true,
          sort: false,
        },
      },
      {
        name: "contact_email",
        label: "Email",
        options: {
          filter: true,
          sort: false,
        },
      },
      {
        name: "contact_message",
        label: "Message",
        options: {
          filter: true,
          sort: false,
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
        noMatch: loading ? (
          <CircularProgress className="text-accent-500" />
        ) : (
          "Sorry, no data available"
        ),
      },
    },
    setRowProps: (row: any) => ({
      className: "hover:bg-gray-50 transition-colors",
    }),
    setTableProps: () => ({
      className: "rounded-lg shadow-sm border border-gray-200",
    }),
  };

  // Data for the table
  const data = useMemo(() => WebsiteEnquiryData, [WebsiteEnquiryData]);
  return (
    <Layout>
      <div className="p-2 bg-gray-50 min-h-screen">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
          <DataTable
            title="Website Enquiry List"
            data={data}
            columns={columns}
            options={options}
          />
        </div>
      </div>
    </Layout>
  );
};

export default WebsiteEnquiry;
