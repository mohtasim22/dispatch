import { Outlet } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Public shell: sticky navbar, page content (Outlet), footer.
const RootLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-950 text-gray-100">
      <Navbar />
      <main className="flex-1">
        <Outlet /> {/* child route renders here */}
      </main>
      <Footer />
    </div>
  );
};

export default RootLayout;
