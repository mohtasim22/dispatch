import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const DISTRICTS = ["Dhaka", "Chattogram", "Sylhet", "Khulna", "Rajshahi", "Barishal", "Rangpur", "Mymensingh"];

const BookParcel = () => {
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const handleBook = async (e) => {
    e.preventDefault();
    const f = e.target;

    const payload = {
      title: f.title.value,
      parcelType: f.parcelType.value,
      weight: Number(f.weight.value),
      pickup: {
        contactName: f.pickupName.value,
        contactPhone: f.pickupPhone.value,
        district: f.pickupDistrict.value,
        area: f.pickupArea.value,
        address: f.pickupAddress.value,
      },
      delivery: {
        contactName: f.deliveryName.value,
        contactPhone: f.deliveryPhone.value,
        district: f.deliveryDistrict.value,
        area: f.deliveryArea.value,
        address: f.deliveryAddress.value,
      },
      // NOTE: no bookedBy, no cost — the server derives both
    };

    try {
      const res = await axiosSecure.post("/parcels", payload);
      await Swal.fire({
        icon: "success",
        title: "Parcel booked!",
        html: `Tracking ID: <b>${res.data.trackingId}</b><br/>Cost: <b>৳${res.data.cost}</b>`,
      });
      navigate("/dashboard/parcels");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Booking failed",
        text: error.response?.data?.message || error.message,
      });
    }
  };

  const input = "h-11 px-3 rounded-lg bg-gray-950 border border-gray-700 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 w-full";
  const label = "text-sm font-semibold text-gray-300";

  return (
    <div className="max-w-3xl">
      <h2 className="text-2xl font-extrabold text-white">Book a parcel</h2>
      <p className="mt-1 text-sm text-gray-400">We'll calculate the price from weight and distance.</p>

      <form onSubmit={handleBook} className="mt-6 flex flex-col gap-6">
        {/* parcel info */}
        <section className="rounded-xl bg-gray-900 border border-gray-800 p-5 flex flex-col gap-4">
          <h3 className="font-bold text-white">Parcel</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label className={label}>Title</label>
              <input name="title" className={input} placeholder="Passport documents" required />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={label}>Type</label>
              <select name="parcelType" className={input} defaultValue="box">
                <option value="document">Document</option>
                <option value="box">Box</option>
              </select>
            </div>
          </div>
          <div className="flex flex-col gap-1.5 max-w-40">
            <label className={label}>Weight (kg)</label>
            <input name="weight" type="number" step="0.1" min="0.1" className={input} defaultValue="1" required />
          </div>
        </section>

        {/* pickup + delivery side by side */}
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { key: "pickup", title: "Pickup from" },
            { key: "delivery", title: "Deliver to" },
          ].map(({ key, title }) => (
            <section key={key} className="rounded-xl bg-gray-900 border border-gray-800 p-5 flex flex-col gap-4">
              <h3 className="font-bold text-white">{title}</h3>
              <div className="flex flex-col gap-1.5">
                <label className={label}>Contact name</label>
                <input name={`${key}Name`} className={input} required />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={label}>Phone</label>
                <input name={`${key}Phone`} className={input} placeholder="017…" required />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={label}>District</label>
                <select name={`${key}District`} className={input} defaultValue="Dhaka">
                  {DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={label}>Area</label>
                <input name={`${key}Area`} className={input} placeholder="Mirpur 10" required />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={label}>Address</label>
                <input name={`${key}Address`} className={input} placeholder="House 12, Road 3" required />
              </div>
            </section>
          ))}
        </div>

        <button type="submit" className="h-12 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-semibold transition-colors">
          Book parcel
        </button>
      </form>
    </div>
  );
};

export default BookParcel;
