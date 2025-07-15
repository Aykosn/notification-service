import { storage } from "../../config/storage.js";

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

export default uploadFile;