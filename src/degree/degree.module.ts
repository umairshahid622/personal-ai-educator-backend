import { Module } from "@nestjs/common";
import { DegreeService } from "./degree.service";
import { DegreeController } from "./degree.controller";
import { Degree } from "./entities/degree.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
  imports: [
    TypeOrmModule.forFeature([Degree]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        global: true,
        secret: config.get<string>("JWT_SECRET"),
        signOptions: { expiresIn: "5h" },
      }),
    }),
  ],
  controllers: [DegreeController],
  providers: [DegreeService],
})
export class DegreeModule {}
