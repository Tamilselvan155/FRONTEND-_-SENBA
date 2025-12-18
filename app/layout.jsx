import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import StoreProvider from "@/app/StoreProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

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
                                                // Just hide with CSS - never remove to avoid React conflicts
                                                if (el && el.style) {
                                                    el.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important; pointer-events: none !important; width: 0 !important; height: 0 !important; position: absolute !important; left: -9999px !important;';
                                                }
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
                                                
                                                // Hide button watermark FIRST (highest priority) - never remove to avoid React conflicts
                                                if (isButtonWatermark) {
                                                    el.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important; pointer-events: none !important; width: 0 !important; height: 0 !important; position: absolute !important; left: -9999px !important; top: -9999px !important;';
                                                    continue;
                                                }
                                                
                                                // Hide SVG watermark - never remove to avoid React conflicts
                                                if (isSvgWatermark) {
                                                    el.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important; pointer-events: none !important; width: 0 !important; height: 0 !important; position: absolute !important; left: -9999px !important;';
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
                                                    
                                                    // If it's a small circular/fixed element with "N" and not in legitimate content, hide it
                                                    if (!isInContent || (isFixed && isSmall)) {
                                                        el.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important; pointer-events: none !important; width: 0 !important; height: 0 !important; position: absolute !important; left: -9999px !important;';
                                                        continue;
                                                    }
                                                }
                                                
                                                // Also check bottom-left specifically (original check)
                                                const isBottomLeft = rect.left < 200 && (rect.bottom < 200 || (window.innerHeight - rect.bottom) < 200);
                                                if (hasN && isBottomLeft && isSmall && (isFixed || rect.left < 150)) {
                                                    el.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important; pointer-events: none !important; width: 0 !important; height: 0 !important; position: absolute !important; left: -9999px !important;';
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
                                                    
                                                    // Hide menu overlay or black background elements - never remove to avoid React conflicts
                                                    if (menuId || hasNextJsContent || (isBlackBg && isBottomLeft && isFixed)) {
                                                        el.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important; pointer-events: none !important; width: 0 !important; height: 0 !important; position: absolute !important; left: -9999px !important; top: -9999px !important;';
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
                                        // Use requestAnimationFrame for better performance
                                        let rafId;
                                        function checkAndRemove() {
                                            removeIndicator();
                                            rafId = requestAnimationFrame(checkAndRemove);
                                        }
                                        rafId = requestAnimationFrame(checkAndRemove);
                                        // Fallback: check every 500ms as backup
                                        const intervalId = setInterval(removeIndicator, 500);
                                        // Clean up after 10 seconds (indicator should be gone by then)
                                        setTimeout(() => {
                                            if (rafId) cancelAnimationFrame(rafId);
                                            clearInterval(intervalId);
                                        }, 10000);
                                    });
                                } else {
                                    removeIndicator();
                                    // Use requestAnimationFrame for better performance
                                    let rafId;
                                    function checkAndRemove() {
                                        removeIndicator();
                                        rafId = requestAnimationFrame(checkAndRemove);
                                    }
                                    rafId = requestAnimationFrame(checkAndRemove);
                                    // Fallback: check every 500ms as backup
                                    const intervalId = setInterval(removeIndicator, 500);
                                    // Clean up after 10 seconds (indicator should be gone by then)
                                    setTimeout(() => {
                                        if (rafId) cancelAnimationFrame(rafId);
                                        clearInterval(intervalId);
                                    }, 10000);
                                }
                                
                                // Use MutationObserver with debounce to avoid interfering with React
                                try {
                                    let mutationTimeout;
                                    const observer = new MutationObserver(function(mutations) {
                                        // Debounce to avoid interfering with React's render cycles
                                        clearTimeout(mutationTimeout);
                                        mutationTimeout = setTimeout(function() {
                                            // Use requestIdleCallback if available to avoid blocking React
                                            if (window.requestIdleCallback) {
                                                requestIdleCallback(function() {
                                                    removeIndicator();
                                                }, { timeout: 100 });
                                            } else {
                                                setTimeout(removeIndicator, 50);
                                            }
                                        }, 100);
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
                                                    // Don't remove here - let React manage it, just hide it
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
                                                    // Don't remove here - let React manage it, just hide it
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
                                                // Don't remove here - let React manage it, just hide it
                                            }
                                        } catch(e) {}
                                    }, 0);
                                    
                                    return el;
                                };
                                
                                // Override appendChild to catch elements being added - TARGET BUTTON AND SVG WATERMARK
                                Node.prototype.appendChild = function(child) {
                                    try {
                                        // First append the child (let React manage it)
                                        const result = originalAppendChild.call(this, child);
                                        
                                        // Then hide it if it's a watermark (but don't prevent append)
                                        if (child && child.tagName) {
                                            const tagName = child.tagName.toLowerCase();
                                            
                                            // Check for button watermark
                                            if (tagName === 'button') {
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
                                                }
                                            }
                                            
                                            // Check for SVG watermark
                                            if (tagName === 'svg') {
                                                const dataAttr = child.getAttribute('data-next-mark-loading');
                                                const viewBox = child.getAttribute('viewBox');
                                                const width = child.getAttribute('width');
                                                const height = child.getAttribute('height');
                                                
                                                if (dataAttr !== null || (viewBox === '0 0 40 40') || (width === '40' && height === '40')) {
                                                    child.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important; pointer-events: none !important; width: 0 !important; height: 0 !important;';
                                                }
                                            }
                                            
                                            // Check for "N" text elements
                                            if (child.textContent) {
                                                const text = child.textContent.trim();
                                                const style = window.getComputedStyle(child);
                                                const rect = child.getBoundingClientRect ? child.getBoundingClientRect() : { width: 0, height: 0, left: 0, bottom: 0 };
                                                
                                                if (text === 'N' && rect.width < 150 && rect.height < 150) {
                                                    child.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important; pointer-events: none !important; width: 0 !important; height: 0 !important;';
                                                }
                                            }
                                        }
                                        
                                        return result;
                                    } catch(e) {
                                        return originalAppendChild.call(this, child);
                                    }
                                };
                                
                                // Override insertBefore to catch elements being inserted - TARGET BUTTON AND SVG WATERMARK
                                Node.prototype.insertBefore = function(newNode, referenceNode) {
                                    try {
                                        // First insert the node (let React manage it)
                                        const result = originalInsertBefore.call(this, newNode, referenceNode);
                                        
                                        // Then hide it if it's a watermark (but don't prevent insert)
                                        if (newNode && newNode.tagName) {
                                            const tagName = newNode.tagName.toLowerCase();
                                            
                                            // Check for button watermark
                                            if (tagName === 'button') {
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
                                                }
                                            }
                                            
                                            // Check for SVG watermark
                                            if (tagName === 'svg') {
                                                const dataAttr = newNode.getAttribute('data-next-mark-loading');
                                                const viewBox = newNode.getAttribute('viewBox');
                                                const width = newNode.getAttribute('width');
                                                const height = newNode.getAttribute('height');
                                                
                                                if (dataAttr !== null || (viewBox === '0 0 40 40') || (width === '40' && height === '40')) {
                                                    newNode.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important; pointer-events: none !important; width: 0 !important; height: 0 !important;';
                                                }
                                            }
                                            
                                            // Check for "N" text elements
                                            if (newNode.textContent) {
                                                const text = newNode.textContent.trim();
                                                const style = window.getComputedStyle(newNode);
                                                const rect = newNode.getBoundingClientRect ? newNode.getBoundingClientRect() : { width: 0, height: 0, left: 0, bottom: 0 };
                                                
                                                if (text === 'N' && rect.width < 150 && rect.height < 150) {
                                                    newNode.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important; pointer-events: none !important; width: 0 !important; height: 0 !important;';
                                                }
                                            }
                                        }
                                        
                                        return result;
                                    } catch(e) {
                                        return originalInsertBefore.call(this, newNode, referenceNode);
                                    }
                                };
                            })();
                        `,
                    }}
                />
            </head>
            <body className={`${inter.className} antialiased`} style={{ overflowX: 'hidden' }}>
                <StoreProvider>
                    <Toaster />

                    {children}
                </StoreProvider>
            </body>
        </html>
    );
}
