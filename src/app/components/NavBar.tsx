"use client";
import { LogOut, Menu, X } from "lucide-react";
import { signOut } from "next-auth/react";
import { useState } from "react";

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: "Home", href: "/admin/userRegistration" },
  { label: "Add Event", href: "/admin/addEvent" },
  { label: "Chat", href: "/admin/chatAdmin" },
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
        <div className="absolute inset-0 border-b border-white/8 bg-[#09131ddd] backdrop-blur-xl" />

        {/* Navbar Content */}
        <div className="relative mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <div className="flex-shrink-0">
              <a
                href="/admin/userRegistration"
                className="text-xl sm:text-2xl font-bold text-white transition-colors duration-200 hover:text-primary"
              >
                <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
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
                  className="group relative rounded-full px-3 py-2 text-sm font-medium text-slate-300 transition-all duration-200 hover:bg-white/4"
                >
                  <span className="relative z-10 group-hover:text-primary">
                    {item.label}
                  </span>
                  <span className="absolute bottom-1 left-3 right-3 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-primary via-secondary to-accent transition-transform duration-200 group-hover:scale-x-100" />
                </a>
              ))}
            </div>

            <div className="hidden md:flex items-center space-x-4 ">
              <button
                onClick={() => handleLogout()}
                className="flex w-full cursor-pointer items-center rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:border-primary/40 hover:bg-primary/12 hover:text-primary"
              >
                <LogOut />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center rounded-xl p-2 text-slate-300 transition-colors duration-200 hover:bg-white/6 hover:text-primary"
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
          <div className="animate-in slide-in-from-top-2 absolute left-0 right-0 top-full border-b border-white/8 bg-[#09131df2] backdrop-blur-xl duration-250 md:hidden">
            <div className="px-4 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="block rounded-xl px-3 py-2 text-base font-medium text-slate-300 transition-colors duration-200 hover:bg-white/6 hover:text-primary"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <div>
                <button
                  onClick={() => handleLogout()}
                  className="flex w-30 cursor-pointer items-center rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:border-primary/40 hover:bg-primary/12 hover:text-primary"
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
