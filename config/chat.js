import { ChatServiceClient } from "@google-apps/chat";

export const chatClient = new ChatServiceClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});