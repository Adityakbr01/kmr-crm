import { Pencil } from "lucide-react";
import { Tooltip } from "@mui/material";
import DataTable from "@/components/common/DataTable";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ButtonCss } from "@/components/common/ButtonCss";
import { encryptId } from "@/components/common/EncryptionDecryption";
import LoaderComponent from "@/components/common/LoaderComponent";
import Layout from "@/components/Layout";
import { Image_Url, No_Image_Url } from "@/config/BaseUrl";
import { CATEGORY_LIST } from "@/pages/api/UseApi";

interface CategoryRow extends Record<string, any> {
  id: number | string;
  category_name?: string;
  category_status?: string;
  categories_images?: string;
}

const CategoryList: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [categoryData, setCategoryData] = useState<CategoryRow[]>([]);
  const navigate = useNavigate();

  // Fetch category data
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true);
        const response: any = await CATEGORY_LIST();

        setCategoryData(response?.data?.category || []);
      } catch (error: any) {
        console.error(
          "Error fetching data:",
          error.response ? error.response.data : error.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
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
        name: "categories_images",
        label: "Image",
        options: {
          filter: false,
          sort: false,
          customBodyRender: (value: any) => (
            <img
              src={
                value
                  ? `${Image_Url}/categories_images/${value}`
                  : `${No_Image_Url}`
              }
              alt="Category"
              className="w-10 h-10 object-cover rounded"
            />
          ),
        },
      },
      {
        name: "category_name",
        label: "Category",
        options: {
          filter: true,
          sort: false,
        },
      },
      {
        name: "category_status",
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
                    `/master/category/edit/${encodeURIComponent(
                      encryptId(value)
                    )}`
                  );
                }}
              >
                <Pencil className="text-gray-600 hover:text-accent-500 cursor-pointer" />
              </span>
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
        onClick={() => navigate("/master/category/add")}
        className={ButtonCss}
      >
        + Add Category
      </button>
    ),
  };

  // Data for the table
  const data = useMemo(() => categoryData, [categoryData]);

  return (
    <Layout>
      <div className="p-2 bg-gray-50 min-h-screen">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
          <DataTable
            title="Category List"
            data={data}
            columns={columns}
            options={options}
          />
        </div>
      </div>
    </Layout>
  );
};

export default CategoryList;
