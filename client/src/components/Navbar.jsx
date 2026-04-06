import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../utils/cn";
import { useAuthStore } from "../store/useAuthStore";

export default function Navbar() {
  const { pathname } = useLocation();
  const { token, logout } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);

  const navItem = (path) =>
    cn(
      "relative rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 block text-center md:inline-block",
      pathname === path
        ? "bg-gradient-to-r from-rose-500/20 to-pink-500/20 text-rose-50 shadow-[0_0_15px_-3px_rgba(225,29,72,0.3)] border border-rose-500/30"
        : "text-rose-200/60 hover:bg-rose-500/10 hover:text-rose-100 border border-transparent",
    );

  const closeMenu = () => setIsOpen(false);

  const handleLogout = () => {
    logout();
    closeMenu();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex flex-col items-center pt-6 px-4 pointer-events-none">
      {/* Floating Glass Container (Main Bar) */}
      <div className="w-full max-w-5xl flex items-center justify-between rounded-full border border-rose-500/20 bg-black/40 px-4 py-3 backdrop-blur-xl shadow-2xl shadow-rose-950/50 pointer-events-auto relative z-20">
        {/* Logo Section */}
        <Link
          to="/"
          onClick={closeMenu}
          className="group flex items-center gap-3 pl-2 transition-transform hover:scale-105"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-rose-600 to-pink-500 shadow-[0_0_15px_-3px_rgba(225,29,72,0.6)]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-4 h-4 text-white"
            >
              <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
            </svg>
          </div>
          <span className="text-lg font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-rose-100 to-pink-200">
            Elariax
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2">
          <Link className={navItem("/")} to="/">
            Home
          </Link>
          {token ? (
            <>
              <Link className={navItem("/chat")} to="/chat">
                Chat
              </Link>
              <Link className={navItem("/settings")} to="/settings">
                Settings
              </Link>
              <Link className={navItem("/insights")} to="/insights">
                Insights
              </Link>
              <button
                className="ml-1 rounded-full px-4 py-2 text-sm font-medium text-rose-300/50 transition-all duration-300 hover:bg-rose-500/10 hover:text-rose-200 border border-transparent"
                type="button"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <Link className={navItem("/auth")} to="/auth">
              Login
            </Link>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-rose-200 hover:text-white transition-colors"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? (
            /* Close (X) Icon */
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            /* Hamburger Icon */
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      <div
        className={cn(
          "w-full max-w-5xl px-4 mt-2 transition-all duration-300 ease-in-out md:hidden pointer-events-auto relative z-10",
          isOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-4 pointer-events-none absolute",
        )}
      >
        <nav className="flex flex-col gap-2 rounded-3xl border border-rose-500/20 bg-black/60 p-4 backdrop-blur-2xl shadow-xl shadow-rose-950/40">
          <Link className={navItem("/")} to="/" onClick={closeMenu}>
            Home
          </Link>
          {token ? (
            <>
              <Link className={navItem("/chat")} to="/chat" onClick={closeMenu}>
                Chat
              </Link>
              <Link
                className={navItem("/settings")}
                to="/settings"
                onClick={closeMenu}
              >
                Settings
              </Link>
              <Link
                className={navItem("/insights")}
                to="/insights"
                onClick={closeMenu}
              >
                Insights
              </Link>
              <button
                className="rounded-full px-4 py-3 text-sm font-medium text-rose-300/70 transition-all hover:bg-rose-500/10 hover:text-rose-200 border border-transparent w-full"
                type="button"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <Link className={navItem("/auth")} to="/auth" onClick={closeMenu}>
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
