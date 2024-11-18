import { Request, RequestHandler, Response } from "express";
import { tokenExtractor } from "@repo/service-config/src";
import prisma, { VendorProfile } from "@repo/db/src";
import { STATUS_CODES } from "../constants/statusCodes";
import { vendorProfileSchema, z } from "@repo/validations/src";

export const createVendorProfileController: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const reqBody: z.infer<typeof vendorProfileSchema> = req.body;

  const { success, error, data } =
    await vendorProfileSchema.safeParseAsync(reqBody);

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

  const token = tokenExtractor(req.headers);
  const { id: userId } = token;

  let vendorProfile: VendorProfile | null = null;

  try {
    vendorProfile = await prisma.vendorProfile.create({
      data: {
        ...data,
        phoneNumber: data.phoneNumber.toString(),
        userId,
        vendorMenu: {
          create: {},
        },
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
    profile: vendorProfile,
  });
};

export const getVendorController: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { id } = tokenExtractor(req.headers);

  try {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });
    res.status(STATUS_CODES.SUCCESS).json({
      success: true,
      message: "User data fetched successfully!",
      data: user,
    });
  } catch (error) {
    console.error(error);
    res.status(STATUS_CODES.SERVER_ERROR).json({
      success: false,
      message: "Error occurred while fetching user data!",
    });
  }
};

export const updateVendorProfileController: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const reqBody: z.infer<typeof vendorProfileSchema> = req.body;

  const { success, error, data } = await vendorProfileSchema
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

  let vendorProfile: VendorProfile | null = null;

  try {
    vendorProfile = await prisma.vendorProfile.update({
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

export const getVendorProfileController: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const token = tokenExtractor(req.headers);
  const { id: userId } = token;

  try {
    const profile = await prisma.vendorProfile.findUnique({
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
