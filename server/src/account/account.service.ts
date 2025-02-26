import { Injectable, UnauthorizedException, UnprocessableEntityException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RoleType } from "src/common/constants/typecontants";
import { CreateRefreshTokenDto } from "src/refresh-token/dto/refreshtoken.type";
import { RefreshToken } from "src/refresh-token/refresh-token.entity/refreshtoken.dto";
import { RefreshTokenService } from "src/refresh-token/refresh-token.service";
import { Socket } from "src/socket/socket.entity/socket.type";
import { comparePassword, hashPassword } from "src/utils/crypto";
import {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "src/utils/jwt";
import { Repository } from "typeorm";
import { Account } from "./account.entity/account.entity";
import { AcountRegisterLoginDto } from "./dto/account-register-login.dto";
import { AccountEmailLoginDto } from "./dto/acount-email-login.dto";
import { UpdateEmployeeAccountDto } from "./dto/update.account.dto";

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,

    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,

    @InjectRepository(Socket)
    private socketRepository: Repository<Socket>,

    private readonly refreshTokenService: RefreshTokenService
  ) {}

  async createEmployeeAccount(body: AcountRegisterLoginDto) {
    const { email, password, name } = body;
    const convertPassWord = hashPassword(password);

    // Kiểm tra email đã tồn tại chưa
    const userExists = await this.accountRepository.findOneBy({ email });
    if (userExists) {
      throw new UnprocessableEntityException([
        {
          field: "email",
          message: "Email đã tồn tại",
        },
      ]);
    }

    // Tạo tài khoản mới
    const newUser = this.accountRepository.create({
      email: email,
      password: await convertPassWord,
      name: name,
      // role: Role.Owner,
    });
    await this.accountRepository.save(newUser);

    return { message: "Tạo tài khoản thành công", user: newUser };
  }

  async loginAuth(body: AccountEmailLoginDto) {
    // Tìm tài khoản dựa trên email
    const account = await this.accountRepository.findOne({
      where: { email: body.email },
    });

    // Nếu không tìm thấy tài khoản với email đó
    if (!account) {
      throw new UnprocessableEntityException([
        { field: "email", message: "Email không tồn tại" },
      ]);
    }

    // Kiểm tra mật khẩu
    const isPasswordMatch = await comparePassword(
      body.password,
      account.password
    );
    if (!isPasswordMatch) {
      throw new UnprocessableEntityException([
        { field: "password", message: "Email hoặc mật khẩu không đúng" },
      ]);
    }

    // Tạo Access Token
    const accessToken = signAccessToken({
      userId: account.id,
      role: account.role as RoleType, // Đảm bảo role có kiểu hợp lệ
    });

    // Tạo Refresh Token
    const refreshToken = signRefreshToken({
      userId: account.id,
      role: account.role as RoleType, // Đảm bảo role có kiểu hợp lệ
    });

    // Giải mã Refresh Token để lấy thông tin về thời gian hết hạn
    // const decodedRefreshToken = verifyRefreshToken(refreshToken);
    // const refreshTokenExpiresAt = new Date(decodedRefreshToken.exp * 1000);

    const decodedRefreshToken = verifyRefreshToken(refreshToken);

    if (!decodedRefreshToken || typeof decodedRefreshToken.exp !== "number") {
      throw new Error("Invalid refresh token: expiration time is invalid");
    }
    const refreshTokenExpiresAt = new Date(decodedRefreshToken.exp * 1000);

    // Lưu Refresh Token vào cơ sở dữ liệu
    const createRefreshTokenDto = {
      accountId: account.id,
      expiresAt: refreshTokenExpiresAt,
      token: refreshToken,
      createdAt: new Date(),
    };

    await this.refreshTokenService.createRefreshToken(
      createRefreshTokenDto as CreateRefreshTokenDto
    );

    // Trả về account cùng với Access Token và Refresh Token
    return {
      message: "Đăng nhập thành công",
      account,
      accessToken,
      refreshToken,
    };
  }

  async updateEmployeeAccount(
    accountId: number,
    body: UpdateEmployeeAccountDto
  ) {
    // 1. Kiểm tra tài khoản có tồn tại không
    const account = await this.accountRepository.findOne({
      where: { id: accountId },
    });

    if (!account) {
      throw new UnprocessableEntityException([
        {
          field: "email",
          message: "Tài khoản này không tồn tại",
        },
      ]);
    }

    // 2. Lấy socketId của tài khoản
    const socketRecord = await this.socketRepository.findOne({
      where: { accountId },
    });
    const socketId = socketRecord?.socketId ?? null; // Lấy socketId hoặc null nếu không có

    // 3. Kiểm tra email đã tồn tại (nếu thay đổi email)
    if (body.email && body.email !== account.email) {
      const existingAccount = await this.accountRepository.findOne({
        where: { email: body.email },
      });
      if (existingAccount) {
        throw new UnprocessableEntityException([
          {
            field: "email",
            message: "Email đã được sử dụng",
          },
        ]);
      }
    }

    // 4. Mã hóa mật khẩu nếu có yêu cầu đổi mật khẩu
    let hashedPassword = account.password; // Giữ mật khẩu cũ
    if (body.changePassword && body.password) {
      hashedPassword = await hashPassword(body.password);
    }

    // 5. Chuẩn bị dữ liệu cập nhật
    const updateData = {
      name: body.name ?? account.name,
      avatar: body.avatar ?? account.avatar,
      email: body.email ?? account.email,
      role: body.role ?? account.role,
      password: hashedPassword,
    };

    // 6. Cập nhật tài khoản
    try {
      await this.accountRepository.update(accountId, updateData);
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") {
        throw new UnprocessableEntityException([
          {
            field: "email",
            message: "Email đã tồn tại",
          },
        ]);
      }
      throw error; // Ném lỗi khác nếu không phải lỗi trùng lặp
    }

    // 7. Trả về kết quả cập nhật
    return {
      message: "Cập nhật tài khoản thành công",
      accountId,
      updatedFields: Object.keys(updateData),
      socketId, // Trả về socketId để có thể xử lý real-time nếu cần
    };
  }

  async deleteAccount(accountId: number) {
    // Find the socket record associated with the account
    const socketRecord = await this.socketRepository.findOne({
      where: { accountId },
    });

    if (!socketRecord) {
      throw new Error("Socket record not found for this account.");
    }

    // Delete the account record
    const account = await this.accountRepository.delete(accountId);

    return {
      account,
      socketId: socketRecord.socketId,
    };
  }

  async getMe(accountId: number) {
    try {
      // Find the account by accountId, ensuring it exists
      const account = await this.accountRepository.findOneOrFail({
        where: { id: accountId },
      });

      return account;
    } catch (error) {
      // Throwing a custom error if the account is not found
      throw new Error("Account not found");
    }
  }
  async getFromToken(token: string) {
    try {
      // Giải mã Access Token
      const decoded = verifyAccessToken(token);

      if (!decoded || !decoded.userId) {
        throw new UnauthorizedException("Token không hợp lệ");
      }

      // Truy vấn tài khoản từ ID trong token
      const account = await this.accountRepository.findOne({
        where: { id: decoded.userId },
      });

      if (!account) {
        throw new UnauthorizedException("Tài khoản không tồn tại");
      }

      return account;
    } catch (error) {
      throw new UnauthorizedException("Token không hợp lệ hoặc đã hết hạn");
    }
  }

  // async getGuestList({ fromDate, toDate }: { fromDate?: Date; toDate?: Date }) {
  //   const guests = await this.guestRepository.find({
  //     where: {
  //       createdAt: {
  //         $gte: fromDate,  // Greater than or equal to fromDate
  //         $lte: toDate,    // Less than or equal to toDate
  //       },
  //     },
  //     order: {
  //       createdAt: 'DESC',  // Ordering by createdAt in descending order
  //     },
  //   });

  //   return guests;
  // }

  // async createGuest(body: CreateGuestBodyType) {
  //   // Find the table by its number
  //   const table = await this.tableRepository.findOne({
  //     where: { number: body.tableNumber },
  //   });

  //   if (!table) {
  //     throw new NotFoundException("Bàn không tồn tại");
  //   }

  //   if (table.status === TableStatus.Hidden) {
  //     throw new BadRequestException(
  //       `Bàn ${table.number} đã bị ẩn, vui lòng chọn bàn khác`
  //     );
  //   }

  //   // Create the guest and associate the table
  //   const guest = this.guestRepository.create({
  //     ...body,
  //     table,
  //   });

  //   await this.guestRepository.save(guest);

  //   return guest;
  // }
}
