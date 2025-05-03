import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/users.entity";
import { Repository } from "typeorm";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}
  async getUserById(userId: string): Promise<User | null> {
    try {
      const user: User | null = await this.userRepository.findOne({
        where: { uuid: userId },
        select: ["displayName", "email"],
      });

      if (!user) throw new NotFoundException("User not found");

      return user;
    } catch (error) {
      throw error;
    }
  }

  // users.service.ts

  async updateName(userId: string, newName: string): Promise<string> {
    const user = await this.userRepository.findOne({ where: { uuid: userId } });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    user.displayName = newName;
    await this.userRepository.save(user);

    return "Name updated successfully";
  }
}
