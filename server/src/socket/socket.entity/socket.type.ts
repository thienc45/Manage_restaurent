import { Account } from "src/account/account.entity/account.entity";
import { Guest } from "src/guest/guest.entity/guest.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";

@Entity()
export class Socket {
  @PrimaryColumn()
  socketId: string;

  @Column({ nullable: true })
  accountId: number;

  @ManyToOne(() => Account, (account) => account.sockets)
  @JoinColumn({ name: "accountId" })
  account: Account;

  @Column({ nullable: true })
  guestId: number;

  @ManyToOne(() => Guest, (guest) => guest.sockets)
  @JoinColumn({ name: "guestId" })
  guest: Guest;
}
