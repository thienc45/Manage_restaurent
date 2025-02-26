// src/auth/strategies/jwt.strategy.ts
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { TokenPayload } from "src/common/types/jwt.types";
import envConfig from "src/config";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: envConfig.ACCESS_TOKEN_SECRET,
    });
  }

  async validate(payload: TokenPayload) {
    console.log(payload.role + "ancccc");

    return {
      userId: payload.userId,
      role: payload.role,
      tokenType: payload.tokenType,
    };
  }
}
