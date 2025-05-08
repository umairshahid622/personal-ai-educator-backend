// src/cleanup/cleanup.service.ts
import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { LessThan, Repository } from "typeorm";
import { User } from "src/users/entities/users.entity";
import { Cron } from "@nestjs/schedule";



const CLEANUP_CRON = (process.env.EMAIL_CLEANUP_CRON || '0 */5 * * *') as string;
@Injectable()
export class CleanupService implements OnModuleInit {
  private readonly logger = new Logger(CleanupService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  onModuleInit() {
    this.logger.log("Running initial cleanup on startup");
    this.removeStaleUnverifiedAccounts();
  }


  @Cron(CLEANUP_CRON)
  async removeStaleUnverifiedAccounts() {
    this.logger.log(`🏷️  Cleanup tick at ${new Date().toISOString()}`);
    const cutoff = new Date();
    const { affected } = await this.userRepo.delete({
      emailVerified: false,
      emailTokenExpires: LessThan(cutoff),
    });
    this.logger.log(`Cleaned up ${affected} unverified accounts.`);
  }
}
