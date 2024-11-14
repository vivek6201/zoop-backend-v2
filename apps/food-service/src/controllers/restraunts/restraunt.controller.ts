import { Request, RequestHandler, Response } from "express";
import { cache } from "@repo/service-config/src";
import prisma, { VendorMenu, VendorProfile } from "@repo/db/src";
import { STATUS_CODES } from "../../constants/statusCodes";

export const getAllRestrauntsController: RequestHandler = async (
  req: Request,
  res: Response
) => {
  let restruants = null;
  try {
    restruants = await cache.get("restraunts/all");
    if (restruants) {
      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: "Restraunts fetched successfully from cache!",
        data: restruants,
      });
      return;
    }
  } catch (error) {
    console.error("Error while fetching restraunts from cache", error);
  }

  try {
    restruants = await prisma.vendorProfile.findMany();
    cache.set("restraunts/all", restruants, 1500);

    res.status(STATUS_CODES.SUCCESS).json({
      success: true,
      message: "Restraunts fetched successfully from db!",
      data: restruants,
    });
    return;
  } catch (error) {
    console.error(error);
    res.status(STATUS_CODES.SERVER_ERROR).json({
      success: false,
      message: "Error while fetching restraunts data from db!",
    });
    return;
  }
};

export const getRestrauntDetailsController: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { id: vendorProfileId } = req.params;

  let restraunt: VendorProfile | null = null;

  try {
    restraunt = await cache.get(`restraunts/${vendorProfileId}`);

    if (restraunt) {
      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: "Restraunt data fetched successfully",
        data: restraunt,
      });
      return;
    }
  } catch (error) {
    console.error("Error while fetching restraunt from cache", error);
  }

  try {
    restraunt = await prisma.vendorProfile.findUnique({
      where: {
        id: vendorProfileId,
      },
      include: {
        _count: {
          select: {
            reviews: true,
          },
        },
      },
    });

    cache.set(`restraunts/${vendorProfileId}`, restraunt, 1500);

    res.status(STATUS_CODES.SUCCESS).json({
      success: true,
      message: "Data fetched successfully from db!",
      data: restraunt,
    });

    return;
  } catch (error) {
    console.error(error);
    res.status(STATUS_CODES.SERVER_ERROR).json({
      success: false,
      message: "Error while fetching restraunt data from db!",
    });
    return;
  }
};

export const getRestrauntMenuController: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { id: vendorProfileId } = req.params;

  let menu: VendorMenu | null = null;

  try {
    menu = await cache.get(`restraunts/${vendorProfileId}-menu`);

    if (menu) {
      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: "Menu fetched successfully from cache!",
        data: menu,
      });
      return;
    }
  } catch (error) {
    console.error("Error while fetching menu from cache!", error);
  }

  try {
    menu = await prisma.vendorMenu.findUnique({
      where: {
        vendorProfileId,
      },
      include: {
        categories: true,
        vendorDish: true,
      },
    });
    cache.set(`restraunts/${vendorProfileId}-menu`, menu, 1500);

    res.status(STATUS_CODES.SUCCESS).json({
      success: true,
      message: "menu fetched successfully from db!",
      data: menu,
    });
  } catch (error) {
    console.error(error);
    res.status(STATUS_CODES.SERVER_ERROR).json({
      success: false,
      message: "Error while fetching data from DB!",
    });
  }
};
