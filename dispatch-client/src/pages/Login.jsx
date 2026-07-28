import { Link, useLocation, useNavigate } from "react-router";
import useAuth from "../hooks/useAuth";
import Swal from "sweetalert2";
import useAxios from "../hooks/useAxios";

const Login = () => {
  const { signIn, googleSignIn} = useAuth();
  const axiosPublic = useAxios();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  const handleLogin = async (e) => {
    e.preventDefault();
    const form = e.target;
    try {
      await signIn(form.email.value, form.password.value);
      Swal.fire({ icon: "success", title: "Logged in!", timer: 1500, showConfirmButton: false });
      navigate(from, { replace: true });
    } catch (error) {
      Swal.fire({ icon: "error", title: "Login failed", text: error.message });
    }
  };

  const handleGoogle = async () => {
  try {
    const result = await googleSignIn();
    const u = result.user;
    // save to YOUR db — idempotent, so safe on every Google login
    await axiosPublic.post("/users", { name: u.displayName, email: u.email, photoURL: u.photoURL });
    Swal.fire({ icon: "success", title: "Logged in!", timer: 1200, showConfirmButton: false });
    navigate(from, { replace: true });
  } catch (error) {
    Swal.fire({ icon: "error", title: "Google sign-in failed", text: error.message });
  }
};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 flex justify-center">
      <div className="w-full max-w-sm bg-gray-900 border border-gray-800 rounded-2xl shadow-sm p-8">
        <h2 className="text-2xl font-extrabold text-white">Welcome back</h2>
        <p className="mt-1 text-sm text-gray-400">Log in to manage your parcels.</p>

        <form onSubmit={handleLogin} className="mt-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-300">Email</label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              className="h-11 px-3 rounded-lg bg-gray-950 border border-gray-700 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-gray-300">Password</label>
              <Link to="#" className="text-xs text-teal-400 font-semibold hover:underline">
                Forgot?
              </Link>
            </div>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              className="h-11 px-3 rounded-lg bg-gray-950 border border-gray-700 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            />
          </div>

          <button
            type="submit"
            className="mt-1 h-11 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-semibold transition-colors"
          >
            Login
          </button>
        </form>

        {/* divider */}
        <div className="my-5 flex items-center gap-3 text-xs text-gray-500">
          <span className="h-px flex-1 bg-gray-800" />
          or
          <span className="h-px flex-1 bg-gray-800" />
        </div>

        {/* social (design only) */}
        <button
          type="button"
          onClick={handleGoogle}
          className="w-full h-11 flex items-center justify-center gap-2.5 rounded-lg border border-gray-700 text-sm font-semibold text-gray-200 hover:bg-gray-800 transition-colors"
        >
          <GoogleMark />
          Continue with Google
        </button>

        <p className="mt-6 text-center text-sm text-gray-400">
          New here?{" "}
          <Link to="/register" className="text-teal-400 font-bold hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

const GoogleMark = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
  </svg>
);

export default Login;
