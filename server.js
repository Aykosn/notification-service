import express from "express";
import notificationRouter from "./src/routes/notificationRoute.js";
import groupsRouter from "./src/routes/groupsRoute.js";
import cors from "cors";

const app = express();
// cors
app.use(cors());

app.use("/api", notificationRouter);
app.use("/api", groupsRouter);

app.listen(process.env.PORT, () => {
  console.log("Server is running!");
});