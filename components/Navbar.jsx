
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
  ShoppingBag,
  Info,
  Phone,
  LayoutGrid,
  Search,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef, useMemo, useCallback, memo } from "react";
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

const Navbar = memo(() => {
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showPumpSubmenu, setShowPumpSubmenu] = useState(false);
  const [showMobilePumpSubmenu, setShowMobilePumpSubmenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchMobile, setShowSearchMobile] = useState(false);
  const dropdownRef = useRef(null);
  const closeTimeoutRef = useRef(null);
  const pumpSubmenuRef = useRef(null);
  const searchInputRef = useRef(null);

  const cartCount = useSelector((state) => state.cart.total);
  const { email } = useSelector((state) => state.auth);

  // Memoize toggle function
  const toggleMenu = useCallback(() => {
    setMenuOpen((prev) => !prev);
  }, []);

  // Optimize timeout delays - reduced from 200ms to 100ms
  const handlePumpMouseEnter = useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setShowPumpSubmenu(true);
  }, []);

  const handlePumpMouseLeave = useCallback(() => {
    closeTimeoutRef.current = setTimeout(() => {
      setShowPumpSubmenu(false);
      closeTimeoutRef.current = null;
    }, 100);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [menuOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setShowDropdown(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    closeTimeoutRef.current = setTimeout(() => {
      setShowDropdown(false);
      closeTimeoutRef.current = null;
    }, 100);
  }, []);

  // Memoize active state check
  const isActive = useCallback((path, label) => {
    if (label === "Categories") return showDropdown;
    return pathname === path;
  }, [pathname, showDropdown]);

  // Prefetch routes on hover
  const handleLinkHover = useCallback((href) => {
    if (href && href !== '#' && typeof window !== 'undefined') {
      router.prefetch(href);
    }
  }, [router]);

  // Handle search
  const handleSearch = useCallback((e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setShowSearchMobile(false);
    }
  }, [searchQuery, router]);

  // Focus search input when mobile search is shown
  useEffect(() => {
    if (showSearchMobile && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearchMobile]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  // Memoize mobile menu items to prevent recreation on every render
  const mobileMainItems = useMemo(() => [
    { label: "Home", href: "/", icon: <Home size={18} /> },
    { label: "Products", href: "/category/products", icon: <ShoppingBag size={18} /> },
  ], []);

  const mobileFooterItems = useMemo(() => [
    { label: "About", href: "/about", icon: <Info size={18} /> },
    { label: "Contact", href: "/contact", icon: <Phone size={18} /> },
  ], []);

  return (
    <header 
      className={`sticky top-0 w-full z-50 transition-all duration-200 ${
        scrolled 
          ? 'bg-white shadow-sm border-b border-gray-200' 
          : 'bg-white border-b border-gray-100'
      }`}
      style={{ backgroundColor: 'white', zIndex: 50 }}
    >
      <nav className="relative z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20 gap-3 sm:gap-4">
            {/* Mobile: Hamburger + Logo */}
            <div className="flex items-center gap-2 sm:gap-3 lg:hidden flex-shrink-0">
              <button
                className="p-2 -ml-2 rounded-lg hover:bg-[#7C2A47]/10 transition-all duration-200 flex items-center justify-center group"
                onClick={toggleMenu}
                aria-label="Toggle menu"
              >
                {menuOpen ? <X size={22} className="text-gray-700 group-hover:text-[#7C2A47] transition-colors" /> : <Menu size={22} className="text-gray-700 group-hover:text-[#7C2A47] transition-colors" />}
              </button>
              <Link href="/" className="flex items-center">
                <Image src={WVlogo} alt="WV logo" className="h-10 w-auto object-contain" />
              </Link>
            </div>

            {/* Desktop Layout: Logo | Search | Menu | Icons */}
            <div className="hidden lg:flex items-center w-full justify-between gap-6 xl:gap-8">
              {/* Desktop Logo */}
              <div className="flex items-center flex-shrink-0">
                <Link href="/" className="flex items-center">
                  <Image 
                    src={WVlogo} 
                    alt="WV logo" 
                    className="h-12 w-auto object-contain" 
                  />
                </Link>
              </div>

              {/* Desktop Search Bar - Flexible width */}
              <div className="flex items-center flex-1 min-w-0 max-w-2xl mx-6 xl:mx-8">
                <form onSubmit={handleSearch} className="w-full relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products by name or keyword..."
                    className="w-full px-4 py-2.5 pl-10 pr-10 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C2A47]/20 focus:border-[#7C2A47] transition-all duration-200 bg-gray-50 hover:bg-white"
                  />
                  <Search 
                    size={18} 
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" 
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md hover:bg-[#7C2A47]/10 transition-colors"
                    aria-label="Search"
                  >
                    <Search size={16} className="text-gray-600 hover:text-[#7C2A47]" />
                  </button>
                </form>
              </div>

              {/* Desktop Menu Items */}
              <div className="flex items-center gap-1 xl:gap-1.5 flex-shrink-0">
                {navItems.filter(item => item.label !== "Categories").map((item) =>
                  item.dropdown ? (
                    <div
                      key={item.label}
                      className="relative"
                      ref={dropdownRef}
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                    >
                      <button
                        className={`flex items-center gap-1.5 px-3 xl:px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200
                          ${
                            showDropdown
                              ? "text-[#7C2A47] bg-[#7C2A47]/10"
                              : "text-gray-700 hover:text-[#7C2A47] hover:bg-[#7C2A47]/10"
                          }
                        `}
                        type="button"
                        onClick={() => setShowDropdown((v) => !v)}
                      >
                        <LayoutGrid size={16} className={`transition-colors flex-shrink-0 ${showDropdown ? "text-[#7C2A47]" : "text-gray-500"}`} />
                        <span className="whitespace-nowrap">{item.label}</span>
                        <ChevronDown 
                          size={14} 
                          className={`transition-transform duration-200 flex-shrink-0 ${showDropdown ? "rotate-180 text-[#7C2A47]" : "text-gray-400"}`}
                        />
                      </button>

                      {showDropdown && (
                        <div className="absolute bg-white shadow-lg rounded-lg top-full mt-2 left-1/2 -translate-x-1/2 w-56 py-1 z-50 border border-gray-200">
                          {categories.map((cat) => {
                            const categoryHref = `/category/${cat}`;
                            return (
                              <div
                                key={cat}
                                className="relative"
                                onMouseEnter={cat === "Pumps" ? handlePumpMouseEnter : () => handleLinkHover(categoryHref)}
                                onMouseLeave={cat === "Pumps" ? handlePumpMouseLeave : undefined}
                              >
                                <Link
                                  href={categoryHref}
                                  prefetch={true}
                                  className="flex items-center justify-between px-4 py-2.5 text-sm text-gray-700 hover:text-[#7C2A47] hover:bg-[#7C2A47]/10 transition-all duration-200 rounded-md mx-1 group"
                                  onClick={() => {
                                    setShowDropdown(false);
                                    setShowPumpSubmenu(false);
                                  }}
                                >
                                  <span className="font-medium">{cat}</span>
                                  {cat === "Pumps" && <ChevronRight size={14} className="text-gray-400 group-hover:text-[#7C2A47] transition-colors" />}
                                </Link>

                                {cat === "Pumps" && showPumpSubmenu && (
                                  <div
                                    ref={pumpSubmenuRef}
                                    className="absolute left-full top-0 ml-1 w-56 bg-white shadow-lg rounded-lg py-1 z-50 border border-gray-200"
                                    onMouseEnter={() => {
                                      if (closeTimeoutRef.current) {
                                        clearTimeout(closeTimeoutRef.current);
                                        closeTimeoutRef.current = null;
                                      }
                                    }}
                                    onMouseLeave={handlePumpMouseLeave}
                                  >
                                    {pumpSubCategories.map((subCat) => {
                                      const subCatHref = `/category/Pumps/${subCat}`;
                                      return (
                                        <Link
                                          key={subCat}
                                          href={subCatHref}
                                          prefetch={true}
                                          className="block px-4 py-2.5 text-sm text-gray-700 hover:text-[#7C2A47] hover:bg-[#7C2A47]/10 transition-all duration-200 font-medium"
                                          onClick={() => {
                                            setShowDropdown(false);
                                            setShowPumpSubmenu(false);
                                          }}
                                        >
                                          {subCat}
                                        </Link>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      key={item.href}
                      href={item.href}
                      prefetch={true}
                      onMouseEnter={() => handleLinkHover(item.href)}
                      className={`flex items-center gap-1.5 px-3 xl:px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 group
                        ${
                          isActive(item.href, item.label)
                            ? "text-[#7C2A47] bg-[#7C2A47]/10"
                            : "text-gray-700 hover:text-[#7C2A47] hover:bg-[#7C2A47]/10"
                        }
                      `}
                    >
                      <item.icon
                        size={16}
                        className={`transition-colors flex-shrink-0 ${isActive(item.href, item.label) ? "text-[#7C2A47]" : "text-gray-500 group-hover:text-[#7C2A47]"}`}
                      />
                      <span className="whitespace-nowrap">{item.label}</span>
                    </Link>
                  )
                )}
              </div>

              {/* Desktop Icons */}
              <div className="flex items-center gap-1.5 xl:gap-2 flex-shrink-0 ml-2">
                <Link 
                  href="/cart" 
                  prefetch={true}
                  onMouseEnter={() => handleLinkHover("/cart")}
                  className="relative flex items-center justify-center p-2 hover:bg-[#7C2A47]/10 rounded-lg transition-all duration-200 group"
                >
                  <ShoppingCart size={20} className="text-gray-700 group-hover:text-[#7C2A47] transition-colors" />
                  {mounted && cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 text-[10px] font-semibold text-white bg-[#7C2A47] min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1">
                      {cartCount > 99 ? '99+' : cartCount}
                    </span>
                  )}
                </Link>
                <Link
                  href={email ? "/signout" : "/login"}
                  prefetch={true}
                  onMouseEnter={() => handleLinkHover(email ? "/signout" : "/login")}
                  className="p-2 hover:bg-[#7C2A47]/10 rounded-lg transition-all duration-200 group"
                  aria-label={email ? "Sign out" : "Sign in"}
                >
                  <UserCircle size={20} className="text-gray-700 group-hover:text-[#7C2A47] transition-colors" />
                </Link>
              </div>
            </div>

            {/* Mobile & Tablet Icons */}
            <div className="flex items-center gap-1.5 sm:gap-2 lg:hidden flex-shrink-0">
              <button
                onClick={() => setShowSearchMobile(!showSearchMobile)}
                className="p-2 hover:bg-[#7C2A47]/10 rounded-lg transition-all duration-200"
                aria-label="Search"
              >
                <Search size={20} className="text-gray-700" />
              </button>
              <Link 
                href="/cart" 
                prefetch={true}
                className="relative flex items-center justify-center p-2 hover:bg-[#7C2A47]/10 rounded-lg transition-all duration-200"
              >
                <ShoppingCart size={20} className="text-gray-700" />
                {mounted && cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 text-[9px] font-semibold text-white bg-[#7C2A47] min-w-[16px] h-[16px] rounded-full flex items-center justify-center px-1">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </Link>
              <Link
                href={email ? "/signout" : "/login"}
                prefetch={true}
                className="p-2 hover:bg-[#7C2A47]/10 rounded-lg transition-all duration-200 active:bg-[#7C2A47]/20"
                aria-label={email ? "Sign out" : "Sign in"}
              >
                <UserCircle size={20} className="text-gray-700" />
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar - Appears below navbar */}
        {showSearchMobile && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-md z-40 px-4 py-3 w-full">
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className={`w-full py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C2A47]/20 focus:border-[#7C2A47] transition-all duration-200 bg-gray-50 ${
                    searchQuery ? 'pl-10 pr-10' : 'pl-10 pr-10'
                  }`}
                />
                <Search 
                  size={18} 
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" 
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-gray-100 transition-colors"
                    aria-label="Clear search"
                  >
                    <X size={16} className="text-gray-600" />
                  </button>
                )}
              </div>
              <button
                type="submit"
                className="px-4 py-2.5 bg-[#7C2A47] text-white rounded-lg hover:bg-[#7C2A47]/90 active:bg-[#7C2A47]/80 transition-colors flex-shrink-0 shadow-sm"
                aria-label="Search"
              >
                <Search size={18} />
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowSearchMobile(false);
                  setSearchQuery("");
                }}
                className="p-2.5 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-colors flex-shrink-0"
                aria-label="Close search"
              >
                <X size={18} className="text-gray-600" />
              </button>
            </form>
          </div>
        )}

        {/* Mobile & Tablet Menu */}
        {menuOpen && (
          <>
            <div className="lg:hidden fixed top-0 left-0 h-full w-72 sm:w-80 bg-white shadow-xl z-50 border-r border-gray-200">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-200 flex-shrink-0">
                  <Link href="/" className="flex items-center" onClick={toggleMenu}>
                    <Image src={WVlogo} alt="WV logo" className="h-10 w-auto object-contain" />
                  </Link>
                  <button
                    onClick={toggleMenu}
                    className="p-2 rounded-lg hover:bg-[#7C2A47]/10 active:bg-[#7C2A47]/20 transition-all duration-200 group"
                    aria-label="Close menu"
                  >
                    <X size={20} className="text-gray-700 group-hover:text-[#7C2A47] transition-colors" />
                  </button>
                </div>
                <div className="flex flex-col gap-1 px-3 sm:px-4 text-gray-700 flex-grow overflow-y-auto py-2">
                  {mobileMainItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      prefetch={true}
                      onClick={toggleMenu}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${
                        isActive(item.href)
                          ? "text-[#7C2A47] bg-[#7C2A47]/10"
                          : "text-gray-700 hover:text-[#7C2A47] hover:bg-[#7C2A47]/10"
                      }`}
                    >
                      <span className="flex-shrink-0">{item.icon}</span>
                      <span className="text-sm font-medium">{item.label}</span>
                    </Link>
                  ))}

                  {/* Categories Dropdown */}
                  <details className="group">
                    <summary className="flex items-center justify-between cursor-pointer px-4 py-2.5 text-gray-700 hover:text-[#7C2A47] hover:bg-[#7C2A47]/10 rounded-lg transition-all duration-200 group-open:bg-[#7C2A47]/10 group-open:text-[#7C2A47]">
                      <span className="flex items-center gap-3 text-sm font-medium">
                        <LayoutGrid size={18} className="flex-shrink-0" />
                        <span>Categories</span>
                      </span>
                      <ChevronDown size={18} className="transition-transform group-open:rotate-180 flex-shrink-0" />
                    </summary>
                    <div className="ml-8 mt-1 flex flex-col gap-1">
                      {categories.map((cat) => (
                        <div key={cat}>
                          {cat === "Pumps" ? (
                            <details className="group">
                              <summary
                                className="flex items-center justify-between cursor-pointer text-sm text-gray-600 hover:text-[#7C2A47] hover:bg-[#7C2A47]/10 px-3 py-2 rounded-lg transition-all duration-200"
                                onClick={() => setShowMobilePumpSubmenu(!showMobilePumpSubmenu)}
                              >
                                <span className="font-medium">{cat}</span>
                                <ChevronRight
                                  size={16}
                                  className={`transition-transform ${showMobilePumpSubmenu ? "rotate-90" : ""} text-gray-400`}
                                />
                              </summary>
                              {showMobilePumpSubmenu && (
                                <div className="ml-4 mt-1 flex flex-col gap-1">
                                  {pumpSubCategories.map((subCat) => (
                                    <Link
                                      key={subCat}
                                      href={`/category/Pumps/${subCat}`}
                                      prefetch={true}
                                      onClick={toggleMenu}
                                      className="text-sm text-gray-600 hover:text-[#7C2A47] hover:bg-[#7C2A47]/10 px-3 py-2 rounded-lg transition-all duration-200 block font-medium"
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
                              prefetch={true}
                              onClick={toggleMenu}
                              className="text-sm text-gray-600 hover:text-[#7C2A47] hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors block font-medium"
                            >
                              {cat}
                            </Link>
                          )}
                        </div>
                      ))}
                    </div>
                  </details>

                  {mobileFooterItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      prefetch={true}
                      onClick={toggleMenu}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${
                        isActive(item.href)
                          ? "text-[#7C2A47] bg-[#7C2A47]/10"
                          : "text-gray-700 hover:text-[#7C2A47] hover:bg-[#7C2A47]/10"
                      }`}
                    >
                      <span className="flex-shrink-0">{item.icon}</span>
                      <span className="text-sm font-medium">{item.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            <div
              className="fixed inset-0 bg-black/20 z-40"
              onClick={toggleMenu}
            />
          </>
        )}
      </nav>
    </header>
  );
});

Navbar.displayName = 'Navbar';

export default Navbar;
