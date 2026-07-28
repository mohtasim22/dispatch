import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import useDebounce from "../../hooks/useDebounce";
import Swal from "sweetalert2";

const STATUS_STYLES = {
  pending: "bg-gray-500/15 text-gray-300",
  "in-transit": "bg-amber-500/15 text-amber-300",
  delivered: "bg-emerald-500/15 text-emerald-300",
  cancelled: "bg-rose-500/15 text-rose-300",
};

const MyParcels = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const [status, setStatus] = useState("");
  const [search, setSearch] = useState(""); // instant — drives the input
  const debouncedSearch = useDebounce(search, 400); // settles — drives the query
  const [page, setPage] = useState(1);
  const limit = 5;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["my-parcels", user?.email, status, debouncedSearch, page],
    enabled: !!user?.email,
    queryFn: async () => {
      const params = new URLSearchParams({ email: user.email, page, limit });
      if (status) params.append("status", status);
      if (debouncedSearch) params.append("search", debouncedSearch);
      const res = await axiosSecure.get(`/parcels?${params}`);
      return res.data; // { success, data, pagination }
    },
  });

  const pay = useMutation({
    mutationFn: (parcelId) => axiosSecure.post("/payments/init", { parcelId }),
    onSuccess: (res) => {
      window.location.href = res.data.url; // redirect the whole browser to SSLCommerz
    },
    onError: (err) =>
      Swal.fire({
        icon: "error",
        title: "Payment failed",
        text: err.response?.data?.message || err.message,
      }),
  });

  const parcels = data?.data ?? [];
  const pg = data?.pagination;

  return (
    <div>
      {/* header + controls */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-2xl font-extrabold text-white">My parcels</h2>
        <div className="flex items-center gap-3 flex-wrap">
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search title, tracking, district…"
            className="h-10 px-3 rounded-lg bg-gray-950 border border-gray-700 text-sm text-gray-100 placeholder-gray-500 w-full sm:w-64"
          />
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="h-10 px-3 rounded-lg bg-gray-950 border border-gray-700 text-sm text-gray-100"
          >
            <option value="">All statuses</option>
            <option value="pending">Pending</option>
            <option value="in-transit">In transit</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* states */}
      {isLoading && <p className="mt-8 text-gray-400">Loading…</p>}
      {isError && <p className="mt-8 text-rose-300">{error.message}</p>}

      {!isLoading && !isError && (
        <>
          {parcels.length === 0 ? (
            <p className="mt-8 text-gray-400">No parcels found.</p>
          ) : (
            <div className="mt-6 overflow-x-auto rounded-xl border border-gray-800">
              <table className="w-full text-sm">
                <thead className="bg-gray-900 text-gray-400 text-xs uppercase">
                  <tr>
                    <th className="text-left px-4 py-3">Tracking</th>
                    <th className="text-left px-4 py-3">Title</th>
                    <th className="text-left px-4 py-3">Route</th>
                    <th className="text-left px-4 py-3">Cost</th>
                    <th className="text-left px-4 py-3">Status</th>
                    <th className="text-left px-4 py-3">Payment</th>
                  </tr>
                </thead>
                <tbody>
                  {parcels.map((p) => (
                    <tr
                      key={p._id}
                      className="border-t border-gray-800 hover:bg-gray-900/50"
                    >
                      <td className="px-4 py-3 font-mono text-teal-300">
                        {p.trackingId}
                      </td>
                      <td className="px-4 py-3 text-gray-200">{p.title}</td>
                      <td className="px-4 py-3 text-gray-400">
                        {p.pickup?.district} → {p.delivery?.district}
                      </td>
                      <td className="px-4 py-3 text-gray-200">৳{p.cost}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${
                            STATUS_STYLES[p.deliveryStatus] || ""
                          }`}
                        >
                          {p.deliveryStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {p.paymentStatus === "paid" ? (
                          <span className="text-emerald-400 text-xs font-semibold">
                            ✓ Paid
                          </span>
                        ) : p.deliveryStatus === "cancelled" ? (
                          <span className="text-gray-600 text-xs">—</span>
                        ) : (
                          <button
                            onClick={() => pay.mutate(p._id)}
                            disabled={pay.isPending}
                            className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold disabled:opacity-50"
                          >
                            Pay ৳{p.cost}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* pagination */}
          {pg && pg.pages > 1 && (
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-gray-400">
                Page {pg.page} of {pg.pages} · {pg.total} total
              </span>
              <div className="flex gap-2">
                <button
                  disabled={!pg.hasPrev}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-3 py-1.5 rounded-lg bg-gray-800 text-gray-200 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Prev
                </button>
                <button
                  disabled={!pg.hasNext}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-3 py-1.5 rounded-lg bg-gray-800 text-gray-200 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MyParcels;
