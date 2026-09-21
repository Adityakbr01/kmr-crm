import React, { useEffect, useState } from "react";
import Layout from "@/components/Layout";

import { ChevronDown, Minus, RefreshCw, X } from "lucide-react";
import {
  Collapse,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import moment from "moment";
import CountUp from "@/components/common/CountUp";
import LoaderComponent from "@/components/common/LoaderComponent";
import { FETCH_DASHBOARD_DATA } from "@/pages/api/UseApi";
import { Finacal_Year } from "@/config/BaseUrl";

interface DashboardResults {
  totalTrialUser_count?: number;
  totalLiveUser_count?: number;
  totalActiveUser_count?: number;
  [key: string]: unknown;
}

interface RecentOrder {
  id?: string | number;
  name?: string;
  mobile?: string;
  email?: string;
  validity_date?: string;
  status?: string;
  [key: string]: unknown;
}

const Dashboard: React.FC = () => {
  const [results, setResults] = useState<DashboardResults>({});
  const [recentOrders, setRecentOrders] = useState<RecentOrder[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [isClosed, setIsClosed] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);

  // Fetch dashboard data
  const fetchData = async () => {
    try {
      const response = await FETCH_DASHBOARD_DATA(Finacal_Year);
      const data = response?.data ?? {};
      setResults(data);
      setRecentOrders(Array.isArray(data.validity_user) ? data.validity_user : []);
      setLoading(false);
    } catch (error: any) {
      console.error("Error fetching dashboard data:", error);
      setRecentOrders([]);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [Finacal_Year]);

  // Handle table pagination
  const handleChangePage = (_event: any, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle table actions
  const handleReload = async () => {
    setLoading(true);
    try {
      const response = await FETCH_DASHBOARD_DATA(Finacal_Year);
      const data = response?.data ?? {};
      setResults(data);
      setRecentOrders(Array.isArray(data.validity_user) ? data.validity_user : []);
      setLoading(false);
    } catch (error: any) {
      console.error("Error fetching dashboard data:", error);
      setRecentOrders([]);
      setLoading(false);
    }
  };
  const displayedOrders = recentOrders
    ? recentOrders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    : [];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome to your dashboard</p>
        </div>

        {/* Cards Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Trial Users Card */}
          <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
            <p className="text-sm font-medium text-gray-500">
              Total Trial Users
            </p>
            <p className="text-3xl font-bold text-green-500 mt-2">
              <CountUp
                start={0}
                end={Number(results?.totalTrialUser_count) || 0}
                duration={2.5}
                useEasing={true}
              />
            </p>
          </div>

          {/* Total Live Users Card */}
          <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
            <p className="text-sm font-medium text-gray-500">
              Total Live Users
            </p>
            <p className="text-3xl font-bold text-blue-500 mt-2">
              <CountUp
                start={0}
                end={Number(results?.totalLiveUser_count) || 0}
                duration={2.5}
                useEasing={true}
              />
            </p>
          </div>

          {/* Active Users Card */}
          <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
            <p className="text-sm font-medium text-gray-500">Active Users</p>
            <p className="text-3xl font-bold text-yellow-500 mt-2">
              <CountUp
                start={0}
                end={Number(results?.totalActiveUser_count) || 0}
                duration={2.5}
                useEasing={true}
              />
            </p>
          </div>
        </div>

        {/* Table Section */}
        {!isClosed && (
          <Paper className="rounded-lg shadow-sm overflow-hidden">
            <div className="bg-white p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">
                Renewal Dues
              </h2>
              <div className="flex items-center space-x-2">
                <IconButton
                  size="small"
                  onClick={() => setIsMinimized(!isMinimized)}
                >
                  {isMinimized ? <ChevronDown className="w-4 h-4 text-gray-600" /> : <Minus className="w-4 h-4 text-gray-600" />}
                </IconButton>
                <IconButton size="small" onClick={handleReload}>
                  <RefreshCw className="w-4 h-4 text-gray-600" />
                </IconButton>
                <IconButton size="small" onClick={() => setIsClosed(true)}>
                  <X className="w-4 h-4 text-gray-600" />
                </IconButton>
              </div>
            </div>

            <Collapse in={!isMinimized}>
              {loading ? (
                <div className="flex justify-center">
                  <LoaderComponent />{" "}
                </div>
              ) : (
                <>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow className="bg-gray-50">
                          <TableCell className="font-semibold text-gray-700">
                            ID
                          </TableCell>
                          <TableCell className="font-semibold text-gray-700">
                            Full Name
                          </TableCell>
                          <TableCell className="font-semibold text-gray-700">
                            Mobile
                          </TableCell>
                          <TableCell className="font-semibold text-gray-700">
                            Email
                          </TableCell>
                          <TableCell className="font-semibold text-gray-700">
                            Validity
                          </TableCell>
                          <TableCell className="font-semibold text-gray-700">
                            Status
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {displayedOrders && displayedOrders.length > 0 ? (
                          displayedOrders.map((order: RecentOrder, key: number) => (
                            <TableRow key={key} className="hover:bg-gray-50">
                              <TableCell>{order.id}</TableCell>
                              <TableCell>{order.name}</TableCell>
                              <TableCell>{order.mobile}</TableCell>
                              <TableCell>{order.email}</TableCell>
                              <TableCell>
                                {moment(order.validity_date).format(
                                  "DD-MM-YYYY"
                                )}
                              </TableCell>
                              <TableCell>{order.status}</TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={6} align="center">
                              No recent orders available.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <TablePagination
                    component="div"
                    count={recentOrders ? recentOrders.length : 0}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    rowsPerPageOptions={[5, 10, 25]}
                    labelRowsPerPage="Rows per page"
                    className="border-t border-gray-200"
                  />
                </>
              )}
            </Collapse>
          </Paper>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
