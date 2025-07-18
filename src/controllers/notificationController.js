import { createTask } from "../../config/task.js";
import { spaceCardSchema } from "../../config/space.js";
import uploadFile from "../services/uploadFile.js";
import authenticate from "../services/auth.js";

export const notify = async (req, res) => {
  const { notificationType, recipients, schedule, message } = req.body;
  const file = req.files[0];

  const accessToken = await authenticate();

  let fileUrl;
  
  if (!notificationType || !recipients || !schedule || !message) {
    return res.status(400).json({ error: true, message: "Missing required fields." });
  }

  if(recipients.length === 0) {
    return res.status(400).json({ error: true, message: "Recipients are required." });
  }

  if(!Array.isArray(recipients)) {
    return res.status(400).json({ error: true, message: "Recipients must be an array." });
  }

  if(notificationType !== "email" && notificationType !== "spaces") {
    return res.status(400).json({ error: true, message: "Invalid notification type." });
  }

  if(schedule && isNaN(new Date(schedule).getTime())) {
    return res.status(400).json({ error: true, message: "Invalid schedule date." });
  }

  if(file) {
    try {
      fileUrl = await uploadFile(file);
      console.log(fileUrl);
    } catch (error) {
      // Debug
      console.error(error);
      return res.status(500).json({ error: true, message: "Error uploading file." });
    }
  }

  if(notificationType === "email") {
    for(const recipient of recipients) {
      // TODO: Schedule task to send email to recipient
      const response = await createTask(schedule, accessToken.token, process.env.SENDGRID_API_URL, {});
      // Debug
      console.log(response);
    }
  }

  if(notificationType === "spaces") {
    for(const recipient of recipients) {
      // TODO: Schedule task to send spaces notification
      const url = `https://chat.googleapis.com/v1/${recipient}/messages`;

      try {
        const spaceBody = spaceCardSchema(message, fileUrl);
        const response = await createTask(schedule, accessToken.token, url, spaceBody);
        console.log(response);
      } catch (err) {
        // Debug
        console.error(err);
        return res.status(500).json({ error: true, message: "Error sending spaces notification." });
      }
    }
  }

  return res.status(201).json({ error: false, message: "Notification created successfully!" });
}