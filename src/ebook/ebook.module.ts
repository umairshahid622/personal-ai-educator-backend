import { Module } from "@nestjs/common";
import { EbookService } from "./ebook.service";
import { EbookController } from "./ebook.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Ebook } from "./entities/ebook.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Ebook])],
  controllers: [EbookController],
  providers: [EbookService],
})
export class EbookModule {}
