import { GoogleAuth } from "google-auth-library";

const SCOPES = ["https://www.googleapis.com/auth/chat.bot"];

async function authenticate() {
  const auth = new GoogleAuth({
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    scopes: SCOPES
  });

  const client = await auth.getClient();
  const accessToken = await client.getAccessToken();

  return accessToken;
}

export default authenticate;