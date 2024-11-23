import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

export interface CloudinaryResponse {
  success: boolean;
  data?: {
    url: string;
    publicId: string;
    format: string;
  };
  error?: string;
}

export class Cloudinary {
  private static _instance: Cloudinary;
  private isConfigured: boolean = false;

  private constructor() {}

  private async configure() {
    if (this.isConfigured) return;

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_KEY;
    const apiSecret = process.env.CLOUDINARY_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      throw new Error("Missing Cloudinary credentials");
    }

    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });

    this.isConfigured = true;
  }

  public static getInstance(): Cloudinary {
    if (!this._instance) {
      this._instance = new Cloudinary();
    }
    return this._instance;
  }

  public async uploadImage(
    file: {
      fieldname: string;
      originalname: string;
      encoding: string;
      mimetype: string;
      destination: string;
      filename: string;
      path: string;
      size: number;
    },
    folderName: string
  ): Promise<CloudinaryResponse> {
    try {
      //configuring cloudinary lazily to load all configs successfully!
      this.configure();

      if (!file) {
        throw new Error("No file provided");
      }

      const result = await cloudinary.uploader.upload(file.path, {
        folder: folderName,
        resource_type: "auto",
      });

      // Clean up temporary file
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }

      return {
        success: true,
        data: {
          url: result.secure_url,
          publicId: result.public_id,
          format: result.format,
        },
      };
    } catch (error) {
      if (file && fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
      throw new Error(`Upload failed: ${(error as Error).message}`);
    }
  }
}

export const cloudinaryClient = Cloudinary.getInstance();

export * from "cloudinary";
