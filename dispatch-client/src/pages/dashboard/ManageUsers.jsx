import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";

const ManageUsers = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["all-users"],
    queryFn: async () => (await axiosSecure.get("/users")).data.data,
  });

  const changeRole = useMutation({
    mutationFn: ({ id, role }) =>
      axiosSecure.patch(`/users/${id}/role`, { role }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-users"] });
      Swal.fire({
        icon: "success",
        title: "Role updated",
        timer: 1200,
        showConfirmButton: false,
      });
    },
    onError: (err) =>
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: err.response?.data?.message || err.message,
      }),
  });

  const roleBadge = {
    user: "bg-gray-500/15 text-gray-300",
    rider: "bg-amber-500/15 text-amber-300",
    admin: "bg-teal-500/15 text-teal-300",
  };

  if (isLoading) return <p className="text-gray-400">Loading…</p>;

  return (
    <div>
      <h2 className="text-2xl font-extrabold text-white">Manage users</h2>
      <div className="mt-6 overflow-x-auto rounded-xl border border-gray-800">
        <table className="w-full text-sm">
          <thead className="bg-gray-900 text-gray-400 text-xs uppercase">
            <tr>
              <th className="text-left px-4 py-3">Name</th>
              <th className="text-left px-4 py-3">Email</th>
              <th className="text-left px-4 py-3">Role</th>
              <th className="text-left px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr
                key={u._id}
                className="border-t border-gray-800 hover:bg-gray-900/50"
              >
                <td className="px-4 py-3 text-gray-200">{u.name}</td>
                <td className="px-4 py-3 text-gray-400">{u.email}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${roleBadge[u.role] || ""}`}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    {u.role !== "admin" && (
                      <button
                        onClick={() =>
                          changeRole.mutate({ id: u._id, role: "admin" })
                        }
                        disabled={changeRole.isPending}
                        className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold disabled:opacity-50"
                      >
                        Make admin
                      </button>
                    )}

                    {u.role !== "user" && (
                      <button
                        onClick={() =>
                          changeRole.mutate({ id: u._id, role: "user" })
                        }
                        disabled={
                          changeRole.isPending || u.email === user?.email
                        } // ← can't demote yourself
                        title={
                          u.email === user?.email
                            ? "You can't change your own role"
                            : ""
                        }
                        className="px-3 py-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-100 text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        Make user
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;
