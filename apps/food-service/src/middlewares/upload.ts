import { NextFunction, Request, RequestHandler, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure upload directory exists
const ensureUploadDirectory = (directory: string) => {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
};

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "./uploads/temp";
    ensureUploadDirectory(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

// Enhanced file filter
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/heic",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Unsupported file type. Allowed types: ${allowedMimeTypes.join(", ")}`
      )
    );
  }
};

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 1, // Maximum 1 file
  },
  fileFilter: (req, file, cb) => {
    fileFilter(req, file, (err) => {
      if (err) {
        // Explicitly call the callback with the error
        return cb(err);
      }
      cb(null, true);
    });
  },
});

// Enhanced middleware to attach file to body
export const attachFileToBody = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.file) {
      req.body.dishImage = {
        ...req.file,
        path: req.file.path.replace(/\\/g, "/"), // Normalize path for cross-platform
      };
    }
    next();
  } catch (error) {
    next(error);
  }
};

export const singleUploadMiddleware = (fieldName: string): RequestHandler[] => [
  upload.single(fieldName),
  attachFileToBody,
];
