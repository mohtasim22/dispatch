const DIVISIONS = [
  { name: "Dhaka", areas: "Mirpur · Gulshan · Uttara · Dhanmondi" },
  { name: "Chattogram", areas: "Agrabad · Nasirabad · Halishahar" },
  { name: "Sylhet", areas: "Zindabazar · Ambarkhana · Subid Bazar" },
  { name: "Khulna", areas: "Sonadanga · Khalishpur · Daulatpur" },
  { name: "Rajshahi", areas: "Boalia · Motihar · Shaheb Bazar" },
  { name: "Barishal", areas: "Band Road · Nathullabad · Rupatoli" },
  { name: "Rangpur", areas: "Jahaj Company · Modern More" },
  { name: "Mymensingh", areas: "Ganginarpar · Chorpara · Town Hall" },
];

const Coverage = () => (
  <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
    <div className="text-center max-w-xl mx-auto">
      <span className="text-xs font-bold text-teal-300 bg-teal-500/10 px-3 py-1.5 rounded-full">Coverage</span>
      <h1 className="mt-5 text-4xl font-extrabold text-white text-balance">We deliver across Bangladesh</h1>
      <p className="mt-4 text-gray-400">All eight divisions, with same-day pickup in major cities.</p>
    </div>

    <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {DIVISIONS.map((d) => (
        <div key={d.name} className="rounded-xl bg-gray-900 border border-gray-800 p-5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal-400" />
            <h3 className="font-bold text-white">{d.name}</h3>
          </div>
          <p className="mt-2 text-xs text-gray-400">{d.areas}</p>
        </div>
      ))}
    </div>

    <p className="mt-10 text-center text-sm text-gray-500">
      Don't see your area? We're expanding fast — book anyway and we'll confirm coverage.
    </p>
  </div>
);

export default Coverage;
