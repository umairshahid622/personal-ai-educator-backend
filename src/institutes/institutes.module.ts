import { Module } from "@nestjs/common";
import { InstitutesService } from "./institutes.service";
import { InstitutesController } from "./institutes.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Institute } from "./entities/institute.entity";
import { AuthenticationModule } from "src/authentication/authentication.module";

@Module({
  imports: [TypeOrmModule.forFeature([Institute]),AuthenticationModule],
  controllers: [InstitutesController],
  providers: [InstitutesService],
})
export class InstitutesModule {}
