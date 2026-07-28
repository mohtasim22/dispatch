import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";

const Payments = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const { data: payments = [], isLoading } = useQuery({
    queryKey: ["payments", user?.email],
    enabled: !!user?.email,
    queryFn: async () => (await axiosSecure.get(`/payments?email=${user.email}`)).data.data,
  });

  if (isLoading) return <p className="text-gray-400">Loading…</p>;

  return (
    <div>
      <h2 className="text-2xl font-extrabold text-white">Payment history</h2>
      {payments.length === 0 ? (
        <p className="mt-6 text-gray-400">No payments yet.</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-gray-800">
          <table className="w-full text-sm">
            <thead className="bg-gray-900 text-gray-400 text-xs uppercase">
              <tr><th className="text-left px-4 py-3">Transaction</th><th className="text-left px-4 py-3">Parcel</th><th className="text-left px-4 py-3">Amount</th><th className="text-left px-4 py-3">Date</th></tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p._id} className="border-t border-gray-800">
                  <td className="px-4 py-3 font-mono text-teal-300">{p.tranId}</td>
                  <td className="px-4 py-3 text-gray-300">{p.trackingId}</td>
                  <td className="px-4 py-3 text-gray-200">৳{p.amount}</td>
                  <td className="px-4 py-3 text-gray-400">{p.paidAt ? new Date(p.paidAt).toLocaleDateString() : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Payments;
