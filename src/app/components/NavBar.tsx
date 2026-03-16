"use client";
import { LogOut, Menu, X } from "lucide-react";
import { signOut } from "next-auth/react";
import { useState } from "react";

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: "Home", href: "#" },
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const handleLogout = async () => {
    await signOut({
      redirect: false,
    });

    window.location.href = "/login";
  };
  return (
    <>
      {/* Navbar Container */}
      <nav className="fixed top-0 left-0 right-0 z-50">
        {/* Glassmorphic Background */}
        <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50" />

        {/* Navbar Content */}
        <div className="relative mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <div className="flex-shrink-0">
              <a
                href="#"
                className="text-xl sm:text-2xl font-bold text-white hover:text-cyan-500 transition-colors duration-200"
              >
                <span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
                  EVENT SEAT
                </span>
              </a>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="relative px-3 py-2 text-sm font-medium text-slate-300 transition-all duration-200 group"
                >
                  <span className="relative z-10 group-hover:text-cyan-500">
                    {item.label}
                  </span>
                  {/* Animated underline */}
                  <span className="absolute bottom-1 left-3 right-3 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />
                </a>
              ))}
            </div>

            {/* Desktop CTA Button */}
            <div className="hidden md:flex items-center space-x-4 ">
              <button
                onClick={() => handleLogout()}
                className="w-full px-4 flex py-2 text-sm cursor-pointer font-medium items-center text-white bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-200"
              >
                <LogOut />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-slate-300 hover:text-cyan-500 hover:bg-slate-800 transition-colors duration-200"
              >
                {isOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-slate-900/95 backdrop-blur-md border-b border-slate-700/50 animate-in slide-in-from-top-2 duration-250">
            <div className="px-4 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-cyan-500 hover:bg-slate-800 transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <div>
                <button
                  onClick={() => handleLogout()}
                  className="w-30 px-4 flex py-2 text-sm cursor-pointer font-medium items-center text-white bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-200"
                >
                  <LogOut />
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Spacer to prevent content overlap */}
      <div className="h-16 sm:h-20" />
    </>
  );
}
