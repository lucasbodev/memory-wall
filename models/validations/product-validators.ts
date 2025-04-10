// import { z } from 'zod';
// import { Validator } from '@/models/validations/validator';
// import { Submission } from '@conform-to/react';
// import { parseWithZod } from '@conform-to/zod';
// import { ProductCreationValidation, ProductUpdateValidation } from '@/models/validations/product-validations';

// export const productCreationSchema = (t: (key: string) => string) => z.object({
//     reference: z.string({ message: t('referenceRequired') }),
//     name: z.string({ message: t('nameRequired') }).max(32, t('nameMaxLength')),
//     description: z.string({ message: t('descriptionRequired') }).max(255, t('descriptionMaxLength')),
//     price: z.number({ message: t('priceRequired') }).min(0, t('priceMinValue')),
//     image: z.instanceof(File, { message: t('imageRequired') }),
// });

// export const productUpdateSchema = (t: (key: string) => string) => z.object({
//     reference: z.string({ message: t('referenceRequired') }),
//     name: z.string({ message: t('nameRequired') }).max(32, t('nameMaxLength')),
//     description: z.string({ message: t('descriptionRequired') }).max(255, t('descriptionMaxLength')),
//     price: z.number({ message: t('priceRequired') }).min(0, t('priceMinValue')),
//     image: z.instanceof(File).optional(),
// });

// export class ProductCreationValidator extends Validator<ProductCreationValidation> {
    
//     constructor(t: (key: string) => string) {
//         super(t);
//     }

//     validate(data: FormData): Submission<ProductCreationValidation> {
//         return parseWithZod(data, {
//             schema: productCreationSchema(this.t),
//         });
//     }
// }

// export class ProductUpdateValidator extends Validator<ProductUpdateValidation> {
    
//     constructor(t: (key: string) => string) {
//         super(t);
//     }

//     validate(data: FormData): Submission<ProductUpdateValidation> {
//         return parseWithZod(data, {
//             schema: productUpdateSchema(this.t),
//         });
//     }
// }
