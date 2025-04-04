import { getModule } from "@/api/module";
import { AuthError, AuthResult } from "@/api/auth/AuthService";
import { TokenPayLoad } from "@/api/auth/JWTService";

const validateCredentials = (email: string, password: string): boolean => {
  const emailValid = /^[A-Za-z0-9]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  const passwordValid = password.length > 0;
  return emailValid && passwordValid;
};

function isAuthResult(result: AuthResult | AuthError): result is AuthResult {
  return (result as AuthResult).userUid !== undefined;
}

export const login = async (req: Request): Promise<Response> => {
  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(
      JSON.stringify({
        type: "Error",
        message: "Invalid JSON format.",
      }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const { userEmail, password } = body;

  if (!validateCredentials(userEmail, password)) {
    return new Response(
      JSON.stringify({
        type: "Error",
        message: "Invalid Credentials Provided",
      }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  let loginResult;
  try {
    loginResult = await getModule().authService.loginUser(userEmail, password);
  } catch {
    return new Response(
      JSON.stringify({
        type: "Error",
        message: "An error occurred during login.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  if (isAuthResult(loginResult)) {
    const tokenPayload: TokenPayLoad = {
      userUid: loginResult.userUid,
      userRole: loginResult.userRole,
    };

    try {
      const credentials =
        await getModule().userRepository.getUserCredentialsByUid(
          tokenPayload.userUid
        );

      if (!credentials) {
        return new Response(
          JSON.stringify({
            type: "Error",
            message: "User credentials not found.",
          }),
          { status: 404, headers: { "Content-Type": "application/json" } }
        );
      }

      const accessToken = await getModule().jwtService.issueAccessToken(
        tokenPayload
      );
      const refreshToken = await getModule().jwtService.issueRefreshToken(
        tokenPayload
      );

      credentials.last_login = loginResult.lastLogin;
      credentials.refresh_token = refreshToken;
      await getModule().userRepository.updateCredentials(credentials);

      return new Response(
        JSON.stringify({
          userUid: loginResult.userUid,
          lastLogin: loginResult.lastLogin,
          accessToken,
          refreshToken,
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } catch {
      return new Response(
        JSON.stringify({
          type: "Error",
          message: "Error retrieving or updating credentials.",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }

  // AuthError
  if (loginResult instanceof AuthError) {
    return new Response(
      JSON.stringify({
        type: "Error",
        message: loginResult.message || "Authentication failed.",
      }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  // Unexpected case
  return new Response(
    JSON.stringify({
      type: "Error",
      message: "Unexpected error occurred.",
    }),
    { status: 500, headers: { "Content-Type": "application/json" } }
  );
};
