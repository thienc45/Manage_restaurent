import { registerAs } from "@nestjs/config";

import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateIf,
} from "class-validator";
import validateConfig from "src/utils/validate-config";
import { DatabaseConfig } from "./database-config.type";

class EnvironmentVariablesValidator {
  @ValidateIf((env) => env.DATABASE_URL)
  @IsString()
  DATABASE_URL?: string;

  @ValidateIf((env) => !env.DATABASE_URL)
  @IsString()
  DATABASE_TYPE: string;

  @ValidateIf((env) => !env.DATABASE_URL)
  @IsString()
  DATABASE_HOST: string;

  @ValidateIf((env) => !env.DATABASE_URL)
  @IsInt()
  @Min(0)
  @Max(65535)
  DATABASE_PORT: number;

  @ValidateIf((env) => !env.DATABASE_URL)
  @IsString()
  DATABASE_USERNAME: string;

  @ValidateIf((env) => !env.DATABASE_URL)
  @IsString()
  DATABASE_PASSWORD: string;

  @ValidateIf((env) => !env.DATABASE_URL)
  @IsString()
  DATABASE_NAME: string;

  @IsBoolean()
  @IsOptional()
  DATABASE_SYNCHRONIZE: boolean;

  @IsInt()
  @IsOptional()
  DATABASE_MAX_CONNECTIONS: number;

  @IsBoolean()
  @IsOptional()
  DATABASE_SSL_ENABLED: boolean;

  @IsBoolean()
  @IsOptional()
  DATABASE_REJECT_UNAUTHORIZED: boolean;

  @IsString()
  @IsOptional()
  DATABASE_CA: string;

  @IsString()
  @IsOptional()
  DATABASE_KEY: string;

  @IsString()
  @IsOptional()
  DATABASE_CERT: string;
}

export default registerAs<DatabaseConfig>("database", () => {
  validateConfig(
    process.env as Record<string, string>,
    EnvironmentVariablesValidator
  );

  const useUrl = !!process.env.DATABASE_URL;

  return {
    url: process.env.DATABASE_URL,
    type: (process.env.DATABASE_TYPE || "mysql") as
      | "mysql"
      | "postgres"
      | "mongodb",
    host: useUrl ? "" : process.env.DATABASE_HOST || "localhost",
    port: useUrl
      ? 3306
      : process.env.DATABASE_PORT
      ? parseInt(process.env.DATABASE_PORT, 10)
      : 3306,
    username: useUrl ? "" : process.env.DATABASE_USERNAME || "root",
    password: useUrl ? "" : process.env.DATABASE_PASSWORD || "123456",
    name: useUrl ? "" : process.env.DATABASE_NAME || "restaurant_management",
    synchronize: process.env.DATABASE_SYNCHRONIZE === "true",
    maxConnections: process.env.DATABASE_MAX_CONNECTIONS
      ? parseInt(process.env.DATABASE_MAX_CONNECTIONS, 10)
      : 100,
    sslEnabled: process.env.DATABASE_SSL_ENABLED === "true",
    rejectUnauthorized: process.env.DATABASE_REJECT_UNAUTHORIZED === "true",
    ca: process.env.DATABASE_CA,
    key: process.env.DATABASE_KEY,
    cert: process.env.DATABASE_CERT,
    isDocumentDatabase: (process.env.DATABASE_TYPE || "mysql") === "mongodb",
  };
});
