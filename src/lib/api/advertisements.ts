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
  image: File;
  target_user: string;
  status: string;
  start_date: string;
  end_date: string;
}

export interface UpdateAdvertisementRequest {
  title?: string;
  external_link?: string;
  image?: File;
  target_user?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
}

class AdvertisementAPI {
  private baseUrl = API_CONFIG.BASE_URL;

  private getAuthHeaders() {
    const token = localStorage.getItem("auth-token");
    return {
      Authorization: token ? `Bearer ${token}` : "",
    };
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
      console.log("Fetched advertisements from API:", data);
      return data;
    } catch (error) {
      console.error("Error fetching advertisements:", error);
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
      console.log("Fetched latest advertisements from API:", data);
      return data;
    } catch (error) {
      console.error("Error fetching latest advertisements:", error);
      throw error;
    }
  }

  async create(data: CreateAdvertisementRequest): Promise<Advertisement> {
    try {
      console.log("Creating advertisement with data:", data);

      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("external_link", data.external_link);
      formData.append("image", data.image);
      formData.append("target_user", data.target_user);
      formData.append("status", data.status);
      formData.append("start_date", data.start_date);
      formData.append("end_date", data.end_date);

      console.log("Sending FormData to API:", {
        title: data.title,
        external_link: data.external_link,
        target_user: data.target_user,
        status: data.status,
        start_date: data.start_date,
        end_date: data.end_date,
        image: data.image.name,
      });

      const response = await fetch(`${this.baseUrl}/api/advertisements/`, {
        method: "POST",
        headers: {
          ...this.getAuthHeaders(),
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          "Create advertisement failed:",
          response.status,
          response.statusText,
          errorText
        );
        throw new Error(
          `Failed to create advertisement: ${response.status} ${response.statusText}`
        );
      }

      const result = await response.json();
      console.log("Advertisement created successfully:", result);
      return result;
    } catch (error) {
      console.error("Error creating advertisement:", error);
      throw error;
    }
  }

  async update(
    id: number,
    data: UpdateAdvertisementRequest
  ): Promise<Advertisement> {
    try {
      console.log("Updating advertisement with id:", id, "data:", data);

      const formData = new FormData();

      // Only append fields that are provided
      if (data.title !== undefined) formData.append("title", data.title);
      if (data.external_link !== undefined)
        formData.append("external_link", data.external_link);
      if (data.image !== undefined) formData.append("image", data.image);
      if (data.target_user !== undefined)
        formData.append("target_user", data.target_user);
      if (data.status !== undefined) formData.append("status", data.status);
      if (data.start_date !== undefined)
        formData.append("start_date", data.start_date);
      if (data.end_date !== undefined)
        formData.append("end_date", data.end_date);

      console.log(
        "Sending FormData to update API:",
        Object.fromEntries(formData.entries())
      );

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
        console.error(
          "Update advertisement failed:",
          response.status,
          response.statusText,
          errorText
        );
        throw new Error(
          `Failed to update advertisement: ${response.status} ${response.statusText}`
        );
      }

      const result = await response.json();
      console.log("Advertisement updated successfully:", result);
      return result;
    } catch (error) {
      console.error("Error updating advertisement:", error);
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    try {
      console.log("Deleting advertisement with id:", id);

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
        console.error(
          "Delete advertisement failed:",
          response.status,
          response.statusText,
          errorText
        );
        throw new Error(
          `Failed to delete advertisement: ${response.status} ${response.statusText}`
        );
      }

      console.log("Advertisement deleted successfully");
    } catch (error) {
      console.error("Error deleting advertisement:", error);
      throw error;
    }
  }
}

export const AdvertisementsAPI = new AdvertisementAPI();
