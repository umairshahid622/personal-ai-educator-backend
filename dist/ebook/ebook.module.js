"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EbookModule = void 0;
const common_1 = require("@nestjs/common");
const ebook_service_1 = require("./ebook.service");
const ebook_controller_1 = require("./ebook.controller");
const typeorm_1 = require("@nestjs/typeorm");
const ebook_entity_1 = require("./entities/ebook.entity");
let EbookModule = class EbookModule {
};
exports.EbookModule = EbookModule;
exports.EbookModule = EbookModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([ebook_entity_1.Ebook])],
        controllers: [ebook_controller_1.EbookController],
        providers: [ebook_service_1.EbookService],
    })
], EbookModule);
//# sourceMappingURL=ebook.module.js.map