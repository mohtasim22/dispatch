import { Link } from "react-router";
import useAuth from "../hooks/useAuth";

// Landing page — design only. Sections: hero, how-it-works, features, CTA.
const Home = () => {
  const { user } = useAuth();
  const steps = [
    { n: "1", title: "Book a parcel", text: "Enter pickup, drop-off and weight. Get an instant price." },
    { n: "2", title: "We pick it up", text: "A nearby rider collects your parcel from your door." },
    { n: "3", title: "Track to delivery", text: "Follow every step live until it's safely delivered." },
  ];

  const features = [
    { icon: <BoltIcon />, title: "Fast", text: "Same-day pickup in major cities, nationwide reach." },
    { icon: <PinIcon />, title: "Tracked", text: "Real-time status from pickup to doorstep." },
    { icon: <ShieldIcon />, title: "Reliable", text: "Vetted riders and secure, insured handling." },
  ];

  return (
    <div>
      {/* ===== Hero ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* copy */}
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-bold text-teal-300 bg-teal-500/10 px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
              Nationwide courier delivery
            </span>
            <h1 className="mt-5 text-4xl sm:text-5xl font-extrabold tracking-tight text-white text-balance">
              Send parcels across Bangladesh,{" "}
              <span className="text-teal-400">tracked every step</span>.
            </h1>
            <p className="mt-5 text-lg text-gray-400 max-w-md">
              Book a delivery in minutes, hand it to a rider, and follow it live
              until it arrives. Simple, fast, dependable.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to={user ? "/dashboard/book" : "/register"}
                className="px-6 py-3 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-semibold transition-colors"
              >
                Book a parcel
              </Link>
              <Link
                to="/track"
                className="px-6 py-3 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 font-semibold transition-colors"
              >
                Track a parcel
              </Link>
            </div>
          </div>

          {/* hero visual — a mock tracking card */}
          <div className="relative">
            <div className="rounded-2xl bg-gray-900 border border-gray-800 shadow-xl p-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-white">Parcel #A1B2</span>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-amber-500/15 text-amber-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  In transit
                </span>
              </div>
              <div className="mt-6 space-y-5">
                <TrackStep done label="Booked" sub="Dhaka · 9:04 AM" />
                <TrackStep done label="Picked up" sub="Rider on the way · 10:22 AM" />
                <TrackStep active label="In transit" sub="Heading to Chattogram" />
                <TrackStep label="Delivered" sub="Estimated 4:30 PM" last />
              </div>
            </div>
            {/* soft accent glow */}
            <div className="absolute -z-10 -top-6 -right-6 w-40 h-40 bg-teal-500/20 rounded-full blur-3xl" />
          </div>
        </div>
      </section>

      {/* ===== How it works ===== */}
      <section className="bg-gray-900 border-y border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <div className="text-center max-w-xl mx-auto">
            <h2 className="text-3xl font-extrabold text-white">How it works</h2>
            <p className="mt-3 text-gray-400">Three steps from your door to theirs.</p>
          </div>
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            {steps.map((s) => (
              <div key={s.n} className="rounded-xl border border-gray-800 bg-gray-950/40 p-6">
                <span className="grid place-items-center w-10 h-10 rounded-lg bg-teal-600 text-white font-bold">
                  {s.n}
                </span>
                <h3 className="mt-4 text-lg font-bold text-white">{s.title}</h3>
                <p className="mt-2 text-sm text-gray-400">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Features ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title} className="rounded-xl bg-gray-900 border border-gray-800 p-6">
              <span className="grid place-items-center w-11 h-11 rounded-lg bg-teal-500/10 text-teal-400">
                {f.icon}
              </span>
              <h3 className="mt-4 text-lg font-bold text-white">{f.title}</h3>
              <p className="mt-2 text-sm text-gray-400">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== CTA band ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
        <div className="rounded-2xl bg-teal-600 px-8 py-12 text-center">
          <h2 className="text-3xl font-extrabold text-white text-balance">
            Ready to send your first parcel?
          </h2>
          <p className="mt-3 text-teal-50 max-w-md mx-auto">
            Create an account and book a delivery in under two minutes.
          </p>
          <Link to={user ? "/dashboard" : "/register"} className="inline-block px-6 py-3 rounded-lg bg-white text-teal-600 font-semibold hover:bg-gray-200">
            Get started
          </Link>
        </div>
      </section>
    </div>
  );
};

/* --- little presentational helpers --- */

const TrackStep = ({ label, sub, done, active, last }) => (
  <div className="flex gap-3">
    <div className="flex flex-col items-center">
      <span
        className={`w-3.5 h-3.5 rounded-full border-2 ${
          done
            ? "bg-teal-500 border-teal-500"
            : active
            ? "bg-gray-900 border-teal-400"
            : "bg-gray-900 border-gray-600"
        }`}
      />
      {!last && <span className="w-0.5 flex-1 bg-gray-700 my-1" />}
    </div>
    <div className="pb-1">
      <p className={`text-sm font-semibold ${active ? "text-teal-300" : "text-white"}`}>
        {label}
      </p>
      <p className="text-xs text-gray-500">{sub}</p>
    </div>
  </div>
);

const BoltIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
  </svg>
);
const PinIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
const ShieldIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

export default Home;
