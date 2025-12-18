
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
import { useSelector, useDispatch } from "react-redux";
import { signOut } from "@/lib/features/login/authSlice";
import { clearAuthData } from "@/lib/utils/authUtils";
import toast from "react-hot-toast";
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

  const dispatch = useDispatch();
  const cartCount = useSelector((state) => state.cart.total);
  const { email } = useSelector((state) => state.auth);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

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

  // Handle logout
  const handleLogout = useCallback(async () => {
    setIsLoggingOut(true);
    try {
      // Call logout API endpoint
      const token = localStorage.getItem('token');
      if (token) {
        try {
          await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/auth/logout`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
        } catch (apiError) {
          // Ignore API errors - still proceed with client-side logout
          console.log('Logout API call failed, proceeding with client-side logout');
        }
      }

      // Clear Redux state
      dispatch(signOut());
      
      // Clear all authentication data
      clearAuthData();
      
      // Show success message
      toast.success('Logged out successfully');
      
      // Close modal
      setShowLogoutModal(false);
      
      // Redirect to home page
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('An error occurred during logout');
    } finally {
      setIsLoggingOut(false);
    }
  }, [dispatch, router]);

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
      className={`sticky top-0 w-full z-50 transition-all duration-200 bg-white border-b border-gray-200`}
      style={{ backgroundColor: 'white', zIndex: 50 }}
    >
      {/* Top Theme Color Line */}
      <div className="w-full h-1 bg-[#7C2A47]"></div>
      
      <nav className="relative z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20 gap-4 sm:gap-6">
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

            {/* Desktop Layout: Logo | Search | Account | Basket */}
            <div className="hidden lg:flex items-center w-full justify-between gap-6">
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

              {/* Desktop Search Bar - Large and Centered */}
              <div className="flex items-center flex-1 min-w-0 max-w-3xl mx-auto">
                <form
                  onSubmit={handleSearch}
                  className="w-full flex items-stretch h-12 rounded-lg border border-gray-300 focus-within:border-[#7C2A47] focus-within:ring-2 focus-within:ring-[#7C2A47]/20 transition-all duration-200 bg-white overflow-hidden"
                >
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="search..."
                    className="flex-1 px-4 text-sm focus:outline-none bg-white text-gray-900 h-full border-0"
                  />
                  <button
                    type="submit"
                    className="w-14 bg-[#7C2A47] hover:bg-[#6a2340] text-white transition-colors duration-200 flex items-center justify-center flex-shrink-0 h-full"
                    aria-label="Search"
                  >
                    <Search size={18} className="text-white" />
                  </button>
                </form>
              </div>

              {/* Account Section */}
              <div className="flex flex-col items-end flex-shrink-0 border-r border-gray-300 pr-4 mr-4 gap-1">
                {email ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowLogoutModal(true);
                    }}
                    className="text-xs text-gray-600 hover:text-gray-900 transition-colors cursor-pointer relative z-10 block py-1 text-left"
                  >
                    Sign Out
                  </button>
                ) : (
                  <Link
                    href="/login"
                    prefetch={true}
                    onMouseEnter={() => handleLinkHover("/login")}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    className="text-xs text-gray-600 hover:text-gray-900 transition-colors cursor-pointer relative z-10 block py-1"
                  >
                    Login / Signup
                  </Link>
                )}
                <Link
                  href={email ? "/account" : "/login"}
                  prefetch={true}
                  onMouseEnter={() => handleLinkHover(email ? "/account" : "/login")}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="text-sm font-semibold text-gray-900 hover:text-[#7C2A47] transition-colors cursor-pointer relative z-10 block py-1"
                >
                  My account
                </Link>
              </div>

              {/* Basket with Text */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <Link 
                  href="/cart" 
                  prefetch={true}
                  onMouseEnter={() => handleLinkHover("/cart")}
                  className="relative flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                  <ShoppingCart size={24} className="text-gray-900" />
                  {mounted && cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 text-[10px] font-semibold text-white bg-[#7C2A47] min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1">
                      {cartCount > 99 ? '99+' : cartCount}
                    </span>
                  )}
                  <span className="text-sm font-medium text-gray-900">Basket</span>
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
              {email ? (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setShowLogoutModal(true);
                  }}
                  className="p-2 hover:bg-[#7C2A47]/10 rounded-lg transition-all duration-200 active:bg-[#7C2A47]/20"
                  aria-label="Sign out"
                >
                  <UserCircle size={20} className="text-gray-700" />
                </button>
              ) : (
                <Link
                  href="/login"
                  prefetch={true}
                  className="p-2 hover:bg-[#7C2A47]/10 rounded-lg transition-all duration-200 active:bg-[#7C2A47]/20"
                  aria-label="Sign in"
                >
                  <UserCircle size={20} className="text-gray-700" />
                </Link>
              )}
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

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Confirm Logout
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to logout? You will need to login again to access your account.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowLogoutModal(false)}
                disabled={isLoggingOut}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="px-4 py-2 text-sm font-medium text-white bg-[#7C2A47] hover:bg-[#6a2340] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoggingOut ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Logging out...
                  </>
                ) : (
                  'Yes, Logout'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
});

Navbar.displayName = 'Navbar';

export default Navbar;
