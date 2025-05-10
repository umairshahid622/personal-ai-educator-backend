import { Module } from "@nestjs/common";
import { QuizService } from "./quiz.service";
import { QuizController } from "./quiz.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Quiz } from "./entities/quiz.entity";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { SubCategory } from "src/subcategory/entities/subcategory.entity";
import { Certificate } from "src/certificates/entities/certificate.entity";
import { Degree } from "src/degree/entities/degree.entity";
import { User } from "src/users/entities/users.entity";
import { Categories } from "src/categories/entities/category.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Quiz,
      SubCategory,
      Certificate,
      Degree,
      User,
      Categories,
    ]),
  ],
  controllers: [QuizController],
  providers: [QuizService],
})
export class QuizModule {}
