import { CreateEbookDto } from "./dto/create-ebook.dto";
import { UpdateEbookDto } from "./dto/update-ebook.dto";
import { Ebook } from "./entities/ebook.entity";
import { Repository } from "typeorm";
export declare class EbookService {
    private readonly ebookRepo;
    constructor(ebookRepo: Repository<Ebook>);
    create(createEbookDto: CreateEbookDto): string;
    createBulk(dtos: CreateEbookDto[]): Promise<Ebook[]>;
    findAll(): Promise<Ebook[]>;
    findOne(id: number): string;
    update(id: number, updateEbookDto: UpdateEbookDto): string;
    remove(id: number): string;
}
