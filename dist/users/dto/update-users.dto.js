"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAuthenticationDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_users_dto_1 = require("./create-users.dto");
class UpdateAuthenticationDto extends (0, swagger_1.PartialType)(create_users_dto_1.CreateAuthenticationDto) {
}
exports.UpdateAuthenticationDto = UpdateAuthenticationDto;
//# sourceMappingURL=update-users.dto.js.map