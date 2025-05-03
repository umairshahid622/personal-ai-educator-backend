import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthenticationModule } from "./authentication/authentication.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { UsersModule } from "./users/users.module";
import { Skills } from "./entities/skills.entity";

import { User } from "./users/entities/users.entity";
import { CourseModule } from "./course/course.module";
import { Courses } from "./course/entities/course.entity";
import { CategoriesModule } from "./categories/categories.module";
import { Categories } from "./categories/entities/category.entity";
import { ProgressModule } from './progress/progress.module';
import { QuizesModule } from './quizes/quizes.module';
import { InstitutesModule } from './institutes/institutes.module';
import { CertificatesModule } from './certificates/certificates.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Courses, Skills, Categories, User]),
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
        synchronize: true,
      }),
    }),

    UsersModule,

    CourseModule,

    CategoriesModule,

    ProgressModule,

    QuizesModule,

    InstitutesModule,

    CertificatesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
