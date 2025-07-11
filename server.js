import express from "express";
import multer from "multer";
import { mailConfig } from "./config/mail.js";
import { storage } from "./config/storage.js";

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.post("/notify", upload.any(), async (req, res) => {
  const { recipients, schedule, message } = req.body;
  const file = req.file;
  
  if (!recipients || !schedule || !message) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  if(recipients.length === 0) {
    return res.status(400).json({ message: "Recipients are required." });
  }

  if(!Array.isArray(recipients)) {
    return res.status(400).json({ message: "Recipients must be an array." });
  }

  if(file) {
    try {
      const fileUrl = await uploadFile(file);
      return res.status(201).json({fileUrl: fileUrl});
    } catch (error) {
      return res.status(500).json({ message: "Error uploading file." });
    }
  }

  // Call google task queue

  res.status(201).json({ message: "Notification created successfully!" });
});

const uploadFile = async (file) => {
  // Check if file already exists
  const bucket = storage.bucket(process.env.GOOGLE_STORAGE_BUCKET);
  const [files] = await bucket.getFiles({
    prefix: file.originalname,
  });
  
  if(files.length > 0) {
    return `https://storage.googleapis.com/${process.env.GOOGLE_STORAGE_BUCKET}/${file.originalname}`;
  }

  // Upload file to google cloud storage
  const blob = bucket.file(file.originalname);
  const blobStream = blob.createWriteStream();

  blobStream.on("error", (err) => {
    throw new Error("Error uploading file:", err);
  });

  blobStream.end(file.buffer);

  // Get the public url of the file
  return `https://storage.googleapis.com/${process.env.GOOGLE_STORAGE_BUCKET}/${file.originalname}`;
}

app.listen(process.env.PORT, () => {
  console.log("Server is running!");
});