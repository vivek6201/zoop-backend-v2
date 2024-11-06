import EmailService from ".";
import { generateEmailHtml } from "../../lib/utils";

type IType = "Login" | "Verify" | "Signup";

const sendAuthEmail = async (
  reciever: string,
  emailType: IType,
  data?: Record<string, any>
) => {
  const emailClient = new EmailService();

  switch (emailType) {
    case "Login": {
      console.log("Login case:", { reciever, data });
      // send login email
      break;
    }
    case "Signup": {
      console.log("Signup case:", { reciever, data });
      // send account creation email
      break;
    }
    case "Verify": {
      const htmlContent = await generateEmailHtml(data?.otp);

      if (!htmlContent) {
        console.log("No HTML content generated");
        return;
      }
      emailClient.sendEmail(
        "Zoop <onboarding@codershub.live>",
        reciever,
        "Verification Email",
        htmlContent
      );
      break;
    }
    default:
      console.log("Unknown email type:", emailType);
  }
};

export default sendAuthEmail;
