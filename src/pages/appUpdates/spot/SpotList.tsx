import moment from "moment";
import DataTable from "@/components/common/DataTable";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ButtonCss } from "@/components/common/ButtonCss";
import LoaderComponent from "@/components/common/LoaderComponent";
import Layout from "@/components/Layout";
import { VENDOR_SPOT_RATES_LIST } from "@/pages/api/UseApi";

type SpotRateRow = Record<string, any>;

const SpotList: React.FC = () => {
  const [spotRates, setSpotRates] = useState<SpotRateRow[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  // Fetch spot rates data
  useEffect(() => {
    const fetchSpotRates = async (): Promise<void> => {
      try {
        setLoading(true);
        const response: any = await VENDOR_SPOT_RATES_LIST();

        setSpotRates(response?.data?.vendor || []);
      } catch (error: any) {
        console.error("Error fetching spot rates data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSpotRates();
  }, []);

  // Format date and time
  const formatDateTime = (date: string, time: string): string => {
    if (!date || !time) return "";
    const dateTimeString = `${date} ${time}`;
    return moment(dateTimeString).format("DD MMM YYYY / hh:mm A");
  };

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
        name: "vendor_name",
        label: "Vendor",
        options: {
          filter: true,
          sort: true,
        },
      },
      {
        name: "vendor_spot_heading",
        label: "Heading",
        options: {
          filter: true,
          sort: false,
        },
      },
      {
        name: "vendor_spot_details",
        label: "Details",
        options: {
          filter: true,
          sort: false,
        },
      },
      {
        name: "vendor_date_time",
        label: "Date/Time",
        options: {
          filter: true,
          sort: false,
          customBodyRender: (value: any, tableMeta: any) => {
            const data = spotRates[tableMeta.rowIndex];

            const formattedDateTime = formatDateTime(
              data.vendor_spot_created_date,
              data.vendor_spot_created_time
            );
            return <div className="text-sm">{formattedDateTime}</div>;
          },
        },
      },
      {
        name: "vendor_spot_status",
        label: "Status",
        options: {
          filter: true,
          sort: false,
        },
      },
    ],
    [spotRates]
  );

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
        onClick={() => navigate("/app-update/spot/add")}
        className={ButtonCss}
      >
        + Add Vendors Spot Rates List
      </button>
    ),
  };

  // Data for the table
  const data = useMemo(() => spotRates, [spotRates]);

  return (
    <Layout>
      <div className="p-2 bg-gray-50 min-h-screen">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
          <DataTable
            title="Vendors Spot Rates List"
            data={data}
            columns={columns}
            options={options}
          />
        </div>
      </div>
    </Layout>
  );
};

export default SpotList;
