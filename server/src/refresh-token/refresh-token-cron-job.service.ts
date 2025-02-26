import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { RefreshTokenService } from "./refresh-token.service";

@Injectable()
export class RefreshTokenCronJob {
  private readonly logger = new Logger(RefreshTokenCronJob.name);

  constructor(private readonly refreshTokenService: RefreshTokenService) {}

  @Cron(CronExpression.EVERY_HOUR) // Chạy mỗi giờ
  async handleCron() {
    this.logger.debug("Running cron job to remove expired refresh tokens...");
    await this.refreshTokenService.removeExpiredTokens();
  }
}
