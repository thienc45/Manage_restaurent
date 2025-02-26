// src/mailer/mailer.service.ts
import { MailerService as NestMailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";

@Injectable()
export class MailService {
  constructor(private readonly mailerService: NestMailerService) {}

  async sendEmail(to: string, subject: string, body: string) {
    try {
      await this.mailerService.sendMail({
        to,
        subject,
        text: body, // Nội dung dạng text
        html: `<p>${body}</p>`, // Nội dung dạng HTML
      });
      console.log("✅ Email đã gửi thành công!");
    } catch (error) {
      console.error("❌ Lỗi khi gửi email:", error);
      throw new Error("Gửi email thất bại");
    }
  }
}
