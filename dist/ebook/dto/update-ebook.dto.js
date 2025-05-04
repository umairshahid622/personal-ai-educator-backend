"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateEbookDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_ebook_dto_1 = require("./create-ebook.dto");
class UpdateEbookDto extends (0, swagger_1.PartialType)(create_ebook_dto_1.CreateEbookDto) {
}
exports.UpdateEbookDto = UpdateEbookDto;
//# sourceMappingURL=update-ebook.dto.js.map