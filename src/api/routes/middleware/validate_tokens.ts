import {
    extractAccessToken,
    extractRefreshToken,
    isTokenPayLoad,
  } from "../../../api/routes/auth/utils";
  import { getModule } from "../../../api/module";
  import { JWTExpired, JWTInvalid } from "../../../api/auth/JWTService";
  import { TokenPayLoad } from "../../../api/auth/JWTService";

export const validateTokens = async (req: Request, routeUserUid: string) => {
   
    const accessToken = extractAccessToken(req);
    const refreshToken = extractRefreshToken(req);
  
  
    // Check if tokens are missing
    if (!accessToken || !refreshToken) {
    
      return new Response("Action Prohibited! Accessing protected resources!", {
        status: 405,
        headers: { "Content-Type": "application/json" },
      });
    }
  
    try {
      const accessPayload = await getModule().jwtService.extractPayloadFromAccessToken(accessToken);
  
    
  
      // Handle invalid access token
      if (accessPayload instanceof JWTInvalid) {
        console.log("Error: Invalid access token.");
        return new Response("Action Prohibited! Accessing protected resources!", {
          status: 405,
          headers: { "Content-Type": "application/json" },
        });
      }
      
      // Handle expired access token
      else if (accessPayload instanceof JWTExpired) {
        console.log("Error: Access token expired.");
        return new Response("Token expired! Must be refreshed!", {
          status: 402,
          headers: { "Content-Type": "application/json" },
        });
      }
      
      // Handle the case where token UID doesn't match the route UID
      else {
        const tokenUserUid = (accessPayload as TokenPayLoad).userUid;
      
        if (tokenUserUid !== routeUserUid) {
          console.log(`Error: Token user UID (${tokenUserUid}) does not match route user UID (${routeUserUid}).`);
          return new Response("Action Prohibited! Accessing protected resources!", {
            status: 405,
            headers: { "Content-Type": "application/json" },
          });
        }
      }
    } catch (error) {
      // Log any error that occurs during token extraction or other validation steps
      console.log("Error during token validation:", error);
      return new Response("Internal Server Error", {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  
    // All token validation checks passed
    console.log("Token validation passed.");
    return null;
  };