import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";

const DISTRICTS = ["Dhaka", "Chattogram", "Sylhet", "Khulna", "Rajshahi", "Barishal", "Rangpur", "Mymensingh"];

const BecomeRider = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const navigate = useNavigate();

  const apply = useMutation({
    mutationFn: (payload) => axiosSecure.post("/riders", payload),
    onSuccess: async () => {
      await Swal.fire({ icon: "success", title: "Application submitted!", text: "An admin will review it soon." });
      navigate("/dashboard");
    },
    onError: (err) =>
      Swal.fire({ icon: "error", title: "Failed", text: err.response?.data?.message || err.message }),
  });

  const handleApply = (e) => {
    e.preventDefault();
    const f = e.target;
    apply.mutate({
      name: user.displayName || f.name.value,
      email: user.email,                 // ← from the logged-in user, not typed
      phone: f.phone.value,
      region: f.region.value,
      coverageDistrict: f.coverageDistrict.value,
      nid: f.nid.value,
      bikeBrand: f.bikeBrand.value,
      bikeRegNumber: f.bikeRegNumber.value,
    });
  };

  const input = "h-11 px-3 rounded-lg bg-gray-950 border border-gray-700 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 w-full";
  const label = "text-sm font-semibold text-gray-300";

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-extrabold text-white">Become a rider</h2>
      <p className="mt-1 text-sm text-gray-400">Deliver parcels and earn. Apply below.</p>

      <form onSubmit={handleApply} className="mt-6 grid sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label className={label}>Name</label>
          <input name="name" className={input} defaultValue={user?.displayName || ""} required />
        </div>
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label className={label}>Email</label>
          <input className={`${input} opacity-60`} value={user?.email || ""} readOnly />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={label}>Phone</label>
          <input name="phone" className={input} placeholder="017…" required />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={label}>Region</label>
          <select name="region" className={input} defaultValue="Dhaka">
            {DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={label}>Coverage district</label>
          <select name="coverageDistrict" className={input} defaultValue="Dhaka">
            {DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={label}>NID</label>
          <input name="nid" className={input} required />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={label}>Bike brand</label>
          <input name="bikeBrand" className={input} placeholder="Yamaha" required />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={label}>Bike reg. number</label>
          <input name="bikeRegNumber" className={input} placeholder="DHA-12-3456" required />
        </div>
        <button type="submit" disabled={apply.isPending}
          className="sm:col-span-2 h-12 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-semibold disabled:opacity-50">
          {apply.isPending ? "Submitting…" : "Submit application"}
        </button>
      </form>
    </div>
  );
};

export default BecomeRider;
