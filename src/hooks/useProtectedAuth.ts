import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/state/hooks";
import { getMeAction, initializeFromStorage } from "@/state/authSlice";
import { tokenUtils } from "@/utils/tokenUtils";

/**
 * Custom hook to handle authentication initialization and validation for protected routes
 */
export const useProtectedAuth = () => {
  const dispatch = useAppDispatch();
  const { currentUser, isLoading, isInitialized } = useAppSelector(
    (state) => state.auth
  );

  useEffect(() => {
    // Initialize authentication state when component mounts
    if (!isInitialized) {
      dispatch(initializeFromStorage());
    }

    // If we have a token marker but no user data and not currently loading, validate with server
    if (
      tokenUtils.hasTokenMarker() &&
      !currentUser &&
      !isLoading &&
      isInitialized
    ) {
      dispatch(getMeAction());
    }
  }, [dispatch, isInitialized, currentUser, isLoading]);

  // Determine if we should show loading
  const shouldShowLoading =
    !isInitialized ||
    (tokenUtils.hasTokenMarker() && !currentUser && isLoading);

  // Determine if user is authenticated
  const isAuthenticated = !!currentUser;

  return {
    isAuthenticated,
    shouldShowLoading,
    currentUser,
  };
};
