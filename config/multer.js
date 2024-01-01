import multer from "multer";
import path from "path";
import aws from "aws-sdk";
import multerS3 from "multer-s3";
import { S3Client } from "@aws-sdk/client-s3"; // Importando a versão 3 do AWS SDKz

aws.config.update({
  accessKeyId: "AKIA3ABQJDVB7GFU27HV",
  secretAccessKey: "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",
  region: "sa-east-1",
});

const s3Client = new S3Client({
  credentials: {
    accessKeyId: "AKIA3ABQJDVB7GFU27HV",
    secretAccessKey: "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",
  },
  region: "sa-east-1",
});

const upload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: "postagram-bucket",
    key(req, file, callback) {
      callback(null, Date.now() + path.extname(file.originalname));
    },
  }),
});

export default upload;
