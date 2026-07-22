import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const ApproveRiders = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const { data: riders = [], isLoading } = useQuery({
    queryKey: ["pending-riders"],
    queryFn: async () => (await axiosSecure.get("/riders?status=pending")).data.data,
  });

  const decide = useMutation({
    mutationFn: ({ id, action }) => axiosSecure.patch(`/riders/${id}/${action}`),
    onSuccess: (_res, { action }) => {
      queryClient.invalidateQueries({ queryKey: ["pending-riders"] });
      Swal.fire({ icon: "success", title: action === "approve" ? "Rider approved" : "Rejected", timer: 1200, showConfirmButton: false });
    },
    onError: (err) => Swal.fire({ icon: "error", title: "Failed", text: err.response?.data?.message || err.message }),
  });

  if (isLoading) return <p className="text-gray-400">Loading…</p>;

  return (
    <div>
      <h2 className="text-2xl font-extrabold text-white">Approve riders</h2>
      {riders.length === 0 ? (
        <p className="mt-6 text-gray-400">No pending applications.</p>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {riders.map((r) => (
            <div key={r._id} className="rounded-xl bg-gray-900 border border-gray-800 p-5">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white">{r.name}</h3>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-300">pending</span>
              </div>
              <dl className="mt-3 text-sm text-gray-400 space-y-1">
                <div>{r.email}</div>
                <div>📞 {r.phone} · {r.region}</div>
                <div>🏍 {r.bikeBrand} · {r.bikeRegNumber}</div>
                <div>NID: {r.nid}</div>
              </dl>
              <div className="mt-4 flex gap-2">
                <button onClick={() => decide.mutate({ id: r._id, action: "approve" })} disabled={decide.isPending}
                  className="flex-1 px-3 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-sm font-semibold disabled:opacity-50">
                  Approve
                </button>
                <button onClick={() => decide.mutate({ id: r._id, action: "reject" })} disabled={decide.isPending}
                  className="flex-1 px-3 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-100 text-sm font-semibold disabled:opacity-50">
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApproveRiders;
