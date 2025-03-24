import { type ProductDTO } from "@/models/DTOs/product-DTO";
import { type Parser } from "@/models/DTOs/parser";


export class ProductParser implements Parser<ProductDTO> {
    
    parse(data: FormData): ProductDTO {
        return {
            id: data.get('id') ? data.get('id') as string : undefined,
            reference: data.get('reference') as string,
            name: data.get('name') as string,
            description: data.get('description') as string,
            price: Number(data.get('price')),
        };
    }
}