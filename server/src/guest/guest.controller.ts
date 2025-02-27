import { Body, Controller, Post } from "@nestjs/common";
import { GuestLoginBodyType } from "src/schemaValidations/guest.schema";
import { GuestService } from "./guest.service";

@Controller("guest")
export class GuestController {
  constructor(private readonly guestService: GuestService) {}

  @Post("login")
  async guestLogin(@Body() body: GuestLoginBodyType) {
    return this.guestService.guestLogin(body);
  }
}
