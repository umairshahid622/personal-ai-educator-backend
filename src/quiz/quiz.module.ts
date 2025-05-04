import { Module } from "@nestjs/common";
import { QuizService } from "./quiz.service";
import { QuizController } from "./quiz.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Quiz } from "./entities/quiz.entity";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { SubCategory } from "src/subcategory/entities/subcategory.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Quiz, SubCategory]),
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
  controllers: [QuizController],
  providers: [QuizService],
})
export class QuizModule {}
