import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RefreshTokenCronJob } from "./refresh-token-cron-job.service";
import { RefreshTokenController } from "./refresh-token.controller";
import { RefreshToken } from "./refresh-token.entity/refreshtoken.dto";
import { RefreshTokenService } from "./refresh-token.service";

@Module({
  imports: [TypeOrmModule.forFeature([RefreshToken])],
  controllers: [RefreshTokenController],
  providers: [RefreshTokenService, RefreshTokenCronJob],
  exports: [RefreshTokenService], // Export if needed
})
export class RefreshTokenModule {}
