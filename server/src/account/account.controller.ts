import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from "@nestjs/common";
import { RefreshTokenService } from "src/refresh-token/refresh-token.service";
import { AccountService } from "./account.service";
import { AcountRegisterLoginDto } from "./dto/account-register-login.dto";
import { UpdateEmployeeAccountDto } from "./dto/update.account.dto";

@Controller("account")
export class AccountController {
  constructor(
    private readonly accountService: AccountService,
    private readonly refreshTokenService: RefreshTokenService
  ) {}

  @Post("register")
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() body: AcountRegisterLoginDto) {
    return this.accountService.createEmployeeAccount(body);
  }

  @Post("login")
  @HttpCode(HttpStatus.CREATED)
  async login(@Body() body: AcountRegisterLoginDto) {
    return this.accountService.loginAuth(body);
  }

  @Put(":id")
  @HttpCode(HttpStatus.OK)
  async updateAccount(
    @Param("id", ParseIntPipe) accountId: number,
    @Body() body: UpdateEmployeeAccountDto
  ) {
    return this.accountService.updateEmployeeAccount(accountId, body);
  }

  @Post("refresh-token")
  async refreshToken(@Body("refreshToken") refreshToken: string) {
    return this.refreshTokenService.refreshToken(refreshToken);
  }
}
