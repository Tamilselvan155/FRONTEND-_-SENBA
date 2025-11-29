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
      return url.toString();
    }
    return path;
  }

  // Construct full URL from relative path
  let baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  
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

