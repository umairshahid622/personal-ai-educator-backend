"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateInstituteDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_institute_dto_1 = require("./create-institute.dto");
class UpdateInstituteDto extends (0, swagger_1.PartialType)(create_institute_dto_1.CreateInstituteDto) {
}
exports.UpdateInstituteDto = UpdateInstituteDto;
//# sourceMappingURL=update-institute.dto.js.map