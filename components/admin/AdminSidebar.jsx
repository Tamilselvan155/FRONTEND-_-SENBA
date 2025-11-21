'use client'

import { usePathname } from "next/navigation"
import { Gauge, ImageIcon, Tag, List, FolderTree, Building2, Package, FolderOpen, ChevronRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { assets } from "@/assets/assets"
import { useEffect, useRef } from "react"

const AdminSidebar = ({ isCollapsed = false }) => {

    const pathname = usePathname()
    const sidebarRef = useRef(null)

    useEffect(() => {
        // Inject CSS to hide Next.js indicator
        const styleId = 'hide-nextjs-indicator'
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style')
            style.id = styleId
            style.textContent = `
                [data-nextjs-dev-indicator],
                [class*="__next-dev-indicator"],
                [id*="__next-dev-indicator"],
                [data-testid="nextjs-dev-indicator"],
                div[style*="position: fixed"][style*="bottom"][style*="left"],
                div[style*="position:fixed"][style*="bottom"][style*="left"],
                body > div[style*="position: fixed"][style*="left: 0"],
                body > div[style*="position:fixed"][style*="left:0"] {
                    display: none !important;
                    visibility: hidden !important;
                    opacity: 0 !important;
                    pointer-events: none !important;
                    width: 0 !important;
                    height: 0 !important;
                    overflow: hidden !important;
                    position: absolute !important;
                    left: -9999px !important;
                }
            `
            document.head.appendChild(style)
        }

        const removeNextIndicator = () => {
            // Method 1: Find all possible Next.js dev indicator elements by selectors - INCLUDING BUTTON WATERMARK
            const allSelectors = [
                '[data-nextjs-dev-indicator]',
                '[class*="__next-dev-indicator"]',
                '[id*="__next-dev-indicator"]',
                '[data-testid="nextjs-dev-indicator"]',
                '[data-testid*="nextjs"]',
                '.__next-dev-indicator',
                '#__next-build-watcher',
                '[class*="nextjs"]',
                '[id*="nextjs"]',
                // Target the specific button watermark
                '#next-logo',
                'button#next-logo',
                'button[data-next-mark]',
                'button[data-next-mark="true"]',
                'button[data-next-mark-loading]',
                'button[data-nextjs-dev-tools-button]',
                'button[aria-label="Open Next.js Dev Tools"]',
                '[aria-controls="nextjs-dev-tools-menu"]',
                // Target the SVG inside the button
                'svg[data-next-mark-loading]',
                'svg[data-next-mark-loading="false"]',
                'svg[viewBox="0 0 40 40"]',
                'svg[width="40"][height="40"]'
            ]

            allSelectors.forEach(selector => {
                try {
                    document.querySelectorAll(selector).forEach(el => {
                        el.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important; pointer-events: none !important; width: 0 !important; height: 0 !important;'
                        el.remove()
                    })
                } catch (e) {}
            })

            // Method 2: Check ALL elements in the document for "N" text at bottom-left
            document.querySelectorAll('*').forEach(el => {
                try {
                    const style = window.getComputedStyle(el)
                    const rect = el.getBoundingClientRect()
                    const text = el.textContent?.trim()
                    const innerHTML = el.innerHTML?.trim() || ''
                    const styleAttr = el.getAttribute('style') || ''
                    
                    // Skip if element is already hidden or removed
                    if (el.offsetParent === null || style.display === 'none') return
                    
                    // Check 0: Button watermark detection FIRST (highest priority)
                    const isButtonWatermark = el.tagName === 'BUTTON' && (
                        el.id === 'next-logo' ||
                        el.getAttribute('data-next-mark') === 'true' ||
                        el.getAttribute('data-next-mark-loading') !== null ||
                        el.getAttribute('data-nextjs-dev-tools-button') === 'true' ||
                        el.getAttribute('aria-label') === 'Open Next.js Dev Tools' ||
                        el.getAttribute('aria-controls') === 'nextjs-dev-tools-menu'
                    )
                    
                    // Check 0.5: SVG watermark detection
                    const isSvgWatermark = el.tagName === 'SVG' && (
                        el.getAttribute('data-next-mark-loading') !== null ||
                        el.getAttribute('viewBox') === '0 0 40 40' ||
                        (el.getAttribute('width') === '40' && el.getAttribute('height') === '40')
                    )
                    
                    // Check 1: ANY fixed/absolute position + "N" text (watermark detection)
                    const isFixed = style.position === 'fixed'
                    const isAbsolute = style.position === 'absolute'
                    const isBottomLeft = rect.left < 150 && (rect.bottom < 150 || (window.innerHeight - rect.bottom) < 150)
                    const hasN = text === 'N' || text === 'n' || innerHTML === 'N' || innerHTML === 'n' || innerHTML.includes('__next')
                    const isSmall = rect.width < 100 && rect.height < 100
                    const isCircular = style.borderRadius === '50%' || (parseFloat(style.borderRadius) > 0 && rect.width === rect.height)
                    
                    // Remove button watermark FIRST (highest priority)
                    if (isButtonWatermark) {
                        el.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important; pointer-events: none !important; width: 0 !important; height: 0 !important; position: absolute !important; left: -9999px !important; top: -9999px !important;'
                        el.remove()
                        return
                    }
                    
                    // Remove SVG watermark
                    if (isSvgWatermark) {
                        el.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important; pointer-events: none !important; width: 0 !important; height: 0 !important; position: absolute !important; left: -9999px !important;'
                        el.remove()
                        return
                    }
                    
                    // Remove ANY small element with "N" that looks like a watermark, regardless of position
                    if (hasN && isSmall && (isFixed || isAbsolute || isCircular)) {
                        // Make sure it's not part of legitimate content
                        const parent = el.parentElement
                        const isInContent = parent && (
                            parent.closest('nav') || 
                            parent.closest('main') || 
                            parent.closest('article') || 
                            parent.closest('section') ||
                            parent.closest('header') ||
                            parent.closest('footer')
                        )
                        
                        // If it's a watermark-like element (small, fixed/absolute, with "N"), remove it
                        if (!isInContent || (isFixed && isSmall)) {
                            el.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important; pointer-events: none !important; width: 0 !important; height: 0 !important; position: absolute !important; left: -9999px !important;'
                            el.remove()
                            return
                        }
                    }
                    
                    // Also check bottom-left specifically (original check)
                    if (isFixed && hasN && isBottomLeft && isSmall) {
                        el.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important; pointer-events: none !important; width: 0 !important; height: 0 !important; position: absolute !important; left: -9999px !important;'
                        el.remove()
                        return
                    }
                    
                    // Check 2: Inline style with fixed + bottom/left + "N" text
                    if (
                        (styleAttr.includes('position: fixed') || styleAttr.includes('position:fixed')) &&
                        (styleAttr.includes('bottom') || styleAttr.includes('left')) &&
                        hasN
                    ) {
                        el.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important; pointer-events: none !important; width: 0 !important; height: 0 !important;'
                        el.remove()
                        return
                    }
                    
                    // Check 3: Circular element with "N" at bottom-left
                    if (
                        isFixed &&
                        hasN &&
                        isBottomLeft &&
                        (style.borderRadius === '50%' || style.borderRadius.includes('px') || style.border.includes('solid'))
                    ) {
                        el.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important; pointer-events: none !important; width: 0 !important; height: 0 !important;'
                        el.remove()
                        return
                    }
                    
                    // Check 4: Any element with "N" text positioned at bottom-left (even if not fixed)
                    if (
                        hasN &&
                        rect.left < 200 &&
                        (rect.bottom < 200 || (window.innerHeight - rect.bottom) < 200) &&
                        isSmall
                    ) {
                        // Double check it's not part of legitimate content
                        const parent = el.parentElement
                        if (!parent || !parent.closest('nav') || !parent.closest('aside')) {
                            el.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important; pointer-events: none !important; width: 0 !important; height: 0 !important;'
                            el.remove()
                        }
                    }
                    
                    // Check 5: Black menu overlay and black lines (the menu that appears when clicking N)
                    const menuId = el.id === 'nextjs-dev-tools-menu' || el.getAttribute('aria-labelledby')?.includes('next')
                    const bgColor = style.backgroundColor || ''
                    const hasBlackBg = bgColor.includes('rgb(0, 0, 0)') || bgColor.includes('rgba(0, 0, 0') || bgColor === 'black' || bgColor.includes('#000')
                    const hasNextJsContent = text.includes('Route') || text.includes('Turbopack') || text.includes('Preferences') || text.includes('Route Info') || text.includes('Dev Tools')
                    
                    // Remove menu overlay
                    if (menuId || (isFixed && isBottomLeft && hasBlackBg && hasNextJsContent)) {
                        el.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important; pointer-events: none !important; width: 0 !important; height: 0 !important; position: absolute !important; left: -9999px !important; top: -9999px !important;'
                        el.remove()
                        return
                    }
                    
                    // Check for black lines/borders
                    const isBlackLine = (
                        (rect.height <= 2 && rect.width > 10) || // Horizontal line
                        (rect.width <= 2 && rect.height > 10) || // Vertical line
                        (style.borderColor && style.borderColor.includes('rgb(0, 0, 0)')) ||
                        (style.borderColor && style.borderColor.includes('black')) ||
                        (style.borderTopColor && style.borderTopColor.includes('black')) ||
                        (style.borderBottomColor && style.borderBottomColor.includes('black'))
                    ) && isBottomLeft && (isFixed || isAbsolute)
                    
                    if (isBlackLine) {
                        el.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important; pointer-events: none !important; width: 0 !important; height: 0 !important; position: absolute !important; left: -9999px !important; top: -9999px !important;'
                        el.remove()
                        return
                    }
                    
                    // Also check children for Next.js menu content
                    if (isFixed && isBottomLeft && hasBlackBg) {
                        const children = el.querySelectorAll('*')
                        let foundNextJsMenu = false
                        children.forEach(child => {
                            const childText = (child.textContent || '').trim()
                            if (childText.includes('Route') || childText.includes('Turbopack') || childText.includes('Preferences') || childText.includes('Dev Tools')) {
                                foundNextJsMenu = true
                            }
                        })
                        if (foundNextJsMenu) {
                            el.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important; pointer-events: none !important; width: 0 !important; height: 0 !important; position: absolute !important; left: -9999px !important; top: -9999px !important;'
                            el.remove()
                            return
                        }
                    }
                } catch (e) {
                    // Silently continue if there's an error
                }
            })

            // Method 3: Check sidebar area specifically - ENHANCED
            if (sidebarRef.current) {
                try {
                    const sidebarRect = sidebarRef.current.getBoundingClientRect()
                    // Check all elements in the entire viewport
                    document.querySelectorAll('*').forEach(el => {
                        try {
                            if (!el.getBoundingClientRect) return
                            const rect = el.getBoundingClientRect()
                            const text = el.textContent?.trim()
                            const innerHTML = el.innerHTML?.trim() || ''
                            const style = window.getComputedStyle(el)
                            const styleAttr = el.getAttribute('style') || ''
                            
                            // Skip if already hidden
                            if (el.offsetParent === null || style.display === 'none') return
                            
                            // Check if element is near sidebar bottom-left corner
                            const isNearSidebar = (
                                rect.left >= sidebarRect.left - 100 &&
                                rect.left <= sidebarRect.right + 100 &&
                                rect.top >= sidebarRect.bottom - 150 &&
                                rect.top <= sidebarRect.bottom + 100
                            )
                            
                            // Check if it's the "N" watermark
                            const hasN = text === 'N' || text === 'n' || innerHTML === 'N' || innerHTML === 'n'
                            const isSmall = rect.width < 150 && rect.height < 150
                            const isFixed = style.position === 'fixed' || styleAttr.includes('position: fixed') || styleAttr.includes('position:fixed')
                            const isAbsolute = style.position === 'absolute' || styleAttr.includes('position: absolute') || styleAttr.includes('position:absolute')
                            const isCircular = style.borderRadius === '50%' || (parseFloat(style.borderRadius) > 0 && rect.width === rect.height)
                            
                            // Remove ANY element with "N" near sidebar bottom
                            if (isNearSidebar && hasN && isSmall) {
                                el.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important; pointer-events: none !important; width: 0 !important; height: 0 !important; position: absolute !important; left: -9999px !important; top: -9999px !important;'
                                el.remove()
                                return
                            }
                            
                            // Also check for fixed/absolute elements with "N" anywhere in sidebar area
                            if (isNearSidebar && hasN && (isFixed || isAbsolute || isCircular)) {
                                el.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important; pointer-events: none !important; width: 0 !important; height: 0 !important; position: absolute !important; left: -9999px !important; top: -9999px !important;'
                                el.remove()
                                return
                            }
                            
                            // Check for any element with "N" text in bottom-left quadrant of screen
                            const isBottomLeft = rect.left < 300 && (rect.bottom < 300 || (window.innerHeight - rect.bottom) < 300)
                            if (isBottomLeft && hasN && isSmall && (isFixed || isAbsolute || isCircular)) {
                                el.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important; pointer-events: none !important; width: 0 !important; height: 0 !important; position: absolute !important; left: -9999px !important; top: -9999px !important;'
                                el.remove()
                                return
                            }
                        } catch (e) {}
                    })
                } catch (e) {}
            }
            
            // Method 4: Aggressive check for ANY element with just "N" text anywhere
            document.querySelectorAll('div, span, button, a').forEach(el => {
                try {
                    if (!el.getBoundingClientRect) return
                    const rect = el.getBoundingClientRect()
                    const text = el.textContent?.trim()
                    const innerHTML = el.innerHTML?.trim() || ''
                    const style = window.getComputedStyle(el)
                    const styleAttr = el.getAttribute('style') || ''
                    
                    // Skip if already hidden
                    if (el.offsetParent === null || style.display === 'none') return
                    
                    // Check if it's a small element with just "N"
                    const hasOnlyN = (text === 'N' || text === 'n') && text.length === 1
                    const isSmall = rect.width < 150 && rect.height < 150
                    const isFixed = style.position === 'fixed' || styleAttr.includes('position: fixed') || styleAttr.includes('position:fixed')
                    const isAbsolute = style.position === 'absolute' || styleAttr.includes('position: absolute') || styleAttr.includes('position:absolute')
                    const isBottomLeft = rect.left < 300 && (rect.bottom < 300 || (window.innerHeight - rect.bottom) < 300)
                    
                    // Remove ANY small element with only "N" text in bottom-left area
                    if (hasOnlyN && isSmall && isBottomLeft && (isFixed || isAbsolute)) {
                        el.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important; pointer-events: none !important; width: 0 !important; height: 0 !important; position: absolute !important; left: -9999px !important; top: -9999px !important;'
                        el.remove()
                    }
                } catch (e) {}
            })
        }

        // Run immediately
        removeNextIndicator()
        
        // Use requestAnimationFrame for a few frames to catch early renders
        let rafCount = 0
        const rafLoop = () => {
            if (rafCount < 10) {
                removeNextIndicator()
                rafCount++
                requestAnimationFrame(rafLoop)
            }
        }
        requestAnimationFrame(rafLoop)

        // Run on very frequent interval - more aggressive
        const interval = setInterval(removeNextIndicator, 10)

        // Use MutationObserver
        const observer = new MutationObserver(removeNextIndicator)
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true
        })
        observer.observe(document.documentElement, {
            childList: true,
            subtree: true
        })

        return () => {
            clearInterval(interval)
            observer.disconnect()
        }
    }, [])

    const sidebarLinks = [
        { name: 'Dashboard', href: '/admin', icon: Gauge },
        { name: 'Banners', href: '/admin/banners', icon: ImageIcon },
        { name: 'Attribute', href: '/admin/attribute', icon: Tag },
        { name: 'Attribute value', href: '/admin/attribute-value', icon: List },
        { name: 'Category', href: '/admin/category', icon: FolderTree },
        { name: 'Brands', href: '/admin/brands', icon: Building2 },
        { name: 'Products', href: '/admin/products', icon: Package },
        { name: 'Asset Manager', href: '/admin/asset-manager', icon: FolderOpen },
    ]

    return (
        <aside 
            ref={sidebarRef}
            className={`flex h-screen flex-col bg-blue-900 text-white transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'} relative`}
            style={{ overflow: 'hidden' }}
        >
                {/* Logo Section */}
            <div className={`flex h-14 items-center justify-center bg-white shadow-sm w-full ${isCollapsed ? 'px-2' : 'px-3'}`}>
                {isCollapsed ? (
                    <Image 
                        src={assets.gs_logo} 
                        alt="Logo" 
                        width={40} 
                        height={40} 
                        className="object-contain w-10 h-10"
                        priority
                    />
                ) : (
                    <Image 
                        src={assets.gs_logo} 
                        alt="Logo" 
                        width={240} 
                        height={40} 
                        className="object-contain w-full h-full max-h-12"
                        priority
                    />
                )}
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 overflow-y-auto px-2 py-4 scrollbar-thin scrollbar-thumb-blue-700 scrollbar-track-blue-900">
                <ul className="space-y-1">
                    {sidebarLinks.map((link, index) => {
                        const isActive = pathname === link.href
                        return (
                            <li key={index}>
                                <Link 
                                    href={link.href} 
                                    title={isCollapsed ? link.name : ''}
                                    className={`group relative flex items-center rounded-lg py-2.5 text-sm font-medium transition-all duration-200 ${
                                        isCollapsed ? 'justify-center px-2' : 'justify-between gap-3 px-3'
                                    } ${
                                        isActive
                                            ? 'bg-blue-800 text-white shadow-sm' 
                                            : 'text-blue-100 hover:bg-blue-800/70 hover:text-white'
                                    }`}
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <link.icon 
                                            size={18} 
                                            className={`flex-shrink-0 transition-colors ${
                                                isActive ? 'text-white' : 'text-blue-300 group-hover:text-white'
                                            }`} 
                                        />
                                        {!isCollapsed && (
                                            <span className="truncate">{link.name}</span>
                                        )}
                                    </div>
                                    {!isCollapsed && (
                                        <ChevronRight 
                                            size={14} 
                                            className={`flex-shrink-0 transition-colors ${
                                                isActive ? 'text-white' : 'text-blue-400 group-hover:text-white'
                                            }`} 
                                        />
                                    )}
                                </Link>
                            </li>
                        )
                    })}
                </ul>
            </nav>
        </aside>
    )
}

export default AdminSidebar