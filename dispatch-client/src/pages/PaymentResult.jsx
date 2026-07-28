import { Link, useSearchParams } from "react-router";

const CONFIG = {
  success: { icon: "✓", color: "text-emerald-400", ring: "bg-emerald-500/15", title: "Payment successful", msg: "Your parcel is paid — we'll get it moving." },
  fail:    { icon: "✕", color: "text-rose-400",    ring: "bg-rose-500/15",    title: "Payment failed",     msg: "Something went wrong. No charge was made." },
  cancel:  { icon: "!", color: "text-amber-400",   ring: "bg-amber-500/15",   title: "Payment cancelled",  msg: "You cancelled the payment. The parcel is still unpaid." },
};

const PaymentResult = ({ type }) => {
  const c = CONFIG[type];
  const [params] = useSearchParams();
  const tran = params.get("tran");

  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center">
      <div className={`mx-auto w-16 h-16 rounded-full grid place-items-center text-3xl font-bold ${c.ring} ${c.color}`}>{c.icon}</div>
      <h1 className="mt-6 text-2xl font-extrabold text-white">{c.title}</h1>
      <p className="mt-2 text-gray-400">{c.msg}</p>
      {tran && <p className="mt-2 text-xs font-mono text-gray-500">Ref: {tran}</p>}
      <div className="mt-8 flex gap-3 justify-center">
        <Link to="/dashboard/parcels" className="px-5 py-2.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-semibold">My parcels</Link>
        <Link to="/dashboard" className="px-5 py-2.5 rounded-lg bg-gray-800 text-gray-200 font-semibold">Dashboard</Link>
      </div>
    </div>
  );
};

export default PaymentResult;
