import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const AllParcels = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [picked, setPicked] = useState({});   // { parcelId: riderEmail }

  const { data: parcels = [], isLoading } = useQuery({
    queryKey: ["all-parcels"],
    queryFn: async () => (await axiosSecure.get("/parcels?limit=50")).data.data,
  });

  // approved riders for the dropdown
  const { data: riders = [] } = useQuery({
    queryKey: ["approved-riders"],
    queryFn: async () => (await axiosSecure.get("/riders?status=approved")).data.data,
  });

  const assign = useMutation({
    mutationFn: ({ id, riderEmail }) => axiosSecure.patch(`/parcels/${id}/assign`, { riderEmail }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-parcels"] });
      Swal.fire({ icon: "success", title: "Rider assigned", timer: 1200, showConfirmButton: false });
    },
    onError: (err) => Swal.fire({ icon: "error", title: "Failed", text: err.response?.data?.message || err.message }),
  });

  if (isLoading) return <p className="text-gray-400">Loading…</p>;

  return (
    <div>
      <h2 className="text-2xl font-extrabold text-white">All parcels</h2>
      <div className="mt-6 overflow-x-auto rounded-xl border border-gray-800">
        <table className="w-full text-sm">
          <thead className="bg-gray-900 text-gray-400 text-xs uppercase">
            <tr>
              <th className="text-left px-4 py-3">Tracking</th>
              <th className="text-left px-4 py-3">Route</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-left px-4 py-3">Rider</th>
              <th className="text-left px-4 py-3">Assign</th>
            </tr>
          </thead>
          <tbody>
            {parcels.map((p) => (
              <tr key={p._id} className="border-t border-gray-800">
                <td className="px-4 py-3 font-mono text-teal-300">{p.trackingId}</td>
                <td className="px-4 py-3 text-gray-400">{p.pickup?.district} → {p.delivery?.district}</td>
                <td className="px-4 py-3 text-gray-300">{p.deliveryStatus}</td>
                <td className="px-4 py-3 text-gray-400">{p.assignedRider || "—"}</td>
                <td className="px-4 py-3">
                  {p.assignedRider ? (
                    <span className="text-gray-600">assigned</span>
                  ) : (
                    <div className="flex gap-2">
                      <select
                        value={picked[p._id] || ""}
                        onChange={(e) => setPicked((s) => ({ ...s, [p._id]: e.target.value }))}
                        className="h-8 px-2 rounded bg-gray-950 border border-gray-700 text-xs text-gray-100"
                      >
                        <option value="">Pick rider…</option>
                        {riders.map((r) => <option key={r._id} value={r.email}>{r.name} ({r.region})</option>)}
                      </select>
                      <button
                        disabled={!picked[p._id] || assign.isPending}
                        onClick={() => assign.mutate({ id: p._id, riderEmail: picked[p._id] })}
                        className="px-3 py-1.5 rounded bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold disabled:opacity-40"
                      >
                        Assign
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllParcels;
