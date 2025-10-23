
'use client';

import {
  ShoppingCart,
  Menu,
  X,
  UserCircle,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Home,
  LogIn,
  UserPlus,
  Search,
  ShoppingBag,
  Info,
  Phone,
  LayoutGrid,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import WVlogo from "../assets/YUCHII LOGO.png";
import { categories, pumpSubCategories } from "@/assets/assets";

const navItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "Products", href: "/category/products", icon: ShoppingBag },
  { label: "Categories", href: "#", icon: LayoutGrid, dropdown: true },
  { label: "About", href: "/about", icon: Info },
  { label: "Contact", href: "/contact", icon: Phone },
];

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showPumpSubmenu, setShowPumpSubmenu] = useState(false);
  const [showMobilePumpSubmenu, setShowMobilePumpSubmenu] = useState(false);
  const dropdownRef = useRef(null);
  const closeTimeoutRef = useRef(null);
  const pumpSubmenuRef = useRef(null);

  const cartCount = useSelector((state) => state.cart.total);
  const { email } = useSelector((state) => state.auth);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handlePumpMouseEnter = () => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    setShowPumpSubmenu(true);
  };

  const handlePumpMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => setShowPumpSubmenu(false), 200);
  };

  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = menuOpen ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [menuOpen]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    setShowDropdown(true);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => setShowDropdown(false), 200);
  };

  const isActive = (path, label) => {
    if (label === "Categories") return showDropdown;
    return pathname === path;
  };

  return (
    <div className="sticky top-0 w-full bg-white z-50 shadow-sm">
      <nav className="relative bg-white shadow-sm z-50 ">
        <div className="mx-6">
          <div className="flex items-center justify-between max-w-7xl mx-auto py-2.5">
            {/* Hamburger + Logo (Mobile & Tablet) */}
            <div className="flex items-center lg:hidden">
              <button
                className="p-2 rounded-md hover:bg-[#7C2A47]/10 transition"
                onClick={toggleMenu}
                aria-label="Toggle menu"
              >
                {menuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <Link href="/" className="relative text-4xl font-semibold text-[#7C2A47]">
                <Image src={WVlogo} alt="WV logo" className="w-16 h-10" />
              </Link>
            </div>

            {/* Desktop Logo */}
            <div className="hidden lg:flex">
              <Link href="/" className="relative text-4xl font-semibold text-[#7C2A47]">
                <Image src={WVlogo} alt="WV logo" className="w-28 h-auto" />
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-2 text-slate-600 absolute left-1/2 transform -translate-x-1/2">
              {navItems.map((item) =>
                item.dropdown ? (
                  <div
                    key={item.label}
                    className="relative flex flex-col items-center"
                    ref={dropdownRef}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <button
                      className={`flex flex-row gap-2 items-center px-6 py-1 rounded-lg transition font-medium
                        ${
                          showDropdown
                            ? "bg-[#fef4ea] border-b-4 border-[#7C2A47] text-[#7C2A47] shadow"
                            : "hover:bg-[#E6A02A]/10 hover:text-[#7C2A47] border-b-4 border-transparent text-slate-700"
                        }
                      `}
                      type="button"
                      onClick={() => setShowDropdown((v) => !v)}
                    >
                      <LayoutGrid size={18} color={showDropdown ? "#7C2A47" : "#888"} className="mb-1" />
                      <span className="flex items-center gap-1 pb-2 mt-1 text-[16px]">
                        {item.label}
                        <ChevronDown size={18} color={showDropdown ? "#7C2A47" : "#888"} />
                      </span>
                    </button>

                    {showDropdown && (
                      <div className="absolute bg-white shadow-lg rounded-lg top-full mt-2 left-1/2 -translate-x-1/2 w-40 py-2 z-50">
                        {categories.map((cat) => (
                          <div
                            key={cat}
                            className="relative"
                            onMouseEnter={cat === "Pumps" ? handlePumpMouseEnter : undefined}
                            onMouseLeave={cat === "Pumps" ? handlePumpMouseLeave : undefined}
                          >
                            <Link
                              href={`/category/${cat}`}
                              className="flex items-center justify-between px-4 py-2 text-sm text-[#4A4644] hover:bg-[#E6A02A]/10 hover:text-[#7C2A47]"
                              onClick={() => {
                                setShowDropdown(false);
                                setShowPumpSubmenu(false);
                              }}
                            >
                              {cat}
                              {cat === "Pumps" && <ChevronRight size={14} className="text-[#4A4644] hover:text-[#7C2A47]" />}
                            </Link>

                            {cat === "Pumps" && showPumpSubmenu && (
                              <div
                                ref={pumpSubmenuRef}
                                className="absolute left-full top-0 w-40 bg-white shadow-lg rounded-lg py-2 z-50"
                                onMouseEnter={() => clearTimeout(closeTimeoutRef.current)}
                                onMouseLeave={handlePumpMouseLeave}
                              >
                                {pumpSubCategories.map((subCat) => (
                                  <Link
                                    key={subCat}
                                    href={`/category/Pumps/${subCat}`}
                                    className="block px-4 py-2 text-sm text-[#4A4644] hover:bg-[#E6A02A]/10 hover:text-[#7C2A47]"
                                    onClick={() => {
                                      setShowDropdown(false);
                                      setShowPumpSubmenu(false);
                                    }}
                                  >
                                    {subCat}
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`group flex flex-row items-center px-1 sm:px-2 md:px-4 lg:px-6 py-2 rounded-lg transition font-medium
                      ${
                        isActive(item.href, item.label)
                          ? "bg-[#fef4ea] border-b-4 border-[#7C2A47] text-[#7C2A47] shadow"
                          : "hover:bg-[#E6A02A]/10 hover:text-[#7C2A47] border-b-4 border-transparent text-slate-700"
                      }
                    `}
                  >
                    <item.icon
                      size={16}
                      className={`mr-2 transition-colors duration-300
                        ${isActive(item.href, item.label) ? "text-[#7C2A47]" : "text-gray-500 group-hover:text-[#7C2A47]"}
                      `}
                    />
                    <span className="mt-0 text-[16px]">{item.label}</span>
                  </Link>
                )
              )}
            </div>

            {/* Desktop Icons */}
            <div className="hidden lg:flex items-center gap-4 text-[#4A4644]">
              <Link href="/cart" className="relative flex items-center">
                <ShoppingCart size={23} />
                {mounted && cartCount > 0 && (
                  <span className="absolute -top-1 left-3 text-[8px] text-white bg-[#7C2A47] size-3.5 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
              <Link
                href={email ? "/signout" : "/login"}
                className="p-2 hover:bg-[#E6A02A]/20 rounded-full transition"
              >
                <UserCircle size={24} />
              </Link>
            </div>

            {/* Mobile & Tablet Icons */}
            <div className="flex items-center gap-4 lg:hidden">
              <Link href="/cart" className="relative flex items-center">
                <ShoppingCart size={20} />
                {mounted && cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 text-[8px] text-white bg-[#7C2A47] size-3.5 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
              <Link
                href={email ? "/signout" : "/login"}
                className="p-2 hover:bg-[#E6A02A]/20 rounded-full transition"
              >
                <UserCircle size={20} />
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile & Tablet Menu */}
        {menuOpen && (
          <>
            <div className="lg:hidden fixed top-0 left-0 h-full w-72 bg-white shadow-xl z-50 transform transition-transform duration-300">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-center px-6 py-4 border-b border-[#E6A02A]/40">
                  <Link href="/" className="relative text-4xl font-semibold text-[#7C2A47]">
                    <Image src={WVlogo} alt="WV logo" className="w-20 h-auto" />
                  </Link>
                </div>
                <div className="flex flex-col gap-2 px-6 text-[#4A4644] flex-grow overflow-y-auto mt-2">
                  {[
                    { label: "Home", href: "/", icon: <Home size={18} /> },
                    { label: "Products", href: "/category/products", icon: <ShoppingBag size={18} /> },
                  ].map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={toggleMenu}
                      className={`flex items-center gap-3 p-2 rounded-lg transition border-l-4 ${
                        isActive(item.href)
                          ? "bg-[#fef4ea] text-[#7C2A47] border-[#7C2A47]"
                          : "text-[#4A4644] border-transparent hover:bg-[#E6A02A]/10 hover:text-[#7C2A47]"
                      }`}
                    >
                      {item.icon} {item.label}
                    </Link>
                  ))}

                  {/* Categories Dropdown */}
                  <details className="group">
                    <summary className="flex items-center justify-between cursor-pointer p-2 text-[#4A4644] border-l-4 border-transparent hover:bg-[#E6A02A]/10 hover:text-[#7C2A47] hover:border-[#7C2A47] group-open:bg-[#fef4ea] group-open:text-[#7C2A47] group-open:border-l-4 group-open:border-[#7C2A47] group-open:rounded-lg transition-all duration-200">
                      <span className="flex items-center gap-3 text-[15px]">
                        <LayoutGrid size={18} />Categories
                      </span>
                      <ChevronDown size={18} className="transition-transform group-open:rotate-180" />
                    </summary>
                    <div className="ml-8 mt-2 flex flex-col gap-2">
                      {categories.map((cat) => (
                        <div key={cat}>
                          {cat === "Pumps" ? (
                            <details className="group">
                              <summary
                                className="flex items-center justify-between cursor-pointer text-sm text-gray-600 hover:text-[#7C2A47] hover:bg-[#E6A02A]/20 px-2 py-1 rounded-md transition-colors duration-200"
                                onClick={() => setShowMobilePumpSubmenu(!showMobilePumpSubmenu)}
                              >
                                <span>{cat}</span>
                                <ChevronLeft
                                  size={16}
                                  className="transition-transform group-open:rotate-180 text-gray-600 hover:text-[#7C2A47]"
                                />
                              </summary>
                              {showMobilePumpSubmenu && (
                                <div className="ml-4 mt-2 flex flex-col gap-2">
                                  {pumpSubCategories.map((subCat) => (
                                    <Link
                                      key={subCat}
                                      href={`/category/Pumps/${subCat}`}
                                      onClick={toggleMenu}
                                      className="text-sm text-gray-600 hover:text-[#7C2A47] hover:bg-[#E6A02A]/20 px-2 py-1 rounded-md transition-colors duration-200"
                                    >
                                      {subCat}
                                    </Link>
                                  ))}
                                </div>
                              )}
                            </details>
                          ) : (
                            <Link
                              href={`/category/${cat}`}
                              onClick={toggleMenu}
                              className="text-sm text-gray-600 hover:text-[#7C2A47] hover:bg-[#E6A02A]/20 px-2 py-1 rounded-md transition-colors duration-200"
                            >
                              {cat}
                            </Link>
                          )}
                        </div>
                      ))}
                    </div>
                  </details>

                  {[
                    { label: "About", href: "/about", icon: <Info size={18} /> },
                    { label: "Contact", href: "/contact", icon: <Phone size={18} /> },
                  ].map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={toggleMenu}
                      className={`flex items-center gap-3 p-2 rounded-lg transition border-l-4 ${
                        isActive(item.href)
                          ? "bg-[#fef4ea] text-[#7C2A47] border-[#7C2A47]"
                          : "text-[#4A4644] border-transparent hover:bg-[#E6A02A]/10 hover:text-[#7C2A47]"
                      }`}
                    >
                      {item.icon} {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            <div
              className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-40"
              onClick={toggleMenu}
            ></div>
          </>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
