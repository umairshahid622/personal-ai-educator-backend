import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthenticationModule } from "./authentication/authentication.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { UsersModule } from "./users/users.module";

import { User } from "./users/entities/users.entity";
import { CourseModule } from "./course/course.module";
import { Courses } from "./course/entities/course.entity";
import { CategoriesModule } from "./categories/categories.module";
import { Categories } from "./categories/entities/category.entity";
import { InstitutesModule } from "./institutes/institutes.module";
import { SubcategoryModule } from "./subcategory/subcategory.module";
import { SubCategory } from "./subcategory/entities/subcategory.entity";
import { CourseSeeder } from "./utilities/courses.seed";
import { EbookModule } from "./ebook/ebook.module";
import { Ebook } from "./ebook/entities/ebook.entity";
import { QuizModule } from './quiz/quiz.module';
import { CertificatesModule } from './certificates/certificates.module';
import { DegreeModule } from './degree/degree.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Courses,
      Categories,
      User,
      SubCategory,
      Ebook,
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    AuthenticationModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: "postgres",
        host: config.get<string>("DATABASE_HOST"),
        port: config.get<number>("DATABASE_PORT", 5432), // Default port 5432
        username: config.get<string>("DATABASE_USERNAME"),
        password: config.get<string>("DATABASE_PASSWORD"),
        database: config.get<string>("DATABASE_NAME"),
        autoLoadEntities: true,
        entities: [SubCategory, Ebook],
        synchronize: true,
      }),
    }),

    UsersModule,

    CourseModule,

    CategoriesModule,

    InstitutesModule,

    SubcategoryModule,

    EbookModule,

    QuizModule,

    CertificatesModule,

    DegreeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
