import { Injectable } from "@nestjs/common";
import { CreateEbookDto } from "./dto/create-ebook.dto";
import { UpdateEbookDto } from "./dto/update-ebook.dto";
import { Ebook } from "./entities/ebook.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class EbookService {
  constructor(
    @InjectRepository(Ebook) private readonly ebookRepo: Repository<Ebook>
  ) {}

  create(createEbookDto: CreateEbookDto) {
    return "This action adds a new ebook";
  }

  async createBulk(dtos: CreateEbookDto[]): Promise<Ebook[]> {
    
    // map DTOs to entities
    const ebooks = dtos.map((dto) => this.ebookRepo.create(dto));
    // save them all at once
    return this.ebookRepo.save(ebooks);
  }

  findAll() {
    return this.ebookRepo.find();
  }
}
