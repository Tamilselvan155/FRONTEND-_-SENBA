import { Outfit } from "next/font/google";
import { Toaster } from "react-hot-toast";
import StoreProvider from "@/app/StoreProvider";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"], weight: ["400", "500", "600"] });

export const metadata = {
    title: "Senba Pumps & Motors",
    description: "Senba Pumps & Motors",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                            (function() {
                                'use strict';
                                function removeIndicator() {
                                    // Method 1: Remove by all known selectors
                                    const selectors = [
                                        '[data-nextjs-dev-indicator]',
                                        '[class*="__next-dev-indicator"]',
                                        '[id*="__next-dev-indicator"]',
                                        '[data-testid="nextjs-dev-indicator"]',
                                        '[data-testid*="nextjs"]',
                                        '[class*="nextjs-dev-indicator"]',
                                        '[id*="nextjs-dev-indicator"]',
                                        '.__next-dev-indicator',
                                        '#__next-build-watcher'
                                    ];
                                    
                                    selectors.forEach(selector => {
                                        try {
                                            document.querySelectorAll(selector).forEach(el => {
                                                el.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important; pointer-events: none !important; width: 0 !important; height: 0 !important; position: absolute !important; left: -9999px !important;';
                                                el.remove();
                                            });
                                        } catch(e) {}
                                    });
                                    
                                    // Method 2: Find ALL elements and check for "N" at bottom-left
                                    try {
                                        const allElements = document.querySelectorAll('*');
                                        for (let i = 0; i < allElements.length; i++) {
                                            const el = allElements[i];
                                            try {
                                                if (!el || !el.getBoundingClientRect) continue;
                                                
                                                const rect = el.getBoundingClientRect();
                                                const text = (el.textContent || '').trim();
                                                const innerHTML = (el.innerHTML || '').trim();
                                                const style = window.getComputedStyle(el);
                                                const styleAttr = el.getAttribute('style') || '';
                                                
                                                // Skip if already hidden
                                                if (el.offsetParent === null || style.display === 'none' || style.visibility === 'hidden') continue;
                                                
                                                // Check if it's the "N" indicator - check ANYWHERE on page, not just bottom-left
                                                const hasN = text === 'N' || text === 'n' || innerHTML === 'N' || innerHTML === 'n';
                                                const isFixed = style.position === 'fixed' || styleAttr.includes('position: fixed') || styleAttr.includes('position:fixed');
                                                const isAbsolute = style.position === 'absolute' || styleAttr.includes('position: absolute') || styleAttr.includes('position:absolute');
                                                const isSmall = rect.width < 100 && rect.height < 100;
                                                const isCircular = style.borderRadius === '50%' || (parseFloat(style.borderRadius) > 0 && rect.width === rect.height);
                                                
                                                // Remove ANY small element with just "N" text that looks like a watermark/indicator
                                                if (hasN && isSmall && (isFixed || isAbsolute || isCircular)) {
                                                    // Additional check: make sure it's not part of legitimate content
                                                    const parent = el.parentElement;
                                                    const isInContent = parent && (
                                                        parent.closest('nav') || 
                                                        parent.closest('main') || 
                                                        parent.closest('article') || 
                                                        parent.closest('section') ||
                                                        parent.closest('header') ||
                                                        parent.closest('footer') ||
                                                        parent.closest('aside') && !parent.closest('aside').classList.toString().includes('bg-blue-900')
                                                    );
                                                    
                                                    // If it's a small circular/fixed element with "N" and not in legitimate content, remove it
                                                    if (!isInContent || (isFixed && isSmall)) {
                                                        el.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important; pointer-events: none !important; width: 0 !important; height: 0 !important; position: absolute !important; left: -9999px !important;';
                                                        el.remove();
                                                        continue;
                                                    }
                                                }
                                                
                                                // Also check bottom-left specifically (original check)
                                                const isBottomLeft = rect.left < 200 && (rect.bottom < 200 || (window.innerHeight - rect.bottom) < 200);
                                                if (hasN && isBottomLeft && isSmall && (isFixed || rect.left < 150)) {
                                                    el.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important; pointer-events: none !important; width: 0 !important; height: 0 !important; position: absolute !important; left: -9999px !important;';
                                                    el.remove();
                                                    continue;
                                                }
                                                
                                                // Also check for the menu overlay (black menu that appears on click)
                                                if (isFixed && isBottomLeft && style.backgroundColor && (
                                                    style.backgroundColor.includes('rgb(0, 0, 0)') || 
                                                    style.backgroundColor.includes('rgba(0, 0, 0') ||
                                                    style.backgroundColor === 'black' ||
                                                    el.classList.toString().includes('nextjs') ||
                                                    el.classList.toString().includes('__next')
                                                )) {
                                                    const children = el.querySelectorAll('*');
                                                    let hasNextJsContent = false;
                                                    children.forEach(child => {
                                                        const childText = (child.textContent || '').trim();
                                                        if (childText.includes('Route') || childText.includes('Turbopack') || childText.includes('Preferences')) {
                                                            hasNextJsContent = true;
                                                        }
                                                    });
                                                    if (hasNextJsContent) {
                                                        el.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important; pointer-events: none !important;';
                                                        el.remove();
                                                    }
                                                }
                                            } catch(e) {}
                                        }
                                    } catch(e) {}
                                }
                                
                                // Run immediately
                                if (document.readyState === 'loading') {
                                    document.addEventListener('DOMContentLoaded', function() {
                                        removeIndicator();
                                        setInterval(removeIndicator, 10);
                                    });
                                } else {
                                    removeIndicator();
                                    setInterval(removeIndicator, 10);
                                }
                                
                                // Use MutationObserver
                                try {
                                    const observer = new MutationObserver(function(mutations) {
                                        removeIndicator();
                                    });
                                    
                                    observer.observe(document.body || document.documentElement, {
                                        childList: true,
                                        subtree: true,
                                        attributes: true,
                                        attributeFilter: ['style', 'class', 'id', 'data-testid', 'data-nextjs-dev-indicator']
                                    });
                                    
                                    if (document.documentElement) {
                                        observer.observe(document.documentElement, {
                                            childList: true,
                                            subtree: true,
                                            attributes: true
                                        });
                                    }
                                } catch(e) {}
                                
                                // Intercept element creation
                                const originalCreateElement = document.createElement;
                                document.createElement = function(tagName, options) {
                                    const el = originalCreateElement.call(this, tagName, options);
                                    
                                    setTimeout(function() {
                                        try {
                                            const rect = el.getBoundingClientRect();
                                            const text = (el.textContent || '').trim();
                                            const style = window.getComputedStyle(el);
                                            const isSmall = rect.width < 100 && rect.height < 100;
                                            const isFixed = style.position === 'fixed';
                                            const isCircular = style.borderRadius === '50%';
                                            
                                            // Remove ANY small element with "N" that looks like a watermark
                                            if (text === 'N' && isSmall && (isFixed || isCircular)) {
                                                el.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important; pointer-events: none !important; width: 0 !important; height: 0 !important;';
                                                el.remove();
                                            }
                                        } catch(e) {}
                                    }, 0);
                                    
                                    return el;
                                };
                            })();
                        `,
                    }}
                />
            </head>
            <body className={`${outfit.className} antialiased`} style={{ overflowX: 'hidden' }}>
                <StoreProvider>
                    <Toaster />

                    {children}
                </StoreProvider>
            </body>
        </html>
    );
}
