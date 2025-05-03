"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const authentication_module_1 = require("./authentication/authentication.module");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const users_module_1 = require("./users/users.module");
const skills_entity_1 = require("./entities/skills.entity");
const users_entity_1 = require("./users/entities/users.entity");
const course_module_1 = require("./course/course.module");
const course_entity_1 = require("./course/entities/course.entity");
const categories_module_1 = require("./categories/categories.module");
const category_entity_1 = require("./categories/entities/category.entity");
const progress_module_1 = require("./progress/progress.module");
const quizes_module_1 = require("./quizes/quizes.module");
const institutes_module_1 = require("./institutes/institutes.module");
const certificates_module_1 = require("./certificates/certificates.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([course_entity_1.Courses, skills_entity_1.Skills, category_entity_1.Categories, users_entity_1.User]),
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: ".env",
            }),
            authentication_module_1.AuthenticationModule,
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    type: "postgres",
                    host: config.get("DATABASE_HOST"),
                    port: config.get("DATABASE_PORT", 5432),
                    username: config.get("DATABASE_USERNAME"),
                    password: config.get("DATABASE_PASSWORD"),
                    database: config.get("DATABASE_NAME"),
                    autoLoadEntities: true,
                    synchronize: true,
                }),
            }),
            users_module_1.UsersModule,
            course_module_1.CourseModule,
            categories_module_1.CategoriesModule,
            progress_module_1.ProgressModule,
            quizes_module_1.QuizesModule,
            institutes_module_1.InstitutesModule,
            certificates_module_1.CertificatesModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map