import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import multer from "multer";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const upload = multer({ storage: multer.memoryStorage() });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  app.post("/api/upload", upload.single("file"), async (req, res) => {
    try {
      const file = req.file;
      if (!file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const accountId = req.body.r2AccountId || process.env.R2_ACCOUNT_ID;
      const accessKeyId = req.body.r2AccessKeyId || process.env.R2_ACCESS_KEY_ID;
      const secretAccessKey = req.body.r2SecretAccessKey || process.env.R2_SECRET_ACCESS_KEY;
      const bucketName = req.body.r2BucketName || process.env.R2_BUCKET_NAME;
      const publicUrl = req.body.r2PublicUrl || process.env.R2_PUBLIC_URL;

      if (!accountId || !accessKeyId || !secretAccessKey || !bucketName) {
        return res.status(400).json({ error: "Cloudflare R2 credentials missing. Please configure them in Admin Settings." });
      }

      const client = new S3Client({
        region: "auto",
        endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
        credentials: {
          accessKeyId: accessKeyId,
          secretAccessKey: secretAccessKey,
        },
      });
      
      const fileExtension = file.originalname.split('.').pop();
      const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExtension}`;

      await client.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Key: filename,
          Body: file.buffer,
          ContentType: file.mimetype,
        })
      );

      const publicUrlBase = publicUrl || `https://${accountId}.r2.cloudflarestorage.com/${bucketName}`;
      const url = `${publicUrlBase.replace(/\/$/, '')}/${filename}`;

      res.json({ url });
    } catch (error: any) {
      console.error("Upload error:", error);
      res.status(500).json({ error: error.message || "Failed to upload file" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
