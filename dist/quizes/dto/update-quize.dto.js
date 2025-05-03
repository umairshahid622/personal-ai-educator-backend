"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateQuizeDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_quize_dto_1 = require("./create-quize.dto");
class UpdateQuizeDto extends (0, swagger_1.PartialType)(create_quize_dto_1.CreateQuizeDto) {
}
exports.UpdateQuizeDto = UpdateQuizeDto;
//# sourceMappingURL=update-quize.dto.js.map