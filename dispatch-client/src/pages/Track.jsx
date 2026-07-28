import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../hooks/useAxios";

const Track = () => {
  const axiosPublic = useAxios();
  const [id, setId] = useState("");
  const [submitted, setSubmitted] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["track", submitted],
    enabled: !!submitted,
    queryFn: async () => (await axiosPublic.get(`/parcels/track/${submitted}`)).data.data,
  });

  return (
    <div className="max-w-xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-extrabold text-white">Track a parcel</h1>
      <form onSubmit={(e) => { e.preventDefault(); setSubmitted(id.trim()); }} className="mt-6 flex gap-2">
        <input value={id} onChange={(e) => setId(e.target.value)} placeholder="e.g. DSP-0D396F"
          className="flex-1 h-11 px-3 rounded-lg bg-gray-950 border border-gray-700 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500" />
        <button className="px-5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-semibold">Track</button>
      </form>

      {isLoading && <p className="mt-6 text-gray-400">Searching…</p>}
      {isError && <p className="mt-6 text-rose-300">No parcel found with that tracking ID.</p>}
      {data && (
        <div className="mt-8 rounded-xl bg-gray-900 border border-gray-800 p-6">
          <div className="flex items-center justify-between">
            <span className="font-mono text-teal-300">{data.trackingId}</span>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-300">{data.deliveryStatus}</span>
          </div>
          <p className="mt-2 text-white font-semibold">{data.title}</p>
          <p className="text-sm text-gray-400">{data.pickup?.district} → {data.delivery?.district}</p>
          <ol className="mt-5 space-y-3">
            {data.trackingHistory?.map((t, i) => (
              <li key={i} className="flex gap-3">
                <span className="w-2.5 h-2.5 mt-1.5 rounded-full bg-teal-500 shrink-0" />
                <div>
                  <p className="text-sm text-white">{t.message}</p>
                  <p className="text-xs text-gray-500">{new Date(t.at).toLocaleString()}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
};

export default Track;
