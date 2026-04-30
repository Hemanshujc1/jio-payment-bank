import React, { useState, useEffect } from "react";
import jio from "../../assets/jio.svg";
import vakrangeelogo from "../../assets/vakrangee.svg";
import { Link } from "react-router-dom";
import onboardingService from "../../services/onboardingService";

const Navbar = () => {
  const [balance, setBalance] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchBalance = async () => {
      const vkid = localStorage.getItem("vkid") || "RJ2903071";
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
    
    const interval = setInterval(fetchBalance, 30000); 
    return () => clearInterval(interval);
  }, []);

  return (
    <nav className="w-full min-h-16 sm:min-h-17 py-1 sm:py-0 bg-white flex flex-col sm:flex-row justify-center sm:justify-between items-center px-2 sm:px-6 md:px-12 shadow-md shrink-0 border-b border-neutral-light gap-2 sm:gap-0">
      <Link to="/" className="w-full sm:w-auto flex justify-center sm:justify-start shrink-0">
        <div className="flex items-center h-full gap-3 sm:gap-4">
          <img src={jio} alt="jio logo" className="h-8 sm:h-10 w-auto shrink-0" />
          <div className="h-6 sm:h-8 w-px bg-neutral-light shrink-0"></div>
          <img
            src={vakrangeelogo}
            alt="vakrangee logo"
            className="h-8 sm:h-10 w-auto shrink-0"
          />
        </div>
      </Link>

      <div className="w-full sm:w-auto flex items-center justify-center sm:justify-end shrink-0 gap-3 sm:gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-4">
          <span className="font-bold text-black text-[11px] sm:text-[14px] text-center whitespace-nowrap px-3 py-1 bg-sand-100 rounded-lg border border-sand-300 shadow-sm">
            User ID: RJ2903071
          </span>
          <div className="flex items-center gap-2 px-3 py-1 bg-green-50 rounded-lg border border-green-200 shadow-sm">
            <span className="text-[10px] sm:text-[11px] font-bold text-green-600 uppercase tracking-tighter sm:tracking-normal">Wallet:</span>
            {isLoading && !balance ? (
              <span className="w-3 h-3 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <span className="text-[12px] sm:text-[14px] font-extrabold text-green-800">{balance || "₹ 0.00"}</span>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
