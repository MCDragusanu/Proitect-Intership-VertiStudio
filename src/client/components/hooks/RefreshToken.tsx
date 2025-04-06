import { useState, useEffect } from 'react';
import { RefreshTokens } from '../../activities/RefreshToken';
export interface RefreshTokenResponse {
  userUid: string;
  lastLogin: string;
  accessToken: string;
  errorMessage?: string;
}

export interface UseRefreshTokenReturn {
  accessToken: string | null;
  refreshTokenError: string | null;
  refreshTokenLoading: boolean;
}

export const useRefreshToken = (currentToken: string | null): UseRefreshTokenReturn => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshTokenError, setRefreshTokenError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // Define the async function inside useEffect
    const refreshTokens = async () => {
      try {
        setLoading(true);
        setRefreshTokenError(null); // Reset previous errors

        // Assuming you have a function called RefreshTokens that will handle the refresh logic
        const { userUid, lastLogin, accessToken, errorMessage }= 
          await RefreshTokens(currentToken || "EXPIRED");

        // If there's an error message, handle it here
        if (errorMessage) {
          setRefreshTokenError(errorMessage);
          console.error("Error refreshing token:", errorMessage);
          return;
        }

        // Save the tokens and user information to localStorage and sessionStorage
        localStorage.setItem("userUid", userUid || "Something bad happened!");
        sessionStorage.setItem("accessToken", accessToken || "Even worse");

        // Update the state
        setAccessToken(accessToken);
      } catch (error) {
        console.error("Error during token refresh:", error);
        setRefreshTokenError("Failed to refresh the token");
      } finally {
        setLoading(false);
      }
    };

    // Only refresh tokens if currentToken exists
    if (currentToken) {
      refreshTokens();
    } else {
      console.log("Access token is missing or expired");
    }
  }, [currentToken]);

  return { accessToken, refreshTokenError, refreshTokenLoading: loading };
};
