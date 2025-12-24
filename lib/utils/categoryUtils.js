/**
 * Shared category utility functions for consistent category handling
 * across CategoryNavBar, ProductFilters, and CategoryProductsFilter components
 */

/**
 * Normalize category name for consistent matching
 * Handles camelCase, hyphens, spaces, and converts to lowercase
 * @param {string} str - Category name to normalize
 * @returns {string} Normalized category name
 */
export const normalizeCategoryName = (str) => {
  if (!str || typeof str !== 'string') return '';
  
  return str.trim()
    .replace(/([A-Z])/g, ' $1') // Add space before capital letters (camelCase handling)
    .toLowerCase()
    .replace(/-/g, ' ') // Replace hyphens with spaces
    .replace(/\s+/g, ' ') // Normalize multiple spaces to single space
    .trim();
};

/**
 * Extract category name from product object
 * Priority: categoryId.parentId.title → categoryId.title (if isParent) → category field
 * @param {object} product - Product object from API
 * @returns {string} Extracted category name in Title Case format
 */
export const extractProductCategory = (product) => {
  if (!product) return '';
  
  let categoryName = '';
  
  // First, try to get from categoryId.parentId (parent category)
  if (product.categoryId && typeof product.categoryId === 'object') {
    // Check if categoryId has a populated parentId (this is the parent category)
    if (product.categoryId.parentId && typeof product.categoryId.parentId === 'object') {
      // Use parent category's title, englishName, or slug
      categoryName = product.categoryId.parentId.title || 
                    product.categoryId.parentId.englishName || 
                    product.categoryId.parentId.slug || 
                    '';
    } 
    // If categoryId itself is a parent category (isParent === true)
    else if (product.categoryId.isParent === true || product.categoryId.isParent === 'true') {
      categoryName = product.categoryId.title || 
                    product.categoryId.englishName || 
                    product.categoryId.slug || 
                    '';
    }
    // Fallback: use categoryId title even if it's a subcategory
    else if (product.categoryId.title) {
      categoryName = product.categoryId.title;
    }
  }
  
  // Fallback to category field if categoryId didn't provide a name
  if (!categoryName || categoryName.trim() === '') {
    if (typeof product.category === 'string' && product.category.trim() !== '') {
      categoryName = product.category;
    } else if (product.category?.title) {
      categoryName = product.category.title;
    } else if (product.category?.englishName) {
      categoryName = product.category.englishName;
    }
  }
  
  // Format to Title Case (add space before capital letters, then trim)
  if (categoryName) {
    categoryName = categoryName.replace(/([A-Z])/g, ' $1').trim();
  }
  
  return categoryName || '';
};

/**
 * Get display name from category object
 * Formats camelCase to Title Case for consistent display
 * @param {object} category - Category object from Redux store
 * @returns {string} Formatted display name
 */
export const getCategoryDisplayName = (category) => {
  if (!category || typeof category !== 'object') return '';
  
  const name = category.title || category.englishName || '';
  if (!name) return '';
  
  // Format camelCase to Title Case (add space before capital letters)
  return name.replace(/([A-Z])/g, ' $1').trim();
};

/**
 * Match two category names using normalized comparison
 * Supports exact match and word-by-word match
 * @param {string} name1 - First category name
 * @param {string} name2 - Second category name
 * @returns {boolean} True if names match
 */
export const matchCategoryNames = (name1, name2) => {
  if (!name1 || !name2) return false;
  
  const normalized1 = normalizeCategoryName(name1);
  const normalized2 = normalizeCategoryName(name2);
  
  // Priority 1: Exact match
  if (normalized1 === normalized2) return true;
  
  // Priority 2: Word-by-word exact match (all words must match)
  const words1 = normalized1.split(' ').filter(w => w.length > 0);
  const words2 = normalized2.split(' ').filter(w => w.length > 0);
  
  if (words1.length > 0 && words2.length > 0) {
    // Check if all words from one category are in the other AND vice versa
    const allWords1In2 = words1.every(word => words2.includes(word));
    const allWords2In1 = words2.every(word => words1.includes(word));
    
    // Only match if all words match in both directions
    if (allWords1In2 && allWords2In1) {
      return true;
    }
    
    // Priority 3: Single word match (for cases like "Motor" matching "motor")
    // Only allow this if one is a single word to prevent false matches
    if (words1.length === 1 && words2.includes(words1[0])) {
      return true;
    }
    if (words2.length === 1 && words1.includes(words2[0])) {
      return true;
    }
  }
  
  return false;
};

/**
 * Get category slug for URL generation
 * Prioritizes slug from database, then title, then englishName
 * @param {object} category - Category object from Redux store
 * @returns {string} Category slug for URL
 */
export const getCategorySlug = (category) => {
  if (!category || typeof category !== 'object') {
    return '';
  }
  
  // First priority: use slug from database if available (most reliable)
  const categorySlug = category.slug;
  if (categorySlug && typeof categorySlug === 'string' && categorySlug.trim() !== '') {
    const trimmedSlug = categorySlug.trim();
    if (trimmedSlug.length > 0) {
      return trimmedSlug;
    }
  }
  
  // Second priority: use title (backend matches title case-insensitively)
  const categoryTitle = category.title;
  if (categoryTitle && typeof categoryTitle === 'string' && categoryTitle.trim() !== '') {
    const trimmedTitle = categoryTitle.trim();
    if (trimmedTitle.length > 0) {
      return trimmedTitle;
    }
  }
  
  // Third priority: use englishName if title is not available
  const categoryEnglishName = category.englishName;
  if (categoryEnglishName && typeof categoryEnglishName === 'string' && categoryEnglishName.trim() !== '') {
    const trimmedEnglishName = categoryEnglishName.trim();
    if (trimmedEnglishName.length > 0) {
      return trimmedEnglishName;
    }
  }
  
  return '';
};

/**
 * Get subcategory slug for URL generation
 * @param {object} subcategory - Subcategory object
 * @returns {string} Subcategory slug for URL
 */
export const getSubcategorySlug = (subcategory) => {
  if (!subcategory || typeof subcategory !== 'object') {
    return '';
  }
  
  // First priority: use slug from database
  if (subcategory.slug && typeof subcategory.slug === 'string' && subcategory.slug.trim() !== '') {
    return subcategory.slug.trim();
  }
  
  // Fallback: generate from englishName or title
  const name = subcategory.englishName || subcategory.title || '';
  if (name && typeof name === 'string') {
    return name.toLowerCase().replace(/\s+/g, '-');
  }
  
  return '';
};

/**
 * Find matching category from categories array by URL parameter
 * @param {string} urlCategoryName - Category name from URL parameter
 * @param {array} categoriesData - Array of categories from Redux store
 * @returns {object|null} Matching category object or null
 */
export const findCategoryByUrlParam = (urlCategoryName, categoriesData) => {
  if (!urlCategoryName || !categoriesData || !Array.isArray(categoriesData)) {
    return null;
  }
  
  const decodedCategoryName = decodeURIComponent(urlCategoryName);
  const normalizedUrlParam = normalizeCategoryName(decodedCategoryName);
  
  // Find matching category - try exact matches first
  let matchingCategory = categoriesData.find(cat => {
    if (!cat || cat.status !== 'active' || !cat.isParent) return false;
    
    const catSlug = normalizeCategoryName(cat.slug || '');
    const catTitle = normalizeCategoryName(cat.title || '');
    const catEnglishName = normalizeCategoryName(cat.englishName || '');
    
    // Exact match on slug, title, or englishName
    return catSlug === normalizedUrlParam || 
           catTitle === normalizedUrlParam || 
           catEnglishName === normalizedUrlParam;
  });
  
  return matchingCategory || null;
};

