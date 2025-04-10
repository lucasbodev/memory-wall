import { Soldier } from "@prisma/client";
import { type Parser } from "@/models/DTOs/parser";

export class SoldierParser implements Parser<Soldier> {
    parse(data: FormData): Soldier {
        return {
            id: data.get("id") as string,
            name: data.get("name") as string,
            rank: data.get("rank") as string,
            unit: data.get("unit") as string,
            born: data.get("born") as unknown as Date,
            died: data.get("died") as unknown as Date,
            birthplace: data.get("birthplace") as string,
            serviceStart: data.get("serviceStart") as unknown as number,
            serviceEnd: data.get("serviceEnd") as unknown as number,
            biography: data.get("biography") as string,
            quote: data.get("quote") as string,
        };
    }
}