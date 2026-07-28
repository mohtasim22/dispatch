import useAuth from "../../hooks/useAuth";
import useRole from "../../hooks/useRole";

const Profile = () => {
  const { user } = useAuth();
  const { role } = useRole();

  return (
    <div className="max-w-lg">
      <h2 className="text-2xl font-extrabold text-white">Profile</h2>
      <div className="mt-6 rounded-xl bg-gray-900 border border-gray-800 p-6 flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-teal-500/15 text-teal-300 grid place-items-center text-2xl font-bold overflow-hidden">
          {user?.photoURL ? <img src={user.photoURL} alt="" className="w-full h-full object-cover" /> : (user?.displayName?.[0]?.toUpperCase() ?? "U")}
        </div>
        <div>
          <p className="text-lg font-bold text-white">{user?.displayName || "—"}</p>
          <p className="text-sm text-gray-400">{user?.email}</p>
          <span className="inline-block mt-1 text-xs font-bold px-2.5 py-1 rounded-full bg-teal-500/15 text-teal-300">{role || "user"}</span>
        </div>
      </div>
    </div>
  );
};

export default Profile;
