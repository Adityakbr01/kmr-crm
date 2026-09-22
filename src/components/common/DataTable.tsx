import React, { useMemo, useState } from "react";
import {
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  X,
} from "lucide-react";

export interface ColumnDefinition {
  name: string;
  label: string;
  options?: {
    filter?: boolean;
    sort?: boolean;
    customBodyRender?: (
      value: any,
      tableMeta: {
        rowIndex: number;
        columnIndex: number;
        rowData: any;
      }
    ) => React.ReactNode;
    display?: boolean | "true" | "false" | "excluded";
  };
}

export interface DataTableOptions {
  customToolbar?: () => React.ReactNode;
  textLabels?: {
    body?: {
      noMatch?: React.ReactNode;
    };
  };
  selectableRows?: string;
  elevation?: number;
  responsive?: string;
  viewColumns?: boolean;
  download?: boolean;
  print?: boolean;
  search?: boolean;
  rowsPerPage?: number;
  rowsPerPageOptions?: number[];
  setRowProps?: (row: any) => { className?: string };
  setTableProps?: () => { className?: string };
}

export interface DataTableProps {
  title?: string;
  data: any[];
  columns: ColumnDefinition[];
  options?: DataTableOptions;
}

const DataTable: React.FC<DataTableProps> = ({
  title,
  data = [],
  columns = [],
  options = {},
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(options.rowsPerPage || 10);

  // Filter visible columns
  const visibleColumns = useMemo(() => {
    return columns.filter(
      (col) =>
        col.options?.display !== false &&
        col.options?.display !== "false" &&
        col.options?.display !== "excluded"
    );
  }, [columns]);

  // Search filter
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data;

    const term = searchTerm.toLowerCase().trim();
    return data.filter((row) => {
      return visibleColumns.some((col) => {
        const value = row[col.name];
        if (value === null || value === undefined) return false;
        return String(value).toLowerCase().includes(term);
      });
    });
  }, [data, searchTerm, visibleColumns]);

  // Sorting
  const sortedData = useMemo(() => {
    if (!sortColumn) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];

      if (aVal === bVal) return 0;
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;

      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
      }

      const aStr = String(aVal).toLowerCase();
      const bStr = String(bVal).toLowerCase();

      if (aStr < bStr) return sortDirection === "asc" ? -1 : 1;
      if (aStr > bStr) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortColumn, sortDirection]);

  // Pagination calculation
  const totalItems = sortedData.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const validCurrentPage = Math.min(currentPage, totalPages);

  const paginatedData = useMemo(() => {
    const startIndex = (validCurrentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, validCurrentPage, pageSize]);

  // Handle Sort Toggle
  const handleSort = (columnName: string, sortable?: boolean) => {
    if (sortable === false) return;

    if (sortColumn === columnName) {
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else {
        setSortColumn(null);
        setSortDirection("asc");
      }
    } else {
      setSortColumn(columnName);
      setSortDirection("asc");
    }
  };

  const startIndex = totalItems === 0 ? 0 : (validCurrentPage - 1) * pageSize + 1;
  const endIndex = Math.min(validCurrentPage * pageSize, totalItems);

  return (
    <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden font-sans">
      {/* Table Header / Toolbar */}
      <div className="p-4 sm:p-5 border-b border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white">
        <div>
          {title && (
            <h2 className="text-xl font-semibold text-gray-900 tracking-tight">
              {title}
            </h2>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search Input */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-8 py-2 text-sm bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:bg-white transition-all placeholder-gray-400"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5 rounded"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Custom Toolbar Actions (e.g. Add Button) */}
          {options.customToolbar && <div>{options.customToolbar()}</div>}
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-700">
          <thead className="bg-gray-50/75 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider select-none">
            <tr>
              {visibleColumns.map((column) => {
                const isSortable = column.options?.sort !== false;
                const isCurrentSort = sortColumn === column.name;

                return (
                  <th
                    key={column.name}
                    scope="col"
                    onClick={() => handleSort(column.name, isSortable)}
                    className={`px-4 py-3.5 text-left ${
                      isSortable
                        ? "cursor-pointer hover:bg-gray-100/70 transition-colors"
                        : ""
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>{column.label}</span>
                      {isSortable && (
                        <span className="text-gray-400">
                          {isCurrentSort ? (
                            sortDirection === "asc" ? (
                              <ArrowUp className="w-3.5 h-3.5 text-accent-600" />
                            ) : (
                              <ArrowDown className="w-3.5 h-3.5 text-accent-600" />
                            )
                          ) : (
                            <ArrowUpDown className="w-3.5 h-3.5 hover:text-gray-600 transition-colors opacity-50" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rowIdx) => {
                const globalRowIndex =
                  (validCurrentPage - 1) * pageSize + rowIdx;
                const rowCustomProps = options.setRowProps
                  ? options.setRowProps(row)
                  : {};

                return (
                  <tr
                    key={row.id ?? globalRowIndex}
                    className={`hover:bg-gray-50/70 transition-colors ${
                      rowCustomProps.className || ""
                    }`}
                  >
                    {visibleColumns.map((column, colIdx) => {
                      const rawValue = row[column.name];
                      const renderedContent =
                        column.options?.customBodyRender
                          ? column.options.customBodyRender(rawValue, {
                              rowIndex: globalRowIndex,
                              columnIndex: colIdx,
                              rowData: row,
                            })
                          : rawValue ?? "-";

                      return (
                        <td
                          key={column.name}
                          className="px-4 py-3.5 whitespace-nowrap text-sm text-gray-700 align-middle"
                        >
                          {renderedContent}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={visibleColumns.length}
                  className="px-4 py-12 text-center text-gray-500"
                >
                  {options.textLabels?.body?.noMatch || (
                    <span className="text-sm font-medium">
                      No records found
                    </span>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="px-4 py-3.5 border-t border-gray-200 bg-gray-50/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-gray-600">
        {/* Rows Per Page */}
        <div className="flex items-center gap-2">
          <span>Rows per page:</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="border border-gray-300 rounded-md px-2 py-1 bg-white text-xs text-gray-700 focus:outline-none focus:ring-1 focus:ring-accent-500"
          >
            {[10, 25, 50, 100].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>

          <span className="ml-2 text-gray-500">
            {totalItems > 0
              ? `${startIndex}-${endIndex} of ${totalItems}`
              : "0 of 0"}
          </span>
        </div>

        {/* Pagination Navigation */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={validCurrentPage <= 1}
            onClick={() => setCurrentPage(1)}
            aria-label="First page"
            className="p-1.5 rounded-md border border-gray-200 bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:pointer-events-none transition-colors"
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            disabled={validCurrentPage <= 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            aria-label="Previous page"
            className="p-1.5 rounded-md border border-gray-200 bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:pointer-events-none transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="px-3 py-1 text-xs font-medium text-gray-700">
            Page {validCurrentPage} of {totalPages}
          </span>

          <button
            type="button"
            disabled={validCurrentPage >= totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            aria-label="Next page"
            className="p-1.5 rounded-md border border-gray-200 bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:pointer-events-none transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            type="button"
            disabled={validCurrentPage >= totalPages}
            onClick={() => setCurrentPage(totalPages)}
            aria-label="Last page"
            className="p-1.5 rounded-md border border-gray-200 bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:pointer-events-none transition-colors"
          >
            <ChevronsRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
