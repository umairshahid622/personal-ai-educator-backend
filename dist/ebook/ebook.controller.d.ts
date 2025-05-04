import { EbookService } from "./ebook.service";
import { CreateEbookDto } from "./dto/create-ebook.dto";
import { Ebook } from "./entities/ebook.entity";
export declare class EbookController {
    private readonly ebookService;
    constructor(ebookService: EbookService);
    createBulk(dtos: CreateEbookDto[]): Promise<Ebook[]>;
    findAll(): Promise<Ebook[]>;
}
