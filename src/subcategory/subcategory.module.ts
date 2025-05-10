import { Module } from "@nestjs/common";
import { SubcategoryService } from "./subcategory.service";
import { SubcategoryController } from "./subcategory.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SubCategory } from "./entities/subcategory.entity";
import { AuthenticationModule } from "src/authentication/authentication.module";

@Module({
  imports: [TypeOrmModule.forFeature([SubCategory]), AuthenticationModule],
  controllers: [SubcategoryController],
  providers: [SubcategoryService],
})
export class SubcategoryModule {}
