import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RoleType } from "src/common/constants/typecontants";
import { TokenPayload } from "src/common/types/jwt.types";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "src/utils/jwt";
import { LessThan, Repository } from "typeorm";
import { CreateRefreshTokenDto } from "./dto/refreshtoken.type";
import { RefreshToken } from "./refresh-token.entity/refreshtoken.dto";

@Injectable()
export class RefreshTokenService {
  constructor(
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>
  ) {}

  async removeExpiredTokens(): Promise<void> {
    try {
      await this.refreshTokenRepository.delete({
        expiresAt: LessThan(new Date()), // Xóa các token có expiresAt nhỏ hơn thời gian hiện tại
      });
      console.log("Expired refresh tokens removed successfully.");
    } catch (error) {
      console.error("Error removing expired refresh tokens:", error);
    }
  }

  async createRefreshToken(dto: CreateRefreshTokenDto): Promise<RefreshToken> {
    const newRefreshToken = this.refreshTokenRepository.create(dto);
    console.log(newRefreshToken);
    return this.refreshTokenRepository.save(newRefreshToken);
  }

  async refreshToken(refreshToken: string) {
    let decodedRefreshToken: TokenPayload;

    // Verify the refresh token
    try {
      decodedRefreshToken = verifyRefreshToken(refreshToken);
    } catch (error) {
      throw new UnauthorizedException("Refresh token không hợp lệ");
    }

    // Find the refresh token in the database
    const refreshTokenDoc = await this.refreshTokenRepository.findOne({
      where: { token: refreshToken },
      relations: ["account"], // Include the related account data
    });

    if (!refreshTokenDoc) {
      throw new UnauthorizedException("Refresh token không hợp lệ");
    }

    const account = refreshTokenDoc.account;

    // Generate new access and refresh tokens
    const newAccessToken = signAccessToken({
      userId: account.id,
      role: account.role as RoleType,
    });

    const newRefreshToken = signRefreshToken({
      userId: account.id,
      role: account.role as RoleType,
      exp: decodedRefreshToken.exp, // Preserve expiration time
    });

    // Delete old refresh token and save new one
    await this.refreshTokenRepository.delete({ token: refreshToken });

    await this.refreshTokenRepository.save({
      account,
      token: newRefreshToken,
      expiresAt: refreshTokenDoc.expiresAt,
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }
}
