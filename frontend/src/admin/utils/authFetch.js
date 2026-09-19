const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/*
 * Prevent multiple requests from refreshing the session
 * at the same time.
 *
 * Example:
 *
 * Request A -> 401
 * Request B -> 401
 * Request C -> 401
 *
 * Only ONE refresh request is sent.
 *
 * A, B and C wait for the same refresh promise.
 */

let refreshPromise = null;

/* ==================================================
   REFRESH ACCESS TOKEN
================================================== */

const refreshAccessToken = async () => {
  /*
   * If another request is already refreshing,
   * wait for that same request.
   */
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    try {
      const response = await fetch(`${API_URL}/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        return false;
      }

      return true;
    } catch (error) {
      console.error("Refresh request failed:", error);

      return false;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};

/* ==================================================
   AUTH FETCH
================================================== */

/**
 * Use this instead of fetch() for protected admin API calls.
 *
 * It:
 *
 * 1. Sends cookies.
 * 2. Makes the normal request.
 * 3. If access token expired, refreshes it.
 * 4. Retries the original request once.
 * 5. Does NOT create an infinite refresh loop.
 */

export const authFetch = async (url, options = {}) => {
  const requestOptions = {
    ...options,

    credentials: "include",

    headers: {
      ...(options.headers || {}),
    },
  };

  let response = await fetch(url, requestOptions);

  /*
   * Normal successful response.
   */
  if (response.status !== 401) {
    return response;
  }

  /*
   * Access token may have expired.
   *
   * Try to refresh the session.
   */
  const refreshed = await refreshAccessToken();

  /*
   * Refresh failed.
   *
   * Return the original 401 response.
   *
   * The protected route / application can then
   * redirect the user to login.
   */
  if (!refreshed) {
    return response;
  }

  /*
   * Access token has been replaced.
   *
   * Retry the original request exactly once.
   */
  response = await fetch(url, requestOptions);

  return response;
};

/* ==================================================
   AUTH JSON HELPER
================================================== */

/**
 * Optional convenience helper.
 *
 * Useful for admin APIs returning JSON.
 */

export const authFetchJson = async (url, options = {}) => {
  const response = await authFetch(url, options);

  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  return {
    response,
    data,
  };
};

/* ==================================================
   LOGOUT
================================================== */

export const logoutAdmin = async () => {
  try {
    await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
  } catch (error) {
    console.error("Logout request failed:", error);
  }
};

/* ==================================================
   EXPORT API URL
================================================== */

export { API_URL };
