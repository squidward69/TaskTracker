import Header from "./Dashboard/Header";
import Footer from "./Dashboard/Footer";
import { useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { useEffect } from "react";

export default function Layout({ children }) {
  const location = useLocation();

  useEffect(() => {
    // Check if we need to show the toast
    if (sessionStorage.getItem("showGoogleLoginToast")) {
      // Small delay to ensure the page is fully loaded
      const timer = setTimeout(() => {
        toast.success("Logged in successfully with Google!", {
          duration: 2000,
        });
        sessionStorage.removeItem("showGoogleLoginToast");
      }, 100); // 100ms delay (barely noticeable)

      return () => clearTimeout(timer); // Cleanup
    }
  }, [location.pathname]); // Trigger on route change

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
