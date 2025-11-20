'use client'

import { usePathname } from "next/navigation"
import { ImageIcon, Tag, List, FolderTree, Building2, Package, FolderOpen, ChevronRight } from "lucide-react"
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
            // Method 1: Find all possible Next.js dev indicator elements by selectors
            const allSelectors = [
                '[data-nextjs-dev-indicator]',
                '[class*="__next-dev-indicator"]',
                '[id*="__next-dev-indicator"]',
                '[data-testid="nextjs-dev-indicator"]',
                '[data-testid*="nextjs"]',
                '.__next-dev-indicator',
                '#__next-build-watcher',
                '[class*="nextjs"]',
                '[id*="nextjs"]'
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
                    
                    // Check 1: ANY fixed/absolute position + "N" text (watermark detection)
                    const isFixed = style.position === 'fixed'
                    const isAbsolute = style.position === 'absolute'
                    const isBottomLeft = rect.left < 150 && (rect.bottom < 150 || (window.innerHeight - rect.bottom) < 150)
                    const hasN = text === 'N' || text === 'n' || innerHTML === 'N' || innerHTML === 'n' || innerHTML.includes('__next')
                    const isSmall = rect.width < 100 && rect.height < 100
                    const isCircular = style.borderRadius === '50%' || (parseFloat(style.borderRadius) > 0 && rect.width === rect.height)
                    
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
                    
                    // Check 5: Black menu overlay (the menu that appears when clicking N)
                    if (isFixed && isBottomLeft) {
                        const bgColor = style.backgroundColor || ''
                        const hasBlackBg = bgColor.includes('rgb(0, 0, 0)') || bgColor.includes('rgba(0, 0, 0') || bgColor === 'black' || bgColor.includes('#000')
                        const hasNextJsContent = text.includes('Route') || text.includes('Turbopack') || text.includes('Preferences') || text.includes('Route Info')
                        
                        if (hasBlackBg && hasNextJsContent) {
                            el.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important; pointer-events: none !important; width: 0 !important; height: 0 !important;'
                            el.remove()
                            return
                        }
                        
                        // Also check children for Next.js menu content
                        const children = el.querySelectorAll('*')
                        let foundNextJsMenu = false
                        children.forEach(child => {
                            const childText = (child.textContent || '').trim()
                            if (childText.includes('Route') || childText.includes('Turbopack') || childText.includes('Preferences')) {
                                foundNextJsMenu = true
                            }
                        })
                        if (foundNextJsMenu) {
                            el.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important; pointer-events: none !important; width: 0 !important; height: 0 !important;'
                            el.remove()
                            return
                        }
                    }
                } catch (e) {
                    // Silently continue if there's an error
                }
            })

            // Method 3: Check sidebar area specifically
            if (sidebarRef.current) {
                try {
                    const sidebarRect = sidebarRef.current.getBoundingClientRect()
                    document.querySelectorAll('*').forEach(el => {
                        try {
                            const rect = el.getBoundingClientRect()
                            const text = el.textContent?.trim()
                            
                            // If element is in sidebar bottom area and has "N" text
                            if (
                                (text === 'N' || text === 'n') &&
                                rect.left >= sidebarRect.left - 50 &&
                                rect.left <= sidebarRect.right + 50 &&
                                rect.top >= sidebarRect.bottom - 200 &&
                                rect.top <= sidebarRect.bottom + 50
                            ) {
                                el.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important; pointer-events: none !important; width: 0 !important; height: 0 !important;'
                                el.remove()
                            }
                        } catch (e) {}
                    })
                } catch (e) {}
            }
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

        // Run on very frequent interval
        const interval = setInterval(removeNextIndicator, 25)

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