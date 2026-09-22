const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

let refreshPromise = null;

/* ==================================================
   REFRESH ACCESS TOKEN
================================================== */

const refreshAccessToken = async () => {
  if (!refreshPromise) {
    refreshPromise = fetch(`${API_URL}/api/auth/refresh`, {
      method: "POST",
      credentials: "include",
    })
      .then(async (response) => {
        let data = null;

        try {
          data = await response.json();
        } catch {
          data = null;
        }

        if (!response.ok) {
          const error = new Error(data?.message || "Session refresh failed");

          error.status = response.status;
          error.data = data;

          throw error;
        }

        return data;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

/* ==================================================
   AUTHENTICATED FETCH
================================================== */

export const adminFetch = async (path, options = {}, retry = true) => {
  const requestOptions = {
    ...options,
    credentials: "include",

    headers: {
      ...(options.headers || {}),
    },
  };

  let response = await fetch(`${API_URL}${path}`, requestOptions);

  /*
   * Access token expired.
   *
   * Refresh once, then retry the original request.
   */
  if (response.status === 401 && retry && path !== "/api/auth/refresh") {
    try {
      await refreshAccessToken();

      response = await fetch(`${API_URL}${path}`, requestOptions);
    } catch (error) {
      throw error;
    }
  }

  return response;
};

/* ==================================================
   PARSE JSON
================================================== */

export const adminJson = async (path, options = {}) => {
  const response = await adminFetch(path, options);

  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const error = new Error(data?.message || "Request failed");

    error.status = response.status;
    error.data = data;

    throw error;
  }

  return data;
};

/* ==================================================
   LOGIN
================================================== */

export const adminLogin = async (email, password) => {
  return adminJson("/api/auth/login", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      email,
      password,
    }),
  });
};

/* ==================================================
   CURRENT ADMIN
================================================== */

export const getCurrentAdmin = async () => {
  return adminJson("/api/auth/me", {
    method: "GET",
  });
};

/* ==================================================
   LOGOUT
================================================== */

export const adminLogout = async () => {
  return adminJson("/api/auth/logout", {
    method: "POST",
  });
};

/* ==================================================
   LOGOUT ALL SESSIONS
================================================== */

export const adminLogoutAll = async () => {
  return adminJson("/api/auth/logout-all", {
    method: "POST",
  });
};

/* ==================================================
   API URL
================================================== */

export { API_URL };
