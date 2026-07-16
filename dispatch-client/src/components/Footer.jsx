import { Link } from "react-router";
import Logo from "./Logo";

// Site footer — 4 columns, shown on all public pages via RootLayout.
const Footer = () => {
  const columns = [
    {
      title: "Product",
      links: ["Book a parcel", "Track", "Coverage", "Pricing"],
    },
    {
      title: "Company",
      links: ["About", "Careers", "Become a rider"],
    },
    {
      title: "Support",
      links: ["Help center", "Contact", "Terms", "Privacy"],
    },
  ];

  return (
    <footer className="bg-gray-900 border-t border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* about */}
          <div className="col-span-2 md:col-span-1">
            <Logo />
            <p className="mt-4 text-sm text-gray-400 max-w-xs">
              Fast, tracked parcel delivery across Bangladesh. Book in minutes,
              follow every step.
            </p>
            <div className="flex gap-2 mt-4">
              {["f", "in", "X"].map((s) => (
                <span
                  key={s}
                  className="grid place-items-center w-8 h-8 rounded-lg bg-gray-800 text-gray-400 text-xs font-bold hover:bg-teal-500/15 hover:text-teal-300 cursor-pointer transition-colors"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* link columns */}
          {columns.map((col) => (
            <div key={col.title}>
              <h5 className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-3">
                {col.title}
              </h5>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link}>
                    <Link
                      to="#"
                      className="text-sm text-gray-400 hover:text-teal-300 transition-colors"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* bottom bar */}
        <div className="mt-10 pt-6 border-t border-gray-800 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-500">
          <span>© 2026 Dispatch. All rights reserved.</span>
          <span>Made in Bangladesh 🇧🇩</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
