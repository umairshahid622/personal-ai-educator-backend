// src/cleanup/cleanup.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import { User } from 'src/users/entities/users.entity';
import { Cron } from '@nestjs/schedule';
@Injectable()
export class CleanupService {
  private readonly logger = new Logger(CleanupService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  // runs every day at midnight
  @Cron('0 0 * * *')
  async removeStaleUnverifiedAccounts() {
    const cutoff = new Date();
    // delete any user not verified whose token expired before now
    const { affected } = await this.userRepo.delete({
      emailVerified: false,
      emailTokenExpires: LessThan(cutoff),
    });
    this.logger.log(`Cleaned up ${affected} unverified accounts.`);
  }
}
