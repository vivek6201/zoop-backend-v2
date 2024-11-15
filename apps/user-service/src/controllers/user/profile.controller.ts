import { Request, RequestHandler, Response } from "express";
import { userProfileSchema, z } from "@repo/validations/src";
import prisma, { UserProfile } from "@repo/db/src";
import { tokenExtractor } from "../../utils";
import { STATUS_CODES } from "../../constants/statusCodes";
import { Token } from "../../types";

export const createUserProfileController: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const reqBody: z.infer<typeof userProfileSchema> = req.body;

  const { success, error, data } =
    await userProfileSchema.safeParseAsync(reqBody);

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

  const {id: userId} = tokenExtractor(req.headers);

  let userProfile: UserProfile | null = null;

  try {
    userProfile = await prisma.userProfile.create({
      data: {
        ...data,
        phoneNumber: data.phoneNumber.toString(),
        userId,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(STATUS_CODES.SERVER_ERROR).json({
      success: false,
      message: "Error while creating profile",
    });
    return;
  }

  res.status(STATUS_CODES.CREATED).json({
    success: true,
    message: "profile created successfully!",
    profile: userProfile,
  });
};

export const getUserController:RequestHandler = async (req: Request, res: Response) => {
  const {id: userId} = tokenExtractor(req.headers);

  try {
    const user = await prisma.user.findUnique({
      where:{
        id: userId
      }
    })

    res.status(STATUS_CODES.SUCCESS).json({
      success: true,
      data: user
    })
  } catch (error) {
    console.error(error);
    res.status(STATUS_CODES.SERVER_ERROR).json({
      success: false,
      message: "Error while fetching user details!"
    })
  }
} 

export const getUserProfileController: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const token: string = req.headers.token as string;
  const { id: userId } = JSON.parse(token) as Token;

  try {
    const profile = await prisma.userProfile.findUnique({
      where: {
        userId,
      },
    });

    res.status(STATUS_CODES.SUCCESS).json({
      success: true,
      message: "profile fetched successfully",
      profile,
    });
  } catch (error) {
    console.error(error);

    res.status(STATUS_CODES.SERVER_ERROR).json({
      success: false,
      message: "Error while getting profile!",
    });
  }
};

export const updateUserProfileController = async (
  req: Request,
  res: Response
) => {
  const reqBody: z.infer<typeof userProfileSchema> = req.body;

  const { success, error, data } = await userProfileSchema
    .partial()
    .safeParseAsync(reqBody);

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

  const { id: userId } = tokenExtractor(req.headers);

  let userProfile: UserProfile | null = null;

  try {
    userProfile = await prisma.userProfile.update({
      where: {
        userId,
      },
      data: {
        ...data,
        phoneNumber: data.phoneNumber?.toString(),
      },
    });

    res.status(STATUS_CODES.SUCCESS).json({
      success: true,
      message: "Data updated successfully!",
    });
  } catch (error) {
    console.error(error);
    res.status(STATUS_CODES.SERVER_ERROR).json({
      success: false,
      message: "Failed to update data!",
    });
  }
};
