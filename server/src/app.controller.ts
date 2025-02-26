import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";
import { MailService } from "./mailer/mailer.service";

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly mailService: MailService
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get("send-email")
  async sendEmail() {
    await this.mailService.sendEmail(
      "receiver@example.com",
      "Chào mừng bạn!",
      "Cảm ơn bạn đã đăng ký sử dụng dịch vụ của chúng tôi."
    );
    return "Email đã được gửi!";
  }
}
