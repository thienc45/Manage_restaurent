import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as ms from "ms";
import { Role, TableStatus } from "src/common/constants/typecontants";
import envConfig from "src/config";
import { Table } from "src/table/table.entity/table.entity";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "src/utils/jwt";
import { Repository } from "typeorm";
import { Guest } from "./guest.entity/guest.entity";
import { GuestLoginBodyType } from "src/schemaValidations/guest.schema";

@Injectable()
export class GuestService {
  constructor(
    @InjectRepository(Guest)
    private guestRepository: Repository<Guest>,

    @InjectRepository(Table)
    private tableRepository: Repository<Table>
  ) {}

  async guestLogin(body: GuestLoginBodyType) {
    const table = await this.tableRepository.findOne({
      where: { number: body.tableNumber, token: body.token },
    });

    if (!table) {
      throw new NotFoundException("Bàn không tồn tại hoặc mã token không đúng");
    }

    if (table.status === TableStatus.Hidden) {
      throw new UnauthorizedException(
        "Bàn này đã bị ẩn, hãy chọn bàn khác để đăng nhập"
      );
    }

    if (table.status === TableStatus.Reserved) {
      throw new UnauthorizedException(
        "Bàn đã được đặt trước, hãy liên hệ nhân viên để được hỗ trợ"
      );
    }

    let guest = this.guestRepository.create({
      name: body.name,
      tableNumber: body.tableNumber,
    });

    guest = await this.guestRepository.save(guest);

    const refreshToken = signRefreshToken(
      { userId: guest.id, role: Role.Guest },
      { expiresIn: ms(envConfig.GUEST_REFRESH_TOKEN_EXPIRES_IN) }
    );

    const accessToken = signAccessToken(
      { userId: guest.id, role: Role.Guest },
      { expiresIn: ms(envConfig.GUEST_ACCESS_TOKEN_EXPIRES_IN) }
    );

    const decodedRefreshToken = verifyRefreshToken(refreshToken);
    const refreshTokenExpiresAt = new Date(decodedRefreshToken.exp * 1000);

    await this.guestRepository.update(guest.id, {
      refreshToken,
      refreshTokenExpiresAt,
    });

    return { guest, accessToken, refreshToken };
  }
}
