// src/lib/api/advertisements.ts
import { API_CONFIG } from "./config";

export interface Advertisement {
  id: number;
  title: string;
  external_link: string;
  image: string;
  target_user: string;
  status: string;
  start_date: string;
  end_date: string;
  created_at: string;
}

export interface CreateAdvertisementRequest {
  title: string;
  external_link: string;
  image: File | string; // Allow both File and base64 string
  target_user: string;
  status: string;
  start_date: string;
  end_date: string;
}

export interface UpdateAdvertisementRequest {
  title?: string;
  external_link?: string;
  image?: File | string; // Allow both File and base64 string
  target_user?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
}

// Helper function to convert base64 to File
const base64ToFile = (base64: string, filename: string): File => {
  const arr = base64.split(",");
  const mime = arr[0].match(/:(.*?);/)?.[1] || "image/png";
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};

// Helper function to get file extension from base64
const getFileExtensionFromBase64 = (base64: string): string => {
  const mimeType = base64.split(",")[0].match(/:(.*?);/)?.[1];
  switch (mimeType) {
    case "image/jpeg":
    case "image/jpg":
      return ".jpg";
    case "image/png":
      return ".png";
    case "image/webp":
      return ".webp";
    default:
      return ".png";
  }
};

class AdvertisementAPI {
  private baseUrl = API_CONFIG.BASE_URL;

  private getAuthHeaders() {
    const token = localStorage.getItem("auth-token");
    return {
      Authorization: token ? `Bearer ${token}` : "",
    };
  }

  // Helper method to process image input (File or base64 string)
  private processImageInput(
    image: File | string,
    fallbackFilename: string = "advertisement"
  ): File {
    if (image instanceof File) {
      return image;
    }

    // If it's a base64 string, convert it to File
    if (typeof image === "string" && image.startsWith("data:")) {
      const extension = getFileExtensionFromBase64(image);
      const filename = `${fallbackFilename}${extension}`;
      return base64ToFile(image, filename);
    }

    throw new Error(
      "Image must be either a File object or a valid base64 string"
    );
  }

  async getAll(): Promise<Advertisement[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/advertisements/`, {
        method: "GET",
        headers: {
          ...this.getAuthHeaders(),
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch advertisements: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  }

  async getLatest(): Promise<Advertisement[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/advertisements/latest/`,
        {
          method: "GET",
          headers: {
            ...this.getAuthHeaders(),
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch latest advertisements: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  }

  // Enhanced create method with base64 and File support
  async create(data: CreateAdvertisementRequest): Promise<Advertisement> {
    try {
      // Process the image input (handles both File and base64 string)
      const imageFile = this.processImageInput(
        data.image,
        `advertisement_${Date.now()}`
      );

      const formData = new FormData();

      // Append all fields to FormData
      formData.append("title", data.title);
      formData.append("external_link", data.external_link);
      formData.append("image", imageFile, imageFile.name);
      formData.append("target_user", data.target_user);
      formData.append("status", data.status);
      formData.append("start_date", data.start_date);
      formData.append("end_date", data.end_date);

      const response = await fetch(`${this.baseUrl}/api/advertisements/`, {
        method: "POST",
        headers: {
          ...this.getAuthHeaders(),
          // Don't set Content-Type header - let the browser set it with boundary for multipart/form-data
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to create advertisement: ${response.status} ${response.statusText}. ${errorText}`
        );
      }

      const result = await response.json();
      return result;
    } catch (error) {
      throw error;
    }
  }

  // Enhanced update method with base64 and File support
  async update(
    id: number,
    data: UpdateAdvertisementRequest
  ): Promise<Advertisement> {
    try {
      const formData = new FormData();

      // Only append fields that are provided and have changed
      if (data.title !== undefined) {
        formData.append("title", data.title);
      }
      if (data.external_link !== undefined) {
        formData.append("external_link", data.external_link);
      }
      if (data.target_user !== undefined) {
        formData.append("target_user", data.target_user);
      }
      if (data.status !== undefined) {
        formData.append("status", data.status);
      }
      if (data.start_date !== undefined) {
        formData.append("start_date", data.start_date);
      }
      if (data.end_date !== undefined) {
        formData.append("end_date", data.end_date);
      }

      // Handle image update if provided
      if (data.image !== undefined) {
        const imageFile = this.processImageInput(
          data.image,
          `advertisement_update_${id}_${Date.now()}`
        );
        formData.append("image", imageFile, imageFile.name);
      }

      // Using PUT method instead of POST for update
      const response = await fetch(
        `${this.baseUrl}/api/advertisements/${id}/`,
        {
          method: "PUT",
          headers: {
            ...this.getAuthHeaders(),
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to update advertisement: ${response.status} ${response.statusText}`
        );
      }

      const result = await response.json();
      return result;
    } catch (error) {
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/advertisements/${id}/`,
        {
          method: "DELETE",
          headers: {
            ...this.getAuthHeaders(),
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to delete advertisement: ${response.status} ${response.statusText}`
        );
      }
    } catch (error) {
      throw error;
    }
  }
}

export const AdvertisementsAPI = new AdvertisementAPI();
