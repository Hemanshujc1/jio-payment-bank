import React, { useState, useEffect } from "react";
import jio from "../../assets/jio.svg";
import vakrangeelogo from "../../assets/vakrangee.svg";
import { Link, useNavigate } from "react-router-dom";
import onboardingService from "../../services/onboardingService";

const Navbar = () => {
  const navigate = useNavigate();

  const [balance, setBalance] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const [user, setUser] = useState({
    user_id: "",
    user_name: "",
    email_id: "",
  });

  // -----------------------------------------
  // FETCH LOGGED-IN USER
  // -----------------------------------------
  useEffect(() => {
    const backendUrl =
      import.meta.env.VITE_BACKEND_URL || "https://localhost:3000";

    fetch(`${backendUrl}/profile`, {
      credentials: "include",
    })
      .then((res) => {
        if (res.status === 401) {
          window.location.href = backendUrl;
          return;
        }
        return res.json();
      })
      .then((data) => {
        if (data) {
          setUser(data);
          localStorage.setItem("vkid", data.user_id);
        }
      })
      .catch((err) => {
        console.error("Profile Error:", err);
      });
  }, []);

  // -----------------------------------------
  // FETCH WALLET BALANCE
  // -----------------------------------------
  useEffect(() => {
    // if (!user.user_id) return;

    const fetchBalance = async () => {
      user.user_id = "RJ2903071";
      const vkid = user.user_id;

      setIsLoading(true);

      try {
        const res = await onboardingService.getWalletBalance(vkid);

        if (res.status === "true") {
          setBalance(res.WalletBalance);
          localStorage.setItem("walletBalance", res.WalletBalance);
        }
      } catch (err) {
        console.error("Navbar: Failed to fetch wallet balance:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBalance();

    const interval = setInterval(fetchBalance, 100000);
    return () => clearInterval(interval);
  }, [user.user_id]);

  // -----------------------------------------
  // CLOSE DROPDOWN ON OUTSIDE CLICK
  // -----------------------------------------
  useEffect(() => {
    const handleClickOutside = () => {
      setMenuOpen(false);
    };

    if (menuOpen) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [menuOpen]);

  // -----------------------------------------
  // LOGOUT
  // -----------------------------------------
  const logout = () => {
    const backendUrl =
      import.meta.env.VITE_BACKEND_URL || "https://localhost:3000";

    window.location.href = `${backendUrl}/logout`;
  };

  // -----------------------------------------
  // REFUND
  // -----------------------------------------
  const refund = () => {
    navigate("/refund-flow");
    setMenuOpen(false);
  };

  return (
    <nav className="w-full min-h-16 sm:min-h-17 py-2 sm:py-0 bg-white flex justify-between items-center px-4 sm:px-6 md:px-12 shadow-md border-b border-neutral-light">
      {/* LEFT LOGOS */}
      <Link to="/" className="flex items-center gap-3 sm:gap-4 shrink-0">
        <img src={jio} alt="jio logo" className="h-8 sm:h-10 w-auto" />

        <div className="h-6 sm:h-8 w-px bg-neutral-light" />

        <img
          src={vakrangeelogo}
          alt="vakrangee logo"
          className="h-8 sm:h-10 w-auto"
        />
      </Link>

      {/* RIGHT SECTION */}
      <div
        className="relative flex items-center gap-3"
        onClick={(e) => e.stopPropagation()}
      >
        {/* WALLET */}
        <div className="flex items-center gap-2 px-3 py-2 bg-green-50 rounded-lg border border-green-200 shadow-sm">
          <span className="text-[10px] sm:text-[11px] font-bold text-green-600 uppercase">
            Wallet:
          </span>

          {isLoading && !balance ? (
            <span className="w-3 h-3 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></span>
          ) : (
            <span className="text-[12px] sm:text-[14px] font-extrabold text-green-800">
              ₹ {balance || "0.00"}
            </span>
          )}
        </div>

        {/* MENU BUTTON */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className={`p-2 rounded-lg border transition-colors shadow-sm ${
            menuOpen
              ? "bg-sand-100 border-sand-300 text-brown-800"
              : "bg-white border-sand-300 hover:bg-sand-50 text-sand-700"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* DROPDOWN MENU */}
        {menuOpen && (
          <div className="absolute right-0 top-14 w-56 bg-gray-200 rounded-xl border border-sand-200 shadow-xl z-50 overflow-hidden ring-1 ring-sand-900/5">
            {/* USER INFO */}
            <div className="px-4 py-3 bg-sand-50 border-b border-sand-200 text-left">
              <p className="text-[14px] font-bold text-brown-800 truncate">
                User: {user.user_name || "User"}
              </p>
              <p className="text-[12px] font-medium text-brown-600 mt-0.5 truncate">
                VK ID: {user.user_id || "-"}
              </p>
            </div>

            {/* REFUND */}
            <button
              onClick={refund}
              className="w-full text-left px-4 py-3 text-[14px] font-semibold text-sand-900 hover:bg-sand-300 hover:text-brown-800 transition-colors"
            >
              Refund
            </button>

            {/* LOGOUT */}
            <button
              onClick={logout}
              className="w-full text-left px-4 py-3 text-[14px] font-semibold text-red-600 hover:bg-red-50 transition-colors"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
