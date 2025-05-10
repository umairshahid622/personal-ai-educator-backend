import { Module } from "@nestjs/common";
import { DegreeService } from "./degree.service";
import { DegreeController } from "./degree.controller";
import { Degree } from "./entities/degree.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [
    TypeOrmModule.forFeature([Degree]),
    
  ],
  controllers: [DegreeController],
  providers: [DegreeService],
})
export class DegreeModule {}
