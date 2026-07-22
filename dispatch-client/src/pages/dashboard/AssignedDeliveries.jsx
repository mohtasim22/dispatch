import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";

const AssignedDeliveries = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: parcels = [], isLoading, isError, error } = useQuery({
    queryKey: ["assigned", user?.email],
    enabled: !!user?.email,
    queryFn: async () => (await axiosSecure.get(`/parcels?rider=${user.email}`)).data.data,
  });

  const setStatus = useMutation({
    mutationFn: ({ id, status }) => axiosSecure.patch(`/parcels/${id}/status`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assigned", user?.email] });
      Swal.fire({ icon: "success", title: "Status updated", timer: 1000, showConfirmButton: false });
    },
    onError: (err) => Swal.fire({ icon: "error", title: "Failed", text: err.response?.data?.message || err.message }),
  });

  if (isLoading) return <p className="text-gray-400">Loading…</p>;
  if (isError)
    return (
      <p className="mt-6 text-rose-300">
        Couldn't load deliveries: {error.response?.data?.message || error.message}
      </p>
    );

  return (
    <div>
      <h2 className="text-2xl font-extrabold text-white">Assigned deliveries</h2>
      {parcels.length === 0 ? (
        <p className="mt-6 text-gray-400">
          No deliveries assigned to <span className="text-gray-200">{user?.email}</span> yet.
        </p>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {parcels.map((p) => (
            <div key={p._id} className="rounded-xl bg-gray-900 border border-gray-800 p-5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-teal-300">{p.trackingId}</span>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-300">{p.deliveryStatus}</span>
              </div>
              <p className="mt-2 text-white font-semibold">{p.title}</p>
              <p className="text-sm text-gray-400">{p.pickup?.district} → {p.delivery?.district}</p>
              <p className="text-sm text-gray-400 mt-1">Deliver to: {p.delivery?.contactName} · {p.delivery?.contactPhone}</p>

              <div className="mt-4 flex gap-2">
                {p.deliveryStatus === "in-transit" && (
                  <button onClick={() => setStatus.mutate({ id: p._id, status: "delivered" })} disabled={setStatus.isPending}
                    className="flex-1 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold disabled:opacity-50">
                    Mark delivered
                  </button>
                )}
                {p.deliveryStatus === "delivered" && <span className="text-emerald-400 text-sm font-semibold">✓ Delivered</span>}
                {p.deliveryStatus === "cancelled" && <span className="text-rose-400 text-sm font-semibold">Cancelled</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AssignedDeliveries;
