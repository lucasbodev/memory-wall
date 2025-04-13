import { Prisma } from "@prisma/client";
import { type Parser } from "@/models/DTOs/parser";

export class SoldierParser implements Parser<Prisma.SoldierCreateInput> {
    
    parse(data: FormData): Prisma.SoldierCreateInput {
        return {
            // id: data.get("id") as string,
            name: data.get("name") as string,
            rank: data.get("rank") as string,
            unit: data.get("unit") as string,
            born: new Date((data.get("born") as string)).toISOString(),
            died: data.get("died") ? new Date((data.get("died") as string)).toISOString() : null,
            birthplace: data.get("birthplace") as string,
            serviceStart: Number(data.get("serviceStart")),
            serviceEnd: Number(data.get("serviceEnd")),
            biography: data.get("biography") as string,
            quote: data.get("quote") as string,
        };
    }
}