import { Link } from "react-router";
import useAuth from "../hooks/useAuth";

const STEPS = [
  { n: "1", title: "Book a parcel", text: "Fill in pickup, drop-off, and weight. We instantly calculate the price from distance and weight — no surprises." },
  { n: "2", title: "A rider collects it", text: "An admin assigns a nearby vetted rider who picks the parcel up from your door." },
  { n: "3", title: "Track to delivery", text: "Follow every status change live — booked, in transit, delivered — with a full timeline." },
  { n: "4", title: "Pay securely", text: "Pay online via SSLCommerz — cards, bKash, Nagad, or Rocket. Your receipt is saved to your account." },
];

const HowItWorks = () => {
  const { user } = useAuth();
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      <div className="text-center max-w-xl mx-auto">
        <span className="text-xs font-bold text-teal-300 bg-teal-500/10 px-3 py-1.5 rounded-full">How it works</span>
        <h1 className="mt-5 text-4xl font-extrabold text-white text-balance">From your door to theirs, in four steps</h1>
        <p className="mt-4 text-gray-400">Dispatch keeps parcel delivery simple and transparent end to end.</p>
      </div>

      <div className="mt-12 grid sm:grid-cols-2 gap-6">
        {STEPS.map((s) => (
          <div key={s.n} className="rounded-xl bg-gray-900 border border-gray-800 p-6">
            <span className="grid place-items-center w-10 h-10 rounded-lg bg-teal-600 text-white font-bold">{s.n}</span>
            <h3 className="mt-4 text-lg font-bold text-white">{s.title}</h3>
            <p className="mt-2 text-sm text-gray-400">{s.text}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Link to={user ? "/dashboard/book" : "/register"}
          className="inline-flex px-6 py-3 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-semibold">
          {user ? "Book a parcel" : "Get started"}
        </Link>
      </div>
    </div>
  );
};

export default HowItWorks;
