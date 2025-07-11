import { Storage } from "@google-cloud/storage";

export const storage = new Storage({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
});