import { CloudTasksClient } from "@google-cloud/tasks";

const client = new CloudTasksClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

export const createTask = async (schedule, token, url, payload) => {
  const project = process.env.GOOGLE_CLOUD_PROJECT;
  const queue = process.env.GOOGLE_CLOUD_QUEUE;
  const location = process.env.GOOGLE_CLOUD_LOCATION;

  console.log({ project, location, queue });

  const request = {
    parent: client.queuePath(project, location, queue),
    task: {
      scheduleTime: { seconds: Math.floor(new Date(schedule).getTime() / 1000), nanos: 0 },
      httpRequest: {
        httpMethod: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        url: url,
        body: Buffer.from(JSON.stringify(payload)).toString("base64"),
      }
    }
  }

  return await client.createTask(request);
}