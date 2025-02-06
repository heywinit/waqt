export interface RequestOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: object;
  token?: string; // Optional token for authentication
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

// Get token from localStorage
const getAuthToken = (): string | null => {
  return localStorage.getItem("token");
};

export async function httpRequest<T>(
  url: string,
  options: RequestOptions = {}
): Promise<T> {
  try {
    // Set default method if not provided
    const method = options.method || "GET";

    // Default headers
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    // Automatically include token from localStorage if available
    const token = getAuthToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${import.meta.env.VITE_API_URL}${url}`, {
      method,
      headers,
      body: options.body ? JSON.stringify(options.body) : null,
    });

    const apiResponse: ApiResponse<T> = await response.json();

    if (!response.ok) {
      throw new Error(apiResponse.message || "An error occurred");
    }

    return apiResponse.data as T;
  } catch (error) {
    console.error("HTTP Request Error:", error);
    throw error;
  }
}

// Helper methods for common HTTP verbs

export async function get<T>(url: string): Promise<T> {
  return httpRequest<T>(url, { method: "GET" });
}

export async function post<T>(
  url: string,
  body: object | FormData,
  isFormData: boolean = false
): Promise<T> {
  const headers: Record<string, string> = {};
  let processedBody: string | FormData;

  if (isFormData) {
    processedBody = body as FormData;
  } else {
    headers["Content-Type"] = "application/json";
    processedBody = JSON.stringify(body);
  }

  const token = getAuthToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(import.meta.env.VITE_API_URL + url, {
    method: "POST",
    headers,
    body: processedBody,
  });

  const apiResponse: ApiResponse<T> = await response.json();

  if (!response.ok) {
    throw new Error(apiResponse.message || "An error occurred");
  }

  return apiResponse.data as T;
}

export async function put<T>(url: string, body: object): Promise<T> {
  return httpRequest<T>(url, { method: "PUT", body });
}

export async function del<T>(url: string): Promise<T> {
  return httpRequest<T>(url, { method: "DELETE" });
}
