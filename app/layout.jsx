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
                                    // Method 1: Remove by all known selectors - INCLUDING THE BUTTON WATERMARK
                                    const selectors = [
                                        '[data-nextjs-dev-indicator]',
                                        '[class*="__next-dev-indicator"]',
                                        '[id*="__next-dev-indicator"]',
                                        '[data-testid="nextjs-dev-indicator"]',
                                        '[data-testid*="nextjs"]',
                                        '[class*="nextjs-dev-indicator"]',
                                        '[id*="nextjs-dev-indicator"]',
                                        '.__next-dev-indicator',
                                        '#__next-build-watcher',
                                        // Target the specific button watermark
                                        '#next-logo',
                                        'button#next-logo',
                                        'button[data-next-mark]',
                                        'button[data-next-mark="true"]',
                                        'button[data-next-mark-loading]',
                                        'button[data-next-mark-loading="false"]',
                                        'button[data-nextjs-dev-tools-button]',
                                        'button[data-nextjs-dev-tools-button="true"]',
                                        'button[aria-label="Open Next.js Dev Tools"]',
                                        '[aria-controls="nextjs-dev-tools-menu"]',
                                        // Target the SVG inside the button
                                        'svg[data-next-mark-loading]',
                                        'svg[data-next-mark-loading="false"]',
                                        'svg[viewBox="0 0 40 40"]',
                                        'svg[width="40"][height="40"]'
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
                                                
                                                // Check if it's the button watermark (FIRST PRIORITY)
                                                const isButtonWatermark = el.tagName === 'BUTTON' && (
                                                    el.id === 'next-logo' ||
                                                    el.getAttribute('data-next-mark') === 'true' ||
                                                    el.getAttribute('data-next-mark-loading') !== null ||
                                                    el.getAttribute('data-nextjs-dev-tools-button') === 'true' ||
                                                    el.getAttribute('aria-label') === 'Open Next.js Dev Tools' ||
                                                    el.getAttribute('aria-controls') === 'nextjs-dev-tools-menu'
                                                );
                                                
                                                // Check if it's the SVG watermark
                                                const isSvgWatermark = el.tagName === 'SVG' && (
                                                    el.getAttribute('data-next-mark-loading') !== null ||
                                                    el.getAttribute('viewBox') === '0 0 40 40' ||
                                                    (el.getAttribute('width') === '40' && el.getAttribute('height') === '40')
                                                );
                                                const hasN = text === 'N' || text === 'n' || innerHTML === 'N' || innerHTML === 'n';
                                                const isFixed = style.position === 'fixed' || styleAttr.includes('position: fixed') || styleAttr.includes('position:fixed');
                                                const isAbsolute = style.position === 'absolute' || styleAttr.includes('position: absolute') || styleAttr.includes('position:absolute');
                                                const isSmall = rect.width < 100 && rect.height < 100;
                                                const isCircular = style.borderRadius === '50%' || (parseFloat(style.borderRadius) > 0 && rect.width === rect.height);
                                                
                                                // Remove button watermark FIRST (highest priority)
                                                if (isButtonWatermark) {
                                                    el.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important; pointer-events: none !important; width: 0 !important; height: 0 !important; position: absolute !important; left: -9999px !important; top: -9999px !important;';
                                                    el.remove();
                                                    continue;
                                                }
                                                
                                                // Remove SVG watermark
                                                if (isSvgWatermark) {
                                                    el.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important; pointer-events: none !important; width: 0 !important; height: 0 !important; position: absolute !important; left: -9999px !important;';
                                                    el.remove();
                                                    continue;
                                                }
                                                
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
                                                const menuId = el.id === 'nextjs-dev-tools-menu' || el.getAttribute('aria-labelledby')?.includes('next');
                                                const isBlackBg = style.backgroundColor && (
                                                    style.backgroundColor.includes('rgb(0, 0, 0)') || 
                                                    style.backgroundColor.includes('rgba(0, 0, 0') ||
                                                    style.backgroundColor === 'black' ||
                                                    style.backgroundColor.includes('#000')
                                                );
                                                
                                                if (menuId || (isFixed && isBottomLeft && isBlackBg)) {
                                                    const children = el.querySelectorAll('*');
                                                    let hasNextJsContent = false;
                                                    children.forEach(child => {
                                                        const childText = (child.textContent || '').trim();
                                                        if (childText.includes('Route') || childText.includes('Turbopack') || childText.includes('Preferences') || childText.includes('Dev Tools')) {
                                                            hasNextJsContent = true;
                                                        }
                                                    });
                                                    
                                                    // Remove menu overlay or black background elements
                                                    if (menuId || hasNextJsContent || (isBlackBg && isBottomLeft && isFixed)) {
                                                        el.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important; pointer-events: none !important; width: 0 !important; height: 0 !important; position: absolute !important; left: -9999px !important; top: -9999px !important;';
                                                        el.remove();
                                                        continue;
                                                    }
                                                }
                                                
                                                // Check for black lines/borders
                                                const isBlackLine = (
                                                    (rect.height <= 2 && rect.width > 10) || // Horizontal line
                                                    (rect.width <= 2 && rect.height > 10) || // Vertical line
                                                    (style.borderColor && style.borderColor.includes('rgb(0, 0, 0)')) ||
                                                    (style.borderColor && style.borderColor.includes('black'))
                                                ) && isBottomLeft && (isFixed || isAbsolute);
                                                
                                                if (isBlackLine) {
                                                    el.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important; pointer-events: none !important; width: 0 !important; height: 0 !important; position: absolute !important; left: -9999px !important; top: -9999px !important;';
                                                    el.remove();
                                                    continue;
                                                }
                                            } catch(e) {}
                                        }
                                    } catch(e) {}
                                }
                                
                                // Run immediately and very frequently
                                if (document.readyState === 'loading') {
                                    document.addEventListener('DOMContentLoaded', function() {
                                        removeIndicator();
                                        // Run every 5ms for maximum aggressiveness
                                        setInterval(removeIndicator, 5);
                                    });
                                } else {
                                    removeIndicator();
                                    // Run every 5ms for maximum aggressiveness
                                    setInterval(removeIndicator, 5);
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
                                
                                // Intercept element creation - ENHANCED
                                const originalCreateElement = document.createElement;
                                const originalAppendChild = Node.prototype.appendChild;
                                const originalInsertBefore = Node.prototype.insertBefore;
                                
                                // Override createElement - TARGET BUTTON AND SVG WATERMARK
                                document.createElement = function(tagName, options) {
                                    const el = originalCreateElement.call(this, tagName, options);
                                    
                                    // Check immediately for button watermark (HIGHEST PRIORITY)
                                    if (tagName.toLowerCase() === 'button') {
                                        setTimeout(function() {
                                            try {
                                                const id = el.id;
                                                const dataNextMark = el.getAttribute('data-next-mark');
                                                const dataNextMarkLoading = el.getAttribute('data-next-mark-loading');
                                                const dataNextjsDevTools = el.getAttribute('data-nextjs-dev-tools-button');
                                                const ariaLabel = el.getAttribute('aria-label');
                                                const ariaControls = el.getAttribute('aria-controls');
                                                
                                                // Check if it's the Next.js button watermark
                                                if (id === 'next-logo' || 
                                                    dataNextMark === 'true' || 
                                                    dataNextMarkLoading !== null ||
                                                    dataNextjsDevTools === 'true' ||
                                                    ariaLabel === 'Open Next.js Dev Tools' ||
                                                    ariaControls === 'nextjs-dev-tools-menu') {
                                                    el.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important; pointer-events: none !important; width: 0 !important; height: 0 !important; position: absolute !important; left: -9999px !important; top: -9999px !important;';
                                                    el.remove();
                                                    return;
                                                }
                                            } catch(e) {}
                                        }, 0);
                                    }
                                    
                                    // Check immediately for SVG watermark
                                    if (tagName.toLowerCase() === 'svg') {
                                        setTimeout(function() {
                                            try {
                                                const dataAttr = el.getAttribute('data-next-mark-loading');
                                                const viewBox = el.getAttribute('viewBox');
                                                const width = el.getAttribute('width');
                                                const height = el.getAttribute('height');
                                                
                                                // Check if it's the Next.js SVG watermark
                                                if (dataAttr !== null || (viewBox === '0 0 40 40') || (width === '40' && height === '40')) {
                                                    el.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important; pointer-events: none !important; width: 0 !important; height: 0 !important; position: absolute !important; left: -9999px !important; top: -9999px !important;';
                                                    el.remove();
                                                    return;
                                                }
                                            } catch(e) {}
                                        }, 0);
                                    }
                                    
                                    // Check immediately and on next tick for other elements
                                    setTimeout(function() {
                                        try {
                                            if (!el || !el.getBoundingClientRect) return;
                                            const rect = el.getBoundingClientRect();
                                            const text = (el.textContent || '').trim();
                                            const innerHTML = (el.innerHTML || '').trim();
                                            const style = window.getComputedStyle(el);
                                            const styleAttr = el.getAttribute('style') || '';
                                            
                                            const hasN = text === 'N' || text === 'n' || innerHTML === 'N' || innerHTML === 'n';
                                            const isSmall = rect.width < 150 && rect.height < 150;
                                            const isFixed = style.position === 'fixed' || styleAttr.includes('position: fixed') || styleAttr.includes('position:fixed');
                                            const isAbsolute = style.position === 'absolute' || styleAttr.includes('position: absolute') || styleAttr.includes('position:absolute');
                                            const isCircular = style.borderRadius === '50%' || (parseFloat(style.borderRadius) > 0 && rect.width === rect.height);
                                            const isBottomLeft = rect.left < 300 && (rect.bottom < 300 || (window.innerHeight - rect.bottom) < 300);
                                            
                                            // Remove ANY element with "N" that looks like watermark
                                            if (hasN && isSmall && (isFixed || isAbsolute || isCircular || isBottomLeft)) {
                                                el.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important; pointer-events: none !important; width: 0 !important; height: 0 !important; position: absolute !important; left: -9999px !important; top: -9999px !important;';
                                                el.remove();
                                            }
                                        } catch(e) {}
                                    }, 0);
                                    
                                    return el;
                                };
                                
                                // Override appendChild to catch elements being added - TARGET BUTTON AND SVG WATERMARK
                                Node.prototype.appendChild = function(child) {
                                    try {
                                        // Check for button watermark FIRST (highest priority)
                                        if (child && child.tagName && child.tagName.toLowerCase() === 'button') {
                                            const id = child.id;
                                            const dataNextMark = child.getAttribute('data-next-mark');
                                            const dataNextMarkLoading = child.getAttribute('data-next-mark-loading');
                                            const dataNextjsDevTools = child.getAttribute('data-nextjs-dev-tools-button');
                                            const ariaLabel = child.getAttribute('aria-label');
                                            const ariaControls = child.getAttribute('aria-controls');
                                            
                                            if (id === 'next-logo' || 
                                                dataNextMark === 'true' || 
                                                dataNextMarkLoading !== null ||
                                                dataNextjsDevTools === 'true' ||
                                                ariaLabel === 'Open Next.js Dev Tools' ||
                                                ariaControls === 'nextjs-dev-tools-menu') {
                                                child.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important; pointer-events: none !important; width: 0 !important; height: 0 !important;';
                                                return child; // Return without appending
                                            }
                                        }
                                        
                                        // Check for SVG watermark
                                        if (child && child.tagName && child.tagName.toLowerCase() === 'svg') {
                                            const dataAttr = child.getAttribute('data-next-mark-loading');
                                            const viewBox = child.getAttribute('viewBox');
                                            const width = child.getAttribute('width');
                                            const height = child.getAttribute('height');
                                            
                                            if (dataAttr !== null || (viewBox === '0 0 40 40') || (width === '40' && height === '40')) {
                                                child.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important; pointer-events: none !important; width: 0 !important; height: 0 !important;';
                                                return child; // Return without appending
                                            }
                                        }
                                        
                                        // Check for "N" text elements
                                        if (child && child.textContent) {
                                            const text = child.textContent.trim();
                                            const style = window.getComputedStyle(child);
                                            const rect = child.getBoundingClientRect ? child.getBoundingClientRect() : { width: 0, height: 0, left: 0, bottom: 0 };
                                            
                                            if (text === 'N' && rect.width < 150 && rect.height < 150) {
                                                child.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important; pointer-events: none !important; width: 0 !important; height: 0 !important;';
                                                return child; // Return without appending
                                            }
                                        }
                                    } catch(e) {}
                                    return originalAppendChild.call(this, child);
                                };
                                
                                // Override insertBefore to catch elements being inserted - TARGET BUTTON AND SVG WATERMARK
                                Node.prototype.insertBefore = function(newNode, referenceNode) {
                                    try {
                                        // Check for button watermark FIRST (highest priority)
                                        if (newNode && newNode.tagName && newNode.tagName.toLowerCase() === 'button') {
                                            const id = newNode.id;
                                            const dataNextMark = newNode.getAttribute('data-next-mark');
                                            const dataNextMarkLoading = newNode.getAttribute('data-next-mark-loading');
                                            const dataNextjsDevTools = newNode.getAttribute('data-nextjs-dev-tools-button');
                                            const ariaLabel = newNode.getAttribute('aria-label');
                                            const ariaControls = newNode.getAttribute('aria-controls');
                                            
                                            if (id === 'next-logo' || 
                                                dataNextMark === 'true' || 
                                                dataNextMarkLoading !== null ||
                                                dataNextjsDevTools === 'true' ||
                                                ariaLabel === 'Open Next.js Dev Tools' ||
                                                ariaControls === 'nextjs-dev-tools-menu') {
                                                newNode.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important; pointer-events: none !important; width: 0 !important; height: 0 !important;';
                                                return newNode; // Return without inserting
                                            }
                                        }
                                        
                                        // Check for SVG watermark
                                        if (newNode && newNode.tagName && newNode.tagName.toLowerCase() === 'svg') {
                                            const dataAttr = newNode.getAttribute('data-next-mark-loading');
                                            const viewBox = newNode.getAttribute('viewBox');
                                            const width = newNode.getAttribute('width');
                                            const height = newNode.getAttribute('height');
                                            
                                            if (dataAttr !== null || (viewBox === '0 0 40 40') || (width === '40' && height === '40')) {
                                                newNode.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important; pointer-events: none !important; width: 0 !important; height: 0 !important;';
                                                return newNode; // Return without inserting
                                            }
                                        }
                                        
                                        // Check for "N" text elements
                                        if (newNode && newNode.textContent) {
                                            const text = newNode.textContent.trim();
                                            const style = window.getComputedStyle(newNode);
                                            const rect = newNode.getBoundingClientRect ? newNode.getBoundingClientRect() : { width: 0, height: 0, left: 0, bottom: 0 };
                                            
                                            if (text === 'N' && rect.width < 150 && rect.height < 150) {
                                                newNode.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important; pointer-events: none !important; width: 0 !important; height: 0 !important;';
                                                return newNode; // Return without inserting
                                            }
                                        }
                                    } catch(e) {}
                                    return originalInsertBefore.call(this, newNode, referenceNode);
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
