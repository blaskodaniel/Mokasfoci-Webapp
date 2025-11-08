// Token management utilities
const TOKEN_KEY = "auth_token_exists";

export const tokenUtils = {
  // Mark that a token exists (without storing the actual token)
  markTokenExists: () => {
    localStorage.setItem(TOKEN_KEY, "true");
  },

  // Check if token marker exists
  hasTokenMarker: (): boolean => {
    return localStorage.getItem(TOKEN_KEY) === "true";
  },

  // Remove token marker
  removeTokenMarker: () => {
    localStorage.removeItem(TOKEN_KEY);
  },

  // Clear all auth related data
  clearAuthData: () => {
    localStorage.removeItem(TOKEN_KEY);
    // Clear any other auth-related localStorage items if needed
  },
};
