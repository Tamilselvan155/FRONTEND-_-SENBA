
'use client';

import {
  ShoppingCart,
  Menu,
  X,
  UserCircle,
  Home,
  ShoppingBag,
  Info,
  Phone,
  Search,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef, useMemo, useCallback, memo } from "react";
import { createPortal } from "react-dom";
import { useSelector, useDispatch } from "react-redux";
import { signOut } from "@/lib/features/login/authSlice";
import { clearAuthData } from "@/lib/utils/authUtils";
import { recalculateTotal, forceClearInvalidCart } from "@/lib/features/cart/cartSlice";
import toast from "react-hot-toast";
import WVlogo from "../assets/YUCHII LOGO.png";

const navItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "Products", href: "/category/products", icon: ShoppingBag },
  { label: "About", href: "/about", icon: Info },
  { label: "Contact", href: "/contact", icon: Phone },
];

const Navbar = memo(() => {
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchMobile, setShowSearchMobile] = useState(false);
  const closeTimeoutRef = useRef(null);
  const searchInputRef = useRef(null);

  const dispatch = useDispatch();
  // Calculate cart count ONLY from actual cart items - NEVER trust stored total
  const cartCount = useSelector((state) => {
    // ALWAYS calculate from actual items, never use state.cart.total
    
    // First check cartItems object - this is the source of truth
    const cartItems = state.cart.cartItems || {};
    
    // If cartItems is empty or invalid, return 0 immediately (don't check items array)
    if (!cartItems || typeof cartItems !== 'object' || Object.keys(cartItems).length === 0) {
      return 0;
    }
    
    // Calculate total ONLY from cart items, filtering out ALL invalid values
    let calculatedTotal = 0;
    let validKeysCount = 0;
    
    for (const [key, value] of Object.entries(cartItems)) {
      const qty = Number(value);
      // Only count valid positive numbers - be very strict
      if (!isNaN(qty) && qty > 0 && isFinite(qty) && qty % 1 === 0) {
        calculatedTotal += qty;
        validKeysCount++;
      }
    }
    
    // If we found no valid items, return 0 (even if calculatedTotal somehow has a value)
    if (validKeysCount === 0) {
      return 0;
    }
    
    // For logged-in users, also verify against items array if it exists
    // If items array exists but doesn't match cartItems, trust cartItems (it's the source of truth)
    const items = state.cart.items || [];
    if (Array.isArray(items) && items.length > 0) {
      // Double-check: if items array has data but cartItems is empty, return 0
      // This handles the case where items array has stale data
      if (validKeysCount === 0) {
        return 0;
      }
    }
    
    // ALWAYS return calculated total - NEVER use state.cart.total
    return calculatedTotal;
  });
  
  const { email } = useSelector((state) => state.auth);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Memoize toggle function
  const toggleMenu = useCallback(() => {
    setMenuOpen((prev) => !prev);
  }, []);


  // Run cleanup immediately on mount, before setting mounted state
  useEffect(() => {
      // Directly check and clear localStorage if cart is actually empty
      if (typeof window !== 'undefined') {
        try {
          const savedCart = localStorage.getItem('cart');
          if (savedCart) {
            const parsed = JSON.parse(savedCart);
            const cartItems = parsed.cartItems || {};
            let hasValidItems = false;
            
            for (const value of Object.values(cartItems)) {
              const num = Number(value);
              if (!isNaN(num) && num > 0 && isFinite(num) && num % 1 === 0) {
                hasValidItems = true;
                break;
              }
            }
            
            // If no valid items, clear localStorage completely
            if (!hasValidItems || Object.keys(cartItems).length === 0) {
              localStorage.removeItem('cart');
            // Also dispatch cleanup to ensure Redux state is clean
            dispatch(forceClearInvalidCart());
            }
          } else {
            // No cart in localStorage, ensure Redux is clean
            dispatch(forceClearInvalidCart());
          }
        } catch (e) {
          // If error parsing, clear it
          localStorage.removeItem('cart');
        dispatch(forceClearInvalidCart());
        }
      }
      
      // Force clear any invalid cart data, then recalculate
      dispatch(forceClearInvalidCart());
      dispatch(recalculateTotal());
    setMounted(true);
  }, [dispatch]);

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

  // Memoize active state check
  const isActive = useCallback((path) => {
    return pathname === path;
  }, [pathname]);

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
                    priority
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
                  {mounted && cartCount > 0 && Number(cartCount) > 0 && (
                    <span className="absolute -top-1 -right-1 text-[10px] font-semibold text-white bg-[#7C2A47] min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1">
                      {Number(cartCount) > 99 ? '99+' : Number(cartCount)}
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
                {mounted && cartCount > 0 && Number(cartCount) > 0 && (
                  <span className="absolute -top-1 -right-1 text-[9px] font-semibold text-white bg-[#7C2A47] min-w-[16px] h-[16px] rounded-full flex items-center justify-center px-1">
                    {Number(cartCount) > 99 ? '99+' : Number(cartCount)}
                  </span>
                )}
              </Link>
              {email ? (
                <Link
                  href="/account"
                  prefetch={true}
                  className="p-2 hover:bg-[#7C2A47]/10 rounded-lg transition-all duration-200 active:bg-[#7C2A47]/20"
                  aria-label="My account"
                >
                  <UserCircle size={20} className="text-gray-700" />
                </Link>
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
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-md z-[45] px-4 py-3 w-full">
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
            <div className="lg:hidden fixed top-0 left-0 h-full w-72 sm:w-80 bg-white shadow-xl z-[60] border-r border-gray-200">
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

                {/* Mobile Menu Footer - Banner Content */}
                <div className="flex-shrink-0 border-t border-gray-200 bg-gradient-to-r from-[#7C2A47] via-[#8B3A5A] to-[#7C2A47] px-4 py-4">
                  {/* Contact Info */}
                  <div className="flex flex-col gap-3 mb-4">
                    {/* Email */}
                    <a 
                      href="mailto:contact@example.com"
                      className="flex items-center gap-2 text-white/90 hover:text-white transition-colors"
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path
                          d="M14.6654 4.66699L8.67136 8.48499C8.46796 8.60313 8.23692 8.66536 8.0017 8.66536C7.76647 8.66536 7.53544 8.60313 7.33203 8.48499L1.33203 4.66699M2.66536 2.66699H13.332C14.0684 2.66699 14.6654 3.26395 14.6654 4.00033V12.0003C14.6654 12.7367 14.0684 13.3337 13.332 13.3337H2.66536C1.92898 13.3337 1.33203 12.7367 1.33203 12.0003V4.00033C1.33203 3.26395 1.92898 2.66699 2.66536 2.66699Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span className="text-sm">contact@example.com</span>
                    </a>
                    {/* Phone */}
                    <a 
                      href="tel:+12124567890"
                      className="flex items-center gap-2 text-white/90 hover:text-white transition-colors"
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path
                          d="M9.22003 11.045C9.35772 11.1082 9.51283 11.1227 9.65983 11.086C9.80682 11.0493 9.93692 10.9636 10.0287 10.843L10.2654 10.533C10.3896 10.3674 10.5506 10.233 10.7357 10.1404C10.9209 10.0479 11.125 9.99967 11.332 9.99967H13.332C13.6857 9.99967 14.0248 10.1402 14.2748 10.3902C14.5249 10.6402 14.6654 10.9794 14.6654 11.333V13.333C14.6654 13.6866 14.5249 14.0258 14.2748 14.2758C14.0248 14.5259 13.6857 14.6663 13.332 14.6663C10.1494 14.6663 7.09719 13.4021 4.84675 11.1516C2.59631 8.90119 1.33203 5.84894 1.33203 2.66634C1.33203 2.31272 1.47251 1.97358 1.72256 1.72353C1.9726 1.47348 2.31174 1.33301 2.66536 1.33301H4.66536C5.01899 1.33301 5.35812 1.47348 5.60817 1.72353C5.85822 1.97358 5.9987 2.31272 5.9987 2.66634V4.66634C5.9987 4.87333 5.9505 5.07749 5.85793 5.26263C5.76536 5.44777 5.63096 5.60881 5.46536 5.73301L5.15336 5.96701C5.03098 6.06046 4.94471 6.1934 4.90923 6.34324C4.87374 6.49308 4.89122 6.65059 4.9587 6.78901C5.86982 8.63959 7.36831 10.1362 9.22003 11.045Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span className="text-sm">+1-212-456-7890</span>
                    </a>
                  </div>

                  {/* Social Icons */}
                  <div className="flex items-center gap-3">
                    <Link
                      href="https://www.facebook.com"
                      target="_blank"
                      className="hover:scale-110 transition-transform"
                    >
                      <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                        <path
                          d="M14.9987 1.66699H12.4987C11.3936 1.66699 10.3338 2.10598 9.55242 2.88738C8.77102 3.66878 8.33203 4.72859 8.33203 5.83366V8.33366H5.83203V11.667H8.33203V18.3337H11.6654V11.667H14.1654L14.9987 8.33366H11.6654V5.83366C11.6654 5.61265 11.7532 5.40068 11.9094 5.2444C12.0657 5.08812 12.2777 5.00033 12.4987 5.00033H14.9987V1.66699Z"
                          stroke="#fff"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </Link>

                    <Link
                      href="https://www.instagram.com"
                      target="_blank"
                      className="hover:scale-110 transition-transform"
                    >
                      <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                        <path
                          d="M14.5846 5.41699H14.593M5.83464 1.66699H14.168C16.4692 1.66699 18.3346 3.53247 18.3346 5.83366V14.167C18.3346 16.4682 16.4692 18.3337 14.168 18.3337H5.83464C3.53345 18.3337 1.66797 16.4682 1.66797 14.167V5.83366C1.66797 3.53247 3.53345 1.66699 5.83464 1.66699ZM13.3346 9.47533C13.4375 10.1689 13.319 10.8772 12.9961 11.4995C12.6732 12.1218 12.1623 12.6265 11.536 12.9417C10.9097 13.2569 10.2 13.3667 9.50779 13.2553C8.81557 13.1439 8.1761 12.8171 7.68033 12.3213C7.18457 11.8255 6.85775 11.1861 6.74636 10.4938C6.63497 9.80162 6.74469 9.0919 7.05991 8.46564C7.37512 7.83937 7.87979 7.32844 8.50212 7.00553C9.12445 6.68261 9.83276 6.56415 10.5263 6.66699C11.2337 6.7719 11.8887 7.10154 12.3944 7.60725C12.9001 8.11295 13.2297 8.76789 13.3346 9.47533Z"
                          stroke="#fff"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </Link>

                    <Link
                      href="https://twitter.com"
                      target="_blank"
                      className="hover:scale-110 transition-transform"
                    >
                      <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                        <path
                          d="M18.3346 3.33368C18.3346 3.33368 17.7513 5.08368 16.668 6.16701C18.0013 14.5003 8.83464 20.5837 1.66797 15.8337C3.5013 15.917 5.33464 15.3337 6.66797 14.167C2.5013 12.917 0.417969 8.00034 2.5013 4.16701C4.33464 6.33368 7.16797 7.58368 10.0013 7.50034C9.2513 4.00034 13.3346 2.00034 15.8346 4.33368C16.7513 4.33368 18.3346 3.33368 18.3346 3.33368Z"
                          stroke="#fff"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </Link>

                    <Link
                      href="https://www.linkedin.com"
                      target="_blank"
                      className="hover:scale-110 transition-transform"
                    >
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13.3346 6.66699C14.6607 6.66699 15.9325 7.19378 16.8702 8.13146C17.8079 9.06914 18.3346 10.3409 18.3346 11.667V17.5003H15.0013V11.667C15.0013 11.225 14.8257 10.801 14.5131 10.4885C14.2006 10.1759 13.7767 10.0003 13.3346 10.0003C12.8926 10.0003 12.4687 10.1759 12.1561 10.4885C11.8436 10.801 11.668 11.225 11.668 11.667V17.5003H8.33464V11.667C8.33464 10.3409 8.86142 9.06914 9.7991 8.13146C10.7368 7.19378 12.0086 6.66699 13.3346 6.66699Z" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M5.0013 7.50033H1.66797V17.5003H5.0013V7.50033Z" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M3.33464 5.00033C4.25511 5.00033 5.0013 4.25413 5.0013 3.33366C5.0013 2.41318 4.25511 1.66699 3.33464 1.66699C2.41416 1.66699 1.66797 2.41318 1.66797 3.33366C1.66797 4.25413 2.41416 5.00033 3.33464 5.00033Z" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="fixed inset-0 bg-black/20 z-[55]"
              onClick={toggleMenu}
            />
          </>
        )}
      </nav>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && typeof window !== 'undefined' ? createPortal(
        <div className="fixed inset-0 flex items-center justify-center p-4" style={{ zIndex: 9999 }}>
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm" 
            onClick={() => setShowLogoutModal(false)}
            style={{ zIndex: 9999 }}
          />
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative" style={{ zIndex: 10000 }}>
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
        </div>,
        document.body
      ) : null}
    </header>
  );
});

Navbar.displayName = 'Navbar';

export default Navbar;
