import { v2 as cloudinary } from "cloudinary";
import dotenv from 'dotenv';
import path from 'path';
import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import fs from 'fs';
import os from 'os';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

export const uploadFiles = async (buffer: Buffer, fileName: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const tempFilePath = path.join(os.tmpdir(), fileName);

    fs.writeFile(tempFilePath, buffer, (writeError) => {
      if (writeError) {
        reject(writeError);
        return;
      }

      cloudinary.uploader.upload(tempFilePath, (uploadError: UploadApiErrorResponse | undefined, result: UploadApiResponse) => {
        fs.unlink(tempFilePath, (unlinkError) => {
          if (unlinkError) {
            console.error('Failed to delete temporary file:', unlinkError);
          }
        });

        if (uploadError) {
          reject(new Error(uploadError.message));
        } else {
          const uploadResult: string = result.secure_url;
          resolve(uploadResult);
        }
      });
    });
  });
};

