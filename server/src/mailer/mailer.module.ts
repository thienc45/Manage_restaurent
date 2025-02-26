// src/mailer/mailer.module.ts
import { MailerModule as NestMailerModule } from "@nestjs-modules/mailer";
import { Module } from "@nestjs/common";
import { MailService } from "./mailer.service";

@Module({
  imports: [
    NestMailerModule.forRoot({
      transport: {
        host: "smtp.gmail.com", // SMTP của Gmail
        port: 587,
        secure: false, // false cho TLS, true cho SSL
        auth: {
          user: "doanducthien123@gmail.com",
          pass: "dmia ebke pwam tzhr",
        },
      },
      defaults: {
        from: '"NestJS" doanducthien123@gmail.com', // Tên hiển thị
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailerModuleSend {}
