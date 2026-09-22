import { Tooltip } from "@mui/material";
import DataTable from "@/components/common/DataTable";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";

import { Pencil } from "lucide-react";
import { ButtonCss } from "@/components/common/ButtonCss";
import { encryptId } from "@/components/common/EncryptionDecryption";
import LoaderComponent from "@/components/common/LoaderComponent";
import { VENDOR_USER_LIST } from "@/pages/api/UseApi";

interface VendorUserRow extends Record<string, any> {
  id: number | string;
  name?: string;
  mobile?: string;
  email?: string;
  status?: string;
}

const VendorUserList: React.FC = () => {
  const [vendorUserData, setVendorUserData] = useState<VendorUserRow[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVendorUser = async () => {
      try {
        setLoading(true);
        const response: any = await VENDOR_USER_LIST();

        setVendorUserData(response?.data?.adminUser || []);
      } catch (error: any) {
        console.error("Error fetching vendor user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVendorUser();
  }, []);

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
        name: "name",
        label: "Full Name",
        options: {
          filter: true,
          sort: true,
        },
      },
      {
        name: "mobile",
        label: "Mobile",
        options: {
          filter: true,
          sort: false,
        },
      },
      {
        name: "email",
        label: "Email",
        options: {
          filter: true,
          sort: false,
        },
      },

      {
        name: "status",
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
                // onClick={() => navigate(`/master/vendor-user/edit/${value}`)}
                onClick={() => {
                  navigate(
                    `/master/vendor-user/edit/${encodeURIComponent(
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
        onClick={() => navigate("/master/vendor-user/add")}
        className={ButtonCss}
      >
        + Add Vendor User
      </button>
    ),
  };

  const data = useMemo(() => vendorUserData, [vendorUserData]);
  return (
    <Layout>
      <div className="p-2 bg-gray-50 min-h-screen">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
          <DataTable
            title="Vendor User List"
            data={data}
            columns={columns}
            options={options}
          />
        </div>
      </div>
    </Layout>
  );
};

export default VendorUserList;
