import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/users.entity";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AuthenticationModule } from "src/authentication/authentication.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    AuthenticationModule
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
