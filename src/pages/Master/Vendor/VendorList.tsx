import { Tooltip } from "@mui/material";
import DataTable from "@/components/common/DataTable";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";

import { Pencil } from "lucide-react";
import { ButtonCss } from "@/components/common/ButtonCss";
import { encryptId } from "@/components/common/EncryptionDecryption";
import LoaderComponent from "@/components/common/LoaderComponent";
import { VENDOR_LIST } from "@/pages/api/UseApi";

interface VendorRow extends Record<string, any> {
  id: number | string;
  vendor_name?: string;
  vendor_mobile?: string;
  vendor_city?: string;
  vendor_category?: string;
  vendor_status?: string;
  vendor_trader?: string;
}

const VendorList: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [vendorData, setVendorData] = useState<VendorRow[]>([]);
  const navigate = useNavigate();

  // Fetch vendor data
  useEffect(() => {
    const fetchVendor = async (): Promise<void> => {
      try {
        setLoading(true);
        const response: any = await VENDOR_LIST();
        setVendorData(response?.data?.vendor || []);
      } catch (error: any) {
        console.error(
          "Error fetching data:",
          error.response ? error.response.data : error.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchVendor();
  }, []);

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
        name: "vendor_name",
        label: "Vendor Name",
        options: {
          filter: true,
          sort: false,
        },
      },
      {
        name: "vendor_mobile",
        label: "Mobile",
        options: {
          filter: true,
          sort: false,
        },
      },
      {
        name: "vendor_city",
        label: "City",
        options: {
          filter: true,
          sort: false,
        },
      },
      {
        name: "vendor_category",
        label: "Category",
        options: {
          filter: true,
          sort: false,
        },
      },
      {
        name: "vendor_trader",
        label: "Trader",
        options: {
          filter: true,
          sort: false,
          customBodyRender: (value: any) => {
            switch (value) {
              case "1":
                return "Live";
              case "2":
                return "Rates";
              case "3":
                return "Spot Rates";
              default:
                return "Unknown";
            }
          },
        },
      },
      {
        name: "vendor_status",
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
              <button
                onClick={() => {
                  navigate(
                    `/master/vendor/edit/${encodeURIComponent(
                      encryptId(value)
                    )}`
                  );
                }}
                className="text-gray-500 hover:text-accent-500 transition-colors"
              >
                <Pencil className="w-4 h-4" />
              </button>
            </Tooltip>
          ),
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    setRowProps: (_row: any) => ({
      className: "hover:bg-gray-50 transition-colors",
    }),
    setTableProps: () => ({
      className: "rounded-lg shadow-sm border border-gray-200",
    }),
    customToolbar: () => (
      <button
        onClick={() => navigate("/master/vendor/add")}
        className={ButtonCss}
      >
        + Add Vendor
      </button>
    ),
  };

  const data = useMemo(() => vendorData, [vendorData]);
  return (
    <Layout>
      <div className="p-2 bg-gray-50 min-h-screen">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
          <DataTable
            title="Vendor  List"
            data={data}
            columns={columns}
            options={options}
          />
        </div>
      </div>
    </Layout>
  );
};

export default VendorList;
