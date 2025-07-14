import express from "express";
import multer from "multer";
import stream from "stream";
import { chatClient } from "./config/chat.js";
import { storage } from "./config/storage.js";
import { spaceCardSchema } from "./config/space.js";

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.post("/notify", upload.any(), async (req, res) => {
  const { notificationType, recipients, schedule, message } = req.body;
  const file = req.files[0];

  let fileUrl;
  
  if (!notificationType || !recipients || !schedule || !message) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  if(recipients.length === 0) {
    return res.status(400).json({ message: "Recipients are required." });
  }

  if(!Array.isArray(recipients)) {
    return res.status(400).json({ message: "Recipients must be an array." });
  }

  if(notificationType !== "email" && notificationType !== "spaces") {
    return res.status(400).json({ message: "Invalid notification type." });
  }

  if(file) {
    try {
      fileUrl = await uploadFile(file);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error uploading file." });
    }
  }

  if(notificationType === "email") {
    for(const recipient of recipients) {
      // TODO: Schedule task to send email to recipient
    }
  }

  if(notificationType === "spaces") {
    for(const recipient of recipients) {
      // TODO: Schedule task to send spaces notification
      try {
        const spaceBody = spaceCardSchema(message, fileUrl);
        const response = await chatClient.createMessage({
          parent: recipient,
          message: spaceBody,
        });

        console.log(response);
      } catch (err) {
        // Debug
        console.error(err);
        return res.status(500).json({ message: "Error sending spaces notification." });
      }
    }
  }

  // Call google task queue

  res.status(201).json({ message: "Notification created successfully!", fileUrl: fileUrl });
});

const uploadFile = async (file) => {
  // Check if file already exists
  const bucket = storage.bucket(process.env.GOOGLE_STORAGE_BUCKET);
  const [files] = await bucket.getFiles({
    prefix: file.originalname,
  });
  
  if(files.length > 0) {
    return files[0].publicUrl();
  }

  // Upload file to google cloud storage
  const blob = bucket.file(file.originalname);

  try {
    const passthroughStream = new stream.PassThrough();
    passthroughStream.write(file.buffer);
    passthroughStream.end();
    passthroughStream.pipe(blob.createWriteStream()).on("error", (err) => {
      throw new Error(err.message);
    });

    return blob.publicUrl();
  } catch (err) {
    console.error(err);
    throw new Error(err.message);
  }
}

app.listen(process.env.PORT, () => {
  console.log("Server is running!");
});