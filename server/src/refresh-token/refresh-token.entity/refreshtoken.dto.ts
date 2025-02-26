import { Account } from "src/account/account.entity/account.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";

@Entity()
export class RefreshToken {
  @PrimaryColumn()
  token: string;

  @Column()
  accountId: number;

  @ManyToOne(() => Account, (account) => account.refreshTokens)
  @JoinColumn({ name: "accountId" })
  account: Account;

  @Column()
  expiresAt: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;
}
