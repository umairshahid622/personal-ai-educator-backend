import { Module } from "@nestjs/common";
import { DegreeService } from "./degree.service";
import { DegreeController } from "./degree.controller";
import { Degree } from "./entities/degree.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthenticationModule } from "src/authentication/authentication.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Degree]),
    AuthenticationModule,
  ],
  controllers: [DegreeController],
  providers: [DegreeService],
})
export class DegreeModule {}
