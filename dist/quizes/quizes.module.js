"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizesModule = void 0;
const common_1 = require("@nestjs/common");
const quizes_service_1 = require("./quizes.service");
const quizes_controller_1 = require("./quizes.controller");
const quize_entity_1 = require("./entities/quize.entity");
const typeorm_1 = require("@nestjs/typeorm");
const jwt_1 = require("@nestjs/jwt");
const dist_1 = require("@nestjs/config/dist");
let QuizesModule = class QuizesModule {
};
exports.QuizesModule = QuizesModule;
exports.QuizesModule = QuizesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([quize_entity_1.Quiz]),
            jwt_1.JwtModule.registerAsync({
                imports: [dist_1.ConfigModule],
                inject: [dist_1.ConfigService],
                useFactory: (config) => ({
                    global: true,
                    secret: config.get("JWT_SECRET"),
                    signOptions: { expiresIn: "5h" },
                }),
            }),
        ],
        controllers: [quizes_controller_1.QuizesController],
        providers: [quizes_service_1.QuizesService],
    })
], QuizesModule);
//# sourceMappingURL=quizes.module.js.map