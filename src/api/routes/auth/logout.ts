import { getModule } from "@/src/api/module";
import { makeErrorResponse } from "./utils";

export const logout = async (req: Request): Promise<Response> => {
  // Assuming the userUid is passed in the request (in the headers, body, or session)
  const { userUid } = await req.json();

  if (!userUid) {
    return makeErrorResponse(400, "User UID is required!");
  }

  try {
    // Retrieve user credentials by UID
    const credentials =
      await getModule().userRepository.getUserCredentialsByUid(userUid);

    if (!credentials) {
      return makeErrorResponse(404, "User not found!");
    }

    // Remove the refresh token in the database (set it to null)
    credentials.refresh_token = null;
    await getModule().userRepository.updateCredentials(credentials);

    // Send a success response
    return new Response(JSON.stringify({}), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": "",
      },
    });
  } catch (error: any) {
    console.log(`Error while logging out: ${error}`);
    return makeErrorResponse(
      500,
      "An unexpected error occurred while logging out"
    );
  }
};
