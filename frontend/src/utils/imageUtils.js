/**
 * Utility functions for handling product image paths and arrays.
 */

export const getProductImages = (imgProp) => {
  if (!imgProp) return [];
  if (Array.isArray(imgProp)) return imgProp.filter(Boolean);
  
  if (typeof imgProp === 'string') {
    const trimmed = imgProp.trim();
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          return parsed.filter(Boolean);
        }
      } catch (e) {
        // Fallback to single string if JSON parsing fails
      }
    }
    return trimmed ? [trimmed] : [];
  }
  return [];
};

export const getFirstProductImage = (imgProp) => {
  const images = getProductImages(imgProp);
  return images.length > 0 ? images[0] : '';
};

export const getImageUrl = (imageName) => {
  if (!imageName) return '';
  if (imageName.startsWith('http://') || imageName.startsWith('https://') || imageName.startsWith('blob:')) {
    return imageName;
  }
  if (imageName.startsWith('/uploads/')) {
    return `http://localhost:5000${imageName}`;
  }
  if (imageName.startsWith('uploads/')) {
    return `http://localhost:5000/${imageName}`;
  }
  // If it is a relative frontend asset
  if (imageName.startsWith('/assets/') || imageName.startsWith('assets/')) {
    return imageName.startsWith('/') ? imageName : `/${imageName}`;
  }
  return `http://localhost:5000/uploads/${encodeURIComponent(imageName)}`;
};
