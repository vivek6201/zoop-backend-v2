import prisma from "@repo/db/src";
import { cache, getProductKey } from "@repo/service-config/src";

const getProductDetails = async (productId: string) => {
  try {
    let data = await cache.get(getProductKey(productId));

    if (!data) {
      data = await prisma.vendorDish.findUnique({
        where: {
          id: productId,
        },
        include: {
          category: true,
        },
      });
      cache.set(getProductKey(productId), data, 1000);
    }

    return {
      success: true,
      message: "Product details fetched successfully!",
      data,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Failed to get product details!",
    };
  }
};

export const getVendorDetails = async (profileId: string) => {
  try {
    const vendor = await prisma.vendorProfile.findUnique({
      where: {
        id: profileId,
      },
      select: {
        user: true,
      },
    });

    return {
      success: true,
      message: "Vendor data fetched successfully!",
      data: vendor?.user,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Failed to get vendor details!",
    };
  }
};

export default getProductDetails;
