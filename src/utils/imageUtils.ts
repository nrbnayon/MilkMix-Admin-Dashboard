// src/utils/imageUtils.ts

/**
 * Get the base URL for assets from environment variables
 * Fallback to localhost if not defined
 */
export const getAssetsBaseUrl = (): string => {
  return process.env.NEXT_PUBLIC_ASSETS_BASE_URL || "http://localhost:8002";
};

/**
 * Construct full image URL from relative path
 * @param imagePath - Relative image path from API
 * @param fallbackImage - Optional fallback image URL
 * @returns Full image URL or fallback
 */
export const getImageUrl = (
  imagePath: string | null | undefined,
  fallbackImage?: string
): string => {
  if (!imagePath) {
    return fallbackImage || "";
  }

  // If imagePath is already a full URL, return as is
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  // Remove leading slash if present to avoid double slashes
  const cleanPath = imagePath.startsWith("/") ? imagePath.slice(1) : imagePath;

  return `${getAssetsBaseUrl()}/${cleanPath}`;
};

/**
 * Get profile picture URL with fallback
 * @param profilePicture - Profile picture path from API
 * @returns Full profile picture URL
 */
export const getProfilePictureUrl = (
  profilePicture: string | null | undefined
): string => {
  return getImageUrl(profilePicture, "");
};

/**
 * Get avatar URL with fallback
 * @param avatar - Avatar path from API
 * @returns Full avatar URL
 */
export const getAvatarUrl = (avatar: string | null | undefined): string => {
  return getImageUrl(avatar, "");
};

/**
 * Validate if image URL is accessible
 * @param imageUrl - Image URL to validate
 * @returns Promise<boolean>
 */
export const validateImageUrl = async (imageUrl: string): Promise<boolean> => {
  try {
    const response = await fetch(imageUrl, { method: "HEAD" });
    return response.ok;
  } catch {
    return false;
  }
};

/**
 * Get optimized image URL with dimensions
 * @param imagePath - Original image path
 * @param width - Desired width
 * @param height - Desired height
 * @returns Optimized image URL
 */
export const getOptimizedImageUrl = (
  imagePath: string | null | undefined,
  width?: number,
  height?: number
): string => {
  const baseUrl = getImageUrl(imagePath);

  if (!width && !height) {
    return baseUrl;
  }

  const params = new URLSearchParams();
  if (width) params.set("w", width.toString());
  if (height) params.set("h", height.toString());

  return `${baseUrl}?${params.toString()}`;
};
