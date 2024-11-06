import { Resend } from "resend";

class EmailService {
  private resend: Resend;

  constructor() {
    this.resend = new Resend(process.env.RESEND_KEY);
  }

  async sendEmail(
    sender: string,
    reciever: string,
    subject: string,
    content: string
  ) {
    const { data, error } = await this.resend.emails.send({
      from: sender,
      to: [reciever],
      subject,
      html: content,
    });

    if (error) {
      throw new Error(`Failed to send email: ${error.message}`);
    }

    return data;
  }
}

export default EmailService;
