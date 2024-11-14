import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { STATUS_CODES } from "../constants/statusCodes";
import { tokenExtractor } from "../utils";

export const isValidRole =
  (requiredRoles: string[]) =>
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      const token = tokenExtractor(req.headers);
      if (!token || typeof token === "string") {
        res.status(STATUS_CODES.UNAUTHORIZED).json({
          success: false,
          message: "Invalid token",
        });
        return;
      }

      const userRole = (token as jwt.JwtPayload).role;
      if (!requiredRoles.includes(userRole)) {
        res.status(STATUS_CODES.FORBIDDEN).json({
          success: false,
          message: "Forbidden: You do not have the required role",
        });
        return;
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(STATUS_CODES.SERVER_ERROR).json({
        success: false,
        message: "Authorization failed due to server error!",
      });
    }
  };
