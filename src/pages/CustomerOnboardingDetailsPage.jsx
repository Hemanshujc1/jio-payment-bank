import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import onboardingService from "../services/onboardingService";
import { FaFilter, FaSortAmountDown, FaSearch } from "react-icons/fa";

const CustomerOnboardingDetailsPage = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search, Filter, Sort, Pagination state
  const [searchTerm, setSearchTerm] = useState("");
  const [stageFilter, setStageFilter] = useState("ALL");
  const [refundFilter, setRefundFilter] = useState("ALL");
  const [sortOrder, setSortOrder] = useState("NEWEST");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(30);
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchCustomerDetails = async () => {
      try {
        setLoading(true);
        const payload = {
          vkid: localStorage.getItem("vkid"),
          latitude: localStorage.getItem("latitude"),
          longitude: localStorage.getItem("longitude"),
        };
        const response = await onboardingService.getCustomerDetails(payload);
        if (response && response.status === "SUCCESS") {
          setCustomers(response.customer || []);
        } else {
          setError(response.message || "Failed to fetch customer details.");
        }
      } catch (err) {
        console.error("Error fetching customer details:", err);
        setError("An error occurred while fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerDetails();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, stageFilter, refundFilter, sortOrder, itemsPerPage]);
  const availableStages = useMemo(() => {
    const stages = new Set(customers.map((c) => c.stage).filter(Boolean));
    return ["ALL", ...Array.from(stages)];
  }, [customers]);

  const parseDateString = (dateStr) => {
    if (!dateStr) return 0;
    try {
      const parts = dateStr.split(" ");
      if (parts.length < 2) return 0;
      const [day, month, year] = parts[0].split("-");
      const [hour, min, sec] = parts[1].split(":");
      return new Date(year, month - 1, day, hour, min, sec).getTime();
    } catch (e) {
      return 0;
    }
  };

  const processedCustomers = useMemo(() => {
    // 1. Filter
    const result = customers.filter((customer) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        (customer.applicationNumber || "")
          .toLowerCase()
          .includes(searchLower) ||
        (customer.externalAppRefNumber || "")
          .toLowerCase()
          .includes(searchLower) ||
        (customer.mobileNo || "").toLowerCase().includes(searchLower);

      const matchesFilter =
        stageFilter === "ALL" || customer.stage === stageFilter;

      const matchesRefund =
        refundFilter === "ALL" ||
        (refundFilter === "TRUE" && customer.refundStatus === true) ||
        (refundFilter === "FALSE" && !customer.refundStatus);

      return matchesSearch && matchesFilter && matchesRefund;
    });

    // 2. Sort
    result.sort((a, b) => {
      const timeA = parseDateString(a.createdDateTime);
      const timeB = parseDateString(b.createdDateTime);
      if (sortOrder === "NEWEST") {
        return timeB - timeA; // Descending
      } else {
        return timeA - timeB; // Ascending
      }
    });

    return result;
  }, [customers, searchTerm, stageFilter, refundFilter, sortOrder]);

  // Pagination calculations
  const totalPages = Math.ceil(processedCustomers.length / itemsPerPage) || 1;
  const paginatedCustomers = processedCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleExportCSV = () => {
    if (processedCustomers.length === 0) return;

    const headers = [
      "Application Number",
      "External Ref Number",
      "Mobile No",
      "PAN No",
      "Refund Status",
      "Stage",
      "Date (Time)",
    ];

    const csvRows = [];
    csvRows.push(headers.join(","));

    processedCustomers.forEach((customer) => {
      const row = [
        customer.applicationNumber || "",
        customer.externalAppRefNumber || "",
        customer.mobileNo || "",
        customer.panNo || "",
        customer.refundStatus ? "Applicable" : "Not Applicable",
        customer.stage || "",
        customer.createdDateTime
          ? customer.createdDateTime.replace(" ", " (") + ")"
          : "",
      ];
      // Escape commas and quotes for CSV format correctness
      const escapedRow = row.map((val) => `"${val}"`);
      csvRows.push(escapedRow.join(","));
    });

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "Customer Details.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full h-full p-4 sm:p-6 lg:p-1">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-center items-start sm:items-center bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-brown-100">
          <div>
            <h1 className="text-2xl font-bold text-brown-900 tracking-tight">
              Customer Onboarding Details
            </h1>
          </div>
        </div>

        {/* Controls Section (Search, Filter Button, Sort Button) */}
        {!loading && !error && (
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-brown-100 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="w-full md:w-1/2 lg:w-1/3 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by Application No, Ref No, or Mobile..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full rounded-xl border-gray-300 shadow-sm focus:border-brown-500 focus:ring-brown-500 sm:text-sm py-2.5 border"
              />
            </div>

            <div className="w-full md:w-auto flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={handleExportCSV}
                disabled={processedCustomers.length === 0}
                className="flex items-center gap-2 px-5 py-2.5 bg-green-400 text-black font-medium rounded-xl shadow-sm hover:bg-green-500 focus:ring-2 focus:ring-offset-2 focus:ring-brown-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                Export CSV
              </button>

              <button
                onClick={() => setIsFilterSidebarOpen(true)}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors w-full sm:w-auto"
              >
                <FaFilter className="text-brown-500" />
                Filter
                {(stageFilter !== "ALL" || refundFilter !== "ALL") && (
                  <span className="bg-brown-600 text-white text-xs px-2 py-0.5 rounded-full ml-1">
                    {(stageFilter !== "ALL" ? 1 : 0) +
                      (refundFilter !== "ALL" ? 1 : 0)}
                  </span>
                )}
              </button>

              <div className="relative w-full sm:w-auto">
                <button
                  onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors w-full sm:w-auto"
                >
                  <FaSortAmountDown className="text-brown-500" />
                  Sort: {sortOrder === "NEWEST" ? "Newest" : "Oldest"}
                </button>

                {isSortDropdownOpen && (
                  <>
                    {/* Invisible overlay to close dropdown when clicking outside */}
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsSortDropdownOpen(false)}
                    ></div>
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 z-20 py-1">
                      <button
                        onClick={() => {
                          setSortOrder("NEWEST");
                          setIsSortDropdownOpen(false);
                        }}
                        className={`block w-full text-left px-4 py-2 text-sm transition-colors ${sortOrder === "NEWEST" ? "bg-brown-50 text-brown-900 font-medium" : "text-gray-700 hover:bg-gray-50"}`}
                      >
                        Newest First
                      </button>
                      <button
                        onClick={() => {
                          setSortOrder("OLDEST");
                          setIsSortDropdownOpen(false);
                        }}
                        className={`block w-full text-left px-4 py-2 text-sm transition-colors ${sortOrder === "OLDEST" ? "bg-brown-50 text-brown-900 font-medium" : "text-gray-700 hover:bg-gray-50"}`}
                      >
                        Oldest First
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Table Content */}
        {loading ? (
          <div className="flex flex-col justify-center items-center h-64 bg-white rounded-2xl shadow-sm border border-brown-100">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brown-600"></div>
            <p className="mt-4 text-brown-600 font-medium animate-pulse">
              Loading customer details...
            </p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-2xl shadow-sm">
            <div className="flex items-center gap-3">
              <svg
                className="h-6 w-6 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md shadow-gray-700 border border-brown-100 overflow-hidden flex flex-col">
            <div className="overflow-x-auto">
              {/* Pagination Controls */}
              {processedCustomers.length > 0 && (
                <div className="bg-brown-50 px-6 py-4 border-b border-brown-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
                    <div className="flex items-center gap-2">
                      <label
                        htmlFor="rows-per-page"
                        className="text-sm text-brown-600 font-medium whitespace-nowrap"
                      >
                        Rows per page:
                      </label>
                      <select
                        id="rows-per-page"
                        value={itemsPerPage}
                        onChange={(e) =>
                          setItemsPerPage(Number(e.target.value))
                        }
                        className="rounded-md border-gray-300 shadow-sm focus:border-brown-500 focus:ring-brown-500 sm:text-sm py-1.5 pl-2 pr-8 border bg-white"
                      >
                        <option value={10}>10</option>
                        <option value={30}>30</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                      </select>
                    </div>
                    <p className="text-sm text-brown-600 hidden md:block">
                      Showing{" "}
                      <span className="font-medium text-brown-900">
                        {(currentPage - 1) * itemsPerPage + 1}
                      </span>{" "}
                      to{" "}
                      <span className="font-medium text-brown-900">
                        {Math.min(
                          currentPage * itemsPerPage,
                          processedCustomers.length,
                        )}
                      </span>{" "}
                      of{" "}
                      <span className="font-medium text-brown-900">
                        {processedCustomers.length}
                      </span>{" "}
                      results
                    </p>
                  </div>
                  <div className="flex justify-between sm:justify-end gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}

              <table className="min-w-full divide-y divide-brown-200">
                <thead className="bg-brown-50">
                  <tr className="divide-x divide-brown-200">
                    <th
                      scope="col"
                      className="px-4 py-4 text-center text-sm font-bold text-brown-700 uppercase tracking-wider"
                    >
                      Application No
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-4 text-center text-sm font-bold text-brown-700 uppercase tracking-wider"
                    >
                      Ext Ref No
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-4 text-center text-sm font-bold text-brown-700 uppercase tracking-wider"
                    >
                      Mobile No
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-4 text-center text-sm font-semibold text-brown-700 uppercase tracking-wider"
                    >
                      PAN No
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-4 text-center text-sm font-bold text-brown-700 uppercase tracking-wider"
                    >
                      Refund Status
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-4 text-center text-sm font-bold text-brown-700 uppercase tracking-wider"
                    >
                      Stage
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-4 text-center text-sm font-bold text-brown-700 uppercase tracking-wider"
                    >
                      Date (Time)
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-brown-100">
                  {paginatedCustomers.map((customer, index) => (
                    <tr
                      key={index}
                      className="hover:bg-brown-50/50 transition-colors duration-150 divide-x divide-brown-100"
                    >
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-brown-900">
                        {customer.applicationNumber || "-"}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-brown-900">
                        {customer.externalAppRefNumber || "-"}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-brown-900">
                        {customer.mobileNo || "-"}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-brown-900">
                        {customer.panNo || "-"}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-brown-900 text-center">
                        {customer.refundStatus ? (
                          <button
                            onClick={() =>
                              navigate("/refund-flow", { state: { customer } })
                            }
                            className="px-3 py-1.5 bg-brown-700 text-white text-xs font-bold rounded shadow-sm hover:bg-brown-800 focus:ring-2 focus:ring-offset-1 focus:ring-green-500 transition-colors"
                          >
                            Refund
                          </button>
                        ) : (
                          <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800 border border-gray-200">
                            Not Applicable
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-brown-900 text-center">
                        {customer.stage || "-"}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-brown-500 text-center">
                        {customer.createdDateTime
                          ? customer.createdDateTime.replace(" ", " (") + ")"
                          : "-"}
                      </td>
                    </tr>
                  ))}
                  {paginatedCustomers.length === 0 && (
                    <tr>
                      <td
                        colSpan="7"
                        className="px-6 py-12 text-center text-brown-500"
                      >
                        <div className="flex flex-col items-center justify-center">
                          <svg
                            className="h-12 w-12 text-brown-300 mb-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1.5"
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                          <span className="font-medium text-lg text-brown-600">
                            No customers found
                          </span>
                          <span className="text-sm mt-1 text-brown-400">
                            Try adjusting your search or filter.
                          </span>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {processedCustomers.length > 0 && (
              <div className="bg-brown-50 px-6 py-4 border-t border-brown-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
                  <div className="flex items-center gap-2">
                    <label
                      htmlFor="rows-per-page"
                      className="text-sm text-brown-600 font-medium whitespace-nowrap"
                    >
                      Rows per page:
                    </label>
                    <select
                      id="rows-per-page"
                      value={itemsPerPage}
                      onChange={(e) => setItemsPerPage(Number(e.target.value))}
                      className="rounded-md border-gray-300 shadow-sm focus:border-brown-500 focus:ring-brown-500 sm:text-sm py-1.5 pl-2 pr-8 border bg-white"
                    >
                      <option value={10}>10</option>
                      <option value={30}>30</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                  </div>
                  <p className="text-sm text-brown-600 hidden md:block">
                    Showing{" "}
                    <span className="font-medium text-brown-900">
                      {(currentPage - 1) * itemsPerPage + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium text-brown-900">
                      {Math.min(
                        currentPage * itemsPerPage,
                        processedCustomers.length,
                      )}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium text-brown-900">
                      {processedCustomers.length}
                    </span>{" "}
                    results
                  </p>
                </div>
                <div className="flex justify-between sm:justify-end gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Filter Sidebar */}
      <div
        className={`fixed inset-0 z-50 bg-black/50 transition-opacity ${
          isFilterSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsFilterSidebarOpen(false)}
      >
        <div
          className={`fixed inset-y-0 right-0 w-80 bg-white shadow-2xl p-6 transition-transform transform ${
            isFilterSidebarOpen ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-brown-900">Filters</h2>
            <button
              onClick={() => setIsFilterSidebarOpen(false)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <svg
                className="w-5 h-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>

          <div className="space-y-6">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="sidebar-stage-filter"
                className="text-sm font-medium text-brown-700"
              >
                Stage:
              </label>
              <select
                id="sidebar-stage-filter"
                value={stageFilter}
                onChange={(e) => setStageFilter(e.target.value)}
                className="w-full rounded-xl border-gray-300 shadow-sm focus:border-brown-500 focus:ring-brown-500 sm:text-sm py-2.5 pl-3 pr-10 border bg-white"
              >
                {availableStages.map((stage) => (
                  <option key={stage} value={stage}>
                    {stage}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="sidebar-refund-filter"
                className="text-sm font-medium text-brown-700"
              >
                Refund Status:
              </label>
              <select
                id="sidebar-refund-filter"
                value={refundFilter}
                onChange={(e) => setRefundFilter(e.target.value)}
                className="w-full rounded-xl border-gray-300 shadow-sm focus:border-brown-500 focus:ring-brown-500 sm:text-sm py-2.5 pl-3 pr-10 border bg-white"
              >
                <option value="ALL">ALL</option>
                <option value="TRUE">Applicable</option>
                <option value="FALSE">Not Applicable</option>
              </select>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <button
                onClick={() => {
                  setStageFilter("ALL");
                  setRefundFilter("ALL");
                }}
                className="w-full py-2.5 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerOnboardingDetailsPage;
