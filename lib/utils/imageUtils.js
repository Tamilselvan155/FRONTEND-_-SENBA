/**
 * Constructs a full image URL from a relative path or returns the URL as-is if it's already complete
 * @param {string} imagePath - The image path (can be relative or full URL)
 * @returns {string} - The full image URL
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath || imagePath === 'null' || imagePath === 'undefined' || imagePath === '') {
    return null;
  }

  const path = String(imagePath).trim();

  // If it's already a full URL, check if it has /api/ in it and remove it
  if (path.startsWith('http://') || path.startsWith('https://')) {
    // Remove /api/ from the path if present (legacy data fix)
    const url = new URL(path);
    if (url.pathname.startsWith('/api/uploads/')) {
      url.pathname = url.pathname.replace('/api/uploads/', '/uploads/');
    }
    
    // Replace localhost URLs with production backend URL in production
    const isProduction = process.env.NODE_ENV === 'production' || 
                        (typeof window !== 'undefined' && 
                         window.location.hostname !== 'localhost' && 
                         window.location.hostname !== '127.0.0.1');
    
    if (isProduction && (url.hostname === 'localhost' || url.hostname === '127.0.0.1')) {
      // Replace localhost with production backend URL
      const productionBackend = process.env.NEXT_PUBLIC_API_URL || 'https://backend-senba-1.onrender.com';
      const backendUrl = new URL(productionBackend.replace(/\/+$/, ''));
      url.protocol = backendUrl.protocol;
      url.hostname = backendUrl.hostname;
      url.port = backendUrl.port || '';
    }
    
    return url.toString();
  }

  // Construct full URL from relative path
  // Get base URL from environment variable
  let baseURL = process.env.NEXT_PUBLIC_API_URL;
  
  // If no environment variable is set
  if (!baseURL) {
    // Check if we're in production (both SSR and client-side)
    const isProduction = process.env.NODE_ENV === 'production' || 
                        (typeof window !== 'undefined' && 
                         window.location.hostname !== 'localhost' && 
                         window.location.hostname !== '127.0.0.1');
    
    if (isProduction) {
      // In production, use production backend URL as fallback
      // This ensures images work even if env var is not set (though it should be)
      baseURL = 'https://backend-senba-1.onrender.com';
      
      // Log warning in development console (client-side only)
      if (typeof window !== 'undefined') {
        console.warn('NEXT_PUBLIC_API_URL is not set in production! Using fallback backend URL.');
        console.warn('Please set NEXT_PUBLIC_API_URL=https://backend-senba-1.onrender.com in your Render environment variables.');
      }
    } else {
      // Development fallback
      baseURL = 'http://localhost:3001';
    }
  }
  
  // Remove trailing slash from baseURL
  baseURL = baseURL.replace(/\/+$/, '');
  
  // Remove /api from baseURL if present (static files are served from /uploads, not /api/uploads)
  if (baseURL.endsWith('/api')) {
    baseURL = baseURL.slice(0, -4);
  } else if (baseURL.endsWith('/api/')) {
    baseURL = baseURL.slice(0, -5);
  }
  
  // Ensure path doesn't start with /api/uploads/ (legacy fix)
  let cleanPath = path.startsWith('/') ? path : `/${path}`;
  if (cleanPath.startsWith('/api/uploads/')) {
    cleanPath = cleanPath.replace('/api/uploads/', '/uploads/');
  }
  
  return `${baseURL}${cleanPath}`;
};

