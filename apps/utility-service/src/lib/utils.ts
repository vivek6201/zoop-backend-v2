import path from "path";
import { readFile } from "fs/promises";

export async function generateEmailHtml(
  otp: string
): Promise<string | undefined> {
  try {
    const templatePath = path.join(
      __dirname,
      "../src/templates/verificationEmail.html"
    );
    let templateContent = await readFile(templatePath, "utf-8");
    templateContent = templateContent.replace("{{OTP}}", otp);
    return templateContent;
  } catch (error) {
    console.error(error);
  }
}
