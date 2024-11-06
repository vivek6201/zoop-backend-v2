import { Request, RequestHandler, Response } from "express";
import prisma, { User } from "@repo/db/src";
import jwt from "jsonwebtoken";
import { generateOtp, verifyOtp } from "../../helper/otp";
import { STATUS_CODES } from "../../constants/statusCodes";
import { loginSchema, z } from "@repo/validations/src";
import { redisActions } from "../../helper/redis-actions";

const loginController: RequestHandler = async (req: Request, res: Response) => {
  const reqBody: z.infer<typeof loginSchema> = req.body;
  const queryType: {
    sendOtp?: boolean;
    verifyOtp?: boolean;
  } = req.query;

  const { success, data, error } = await loginSchema.safeParseAsync(reqBody);

  if (!success) {
    res.status(STATUS_CODES.FORBIDDEN).json({
      success,
      message: error.issues.map((issue) => {
        return {
          path: issue.path[0],
          message: issue.message,
        };
      }),
    });
    return;
  }

  let user: User | null = null;

  try {
    user = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(STATUS_CODES.SERVER_ERROR).json({
      success: false,
      message: "Error while verifying user!, please try after sometime :(",
    });
    return;
  }

  if (!user) {
    res.status(STATUS_CODES.NOT_FOUND).json({
      success: false,
      message: "User not found!, please signup to continue",
    });
    return;
  }

  if (queryType.sendOtp) {
    try {
      const Otp = {
        otp: generateOtp(),
        userEmail: data.email,
        expiresAt: new Date(new Date().getTime() + 5 * 60 * 1000), // 5 minutes from now
      };
      await prisma.otp.create({
        data: Otp,
      });

      // deligate this to a email service by it pushing to a queue.
      await redisActions("utility", {
        action: "auth-email",
        data: {
          reciever: data.email,
          emailType: "Verify",
          data: { otp: Otp.otp },
        },
      });

      // request is not failing if client not found, fix this

      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: "Otp sent Successfully",
      });
      return;
    } catch (error) {
      console.error(error);
      res.status(STATUS_CODES.SERVER_ERROR).json({
        success: false,
        message: "Error while sending verification email!",
      });
      return;
    }
  } else {
    if (!data.otp) {
      res.status(STATUS_CODES.UNAUTHORIZED).json({
        success: false,
        message: "Otp is required!",
      });
      return;
    }
    const status = await verifyOtp(data.otp, data.email);

    if (!status) {
      res.status(STATUS_CODES.UNAUTHORIZED).json({
        success: false,
        message: "Otp Invalid or Expired",
      });
      return;
    }

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      res.status(STATUS_CODES.SERVER_ERROR).json({
        success: false,
        message: "jwt secret not found!",
      });
      return;
    }

    const payload = { email: user.email, id: user.id, role: user.role };

    const token: string = jwt.sign(payload, jwtSecret);

    res.status(STATUS_CODES.SUCCESS).json({
      success: true,
      message: "Login Successful",
      token: token,
    });
    return;
  }
};

export default loginController;
