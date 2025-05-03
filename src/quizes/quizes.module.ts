import { Module } from "@nestjs/common";
import { QuizesService } from "./quizes.service";
import { QuizesController } from "./quizes.controller";
import { Quiz } from "./entities/quize.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config/dist";

@Module({
  imports: [
    TypeOrmModule.forFeature([Quiz]),
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
  controllers: [QuizesController],
  providers: [QuizesService],
})
export class QuizesModule {}
