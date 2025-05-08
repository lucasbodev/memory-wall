import { Language } from "@prisma/client";

export class Translator {

    private translate: any;

    constructor() {
        const credentials = JSON.parse(
            Buffer.from(process.env.GOOGLE_CREDENTIALS_BASE64!, 'base64').toString('utf-8')
        );
        const { Translate } = require('@google-cloud/translate').v2;
        this.translate = new Translate({ credentials });
    }

    public async translateText(text: string, target: Language): Promise<string> {
        const [translation] = await this.translate.translate(text, target);
        return translation;
    }
}