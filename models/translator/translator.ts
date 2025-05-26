import { Language } from "@prisma/client";
import { ErrorResponse } from "../errors/error-response";

export class Translator {

    private translate: any;

    constructor() {
        try {
            const credentials = JSON.parse(
                Buffer.from(process.env.GOOGLE_CREDENTIALS_BASE64!, 'base64').toString('utf-8')
            );
            const { Translate } = require('@google-cloud/translate').v2;
            this.translate = new Translate({ credentials });
        } catch (error) {
            throw new ErrorResponse('Limite de traductions atteinte', 'internal');
        }

    }

    public async translateText(text: string, target: Language): Promise<string> {
        try {
            const [translation] = await this.translate.translate(text, target);
            return translation;
        } catch (error) {
            throw new ErrorResponse('Limite de traductions atteinte', 'internal');
        }
    }
}