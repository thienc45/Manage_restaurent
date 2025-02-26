import {
  PrivateKey,
  SignerOptions,
  createSigner,
  createVerifier,
} from "fast-jwt";
import { Duration } from "luxon"; // Import luxon để sử dụng Duration.fromISO
import { TokenType } from "src/common/constants/typecontants";
import { TokenPayload } from "src/common/types/jwt.types";
import envConfig from "src/config";

// Hàm chuyển đổi chuỗi như '1h' thành đối tượng thời gian Luxon
const parseDuration = (duration: string) => {
  const match = duration.match(/^(\d+)([a-z]+)$/); // Kiểm tra xem chuỗi có phải là số + đơn vị thời gian
  if (!match) {
    throw new Error("Invalid duration format");
  }

  const value = parseInt(match[1], 10);
  const unit = match[2];

  // Chuyển đổi sang đơn vị thời gian trong luxon
  switch (unit) {
    case "h":
      return Duration.fromObject({ hours: value });
    case "d":
      return Duration.fromObject({ days: value });
    case "m":
      return Duration.fromObject({ minutes: value });
    case "s":
      return Duration.fromObject({ seconds: value });
    default:
      throw new Error("Unsupported time unit");
  }
};

// Hàm tạo Access Token
export const signAccessToken = (
  payload: Pick<TokenPayload, "userId" | "role"> & { exp?: number },
  options?: SignerOptions
) => {
  const { exp } = payload;

  // Tính toán thời gian hết hạn nếu không có exp
  const optionSigner: Partial<
    SignerOptions & { key: string | Buffer | PrivateKey }
  > = exp
    ? {
        key: envConfig.ACCESS_TOKEN_SECRET,
        algorithm: "HS256",
        ...options,
      }
    : {
        key: envConfig.ACCESS_TOKEN_SECRET,
        algorithm: "HS256",
        expiresIn: parseDuration(envConfig.ACCESS_TOKEN_EXPIRES_IN).as(
          "milliseconds"
        ),
        ...options,
      };

  const signSync = createSigner(optionSigner);
  return signSync({ ...payload, tokenType: TokenType.AccessToken });
};

// Hàm tạo Refresh Token
export const signRefreshToken = (
  payload: Pick<TokenPayload, "userId" | "role"> & { exp?: number },
  options?: SignerOptions
) => {
  const { exp } = payload;

  // Tính toán thời gian hết hạn nếu không có exp
  const optionSigner: Partial<
    SignerOptions & { key: string | Buffer | PrivateKey }
  > = exp
    ? {
        key: envConfig.REFRESH_TOKEN_SECRET,
        algorithm: "HS256",
        ...options,
      }
    : {
        key: envConfig.REFRESH_TOKEN_SECRET,
        algorithm: "HS256",
        expiresIn: parseDuration(envConfig.REFRESH_TOKEN_EXPIRES_IN).as(
          "milliseconds"
        ),
        ...options,
      };

  const signSync = createSigner(optionSigner);
  return signSync({ ...payload, tokenType: TokenType.RefreshToken });
};

// Hàm kiểm tra Access Token
export const verifyAccessToken = (token: string) => {
  const verifySync = createVerifier({
    key: envConfig.ACCESS_TOKEN_SECRET,
  });
  return verifySync(token) as TokenPayload;
};

// Hàm kiểm tra Refresh Token
export const verifyRefreshToken = (token: string) => {
  const verifySync = createVerifier({
    key: envConfig.REFRESH_TOKEN_SECRET,
  });
  return verifySync(token) as TokenPayload;
};
