"use server";

import { redirect } from "@/i18n/routing";
import { getLocale, getTranslations } from 'next-intl/server';
import { ProductCreationValidator, ProductUpdateValidator } from '@/models/validations/product-validators';
import { PrismaProductRepository } from '@/models/repositories/prisma-product-repository';
import { ErrorResponse } from "@/models/errors/error-response";
import { ProductParser } from "@/models/DTOs/product-parser";
import { VercelFileStorage } from "@/models/storage/vercel-file-storage";
import { revalidatePath } from "next/cache";
import { getSession } from "@auth0/nextjs-auth0";

export const getProducts = async () => {
    const t = await getTranslations("Products");

    return new PrismaProductRepository(t).all();
};

export const getProduct = async (id: string) => {
    const t = await getTranslations("ProductForm");

    return new PrismaProductRepository(t).find(id);
};

export const createProduct = async (prevState: unknown, data: FormData) => {
    const t = await getTranslations("ProductForm");

    let submission = new ProductCreationValidator(t).validate(data);

    const session = await getSession();

    if (!(session?.user)) {
        return submission.reply({
            fieldErrors: {
                ['internal']: [t('unauthorized')]
            }
        });
    }

    if (submission.status === 'error') {
        return submission.reply();
    }

    try {
        let product = new ProductParser().parse(data);
        const imageUrl = await new VercelFileStorage().store(data.get('image') as File);
        product.image = imageUrl;
        await new PrismaProductRepository(t).create(product);
    } catch (e) {
        const error = e as ErrorResponse;
        return submission.reply({
            fieldErrors: {
                [error.field!]: [error.message]
            }
        });
    }

    const locale = await getLocale();

    return redirect({ href: '/products/add-product/success', locale });
};

export const updateProduct = async (prevState: unknown, data: FormData) => {
    const t = await getTranslations("ProductForm");

    let submission = new ProductUpdateValidator(t).validate(data);

    const session = await getSession();

    if (!(session?.user)) {
        return submission.reply({
            fieldErrors: {
                ['internal']: [t('unauthorized')]
            }
        });
    }

    if (submission.status === 'error') {
        return submission.reply();
    }

    try {
        const currentProduct = await new PrismaProductRepository(t).find(data.get('id') as string);
        let updatedProduct = new ProductParser().parse(data);
        const storage = new VercelFileStorage();
        if ((data.get('image') as File).size > 0) {
            await storage.delete(currentProduct.image!);
            const imageUrl = await storage.store(data.get('image') as File);
            updatedProduct.image = imageUrl;
        }
        await new PrismaProductRepository(t).update(updatedProduct);
    } catch (e) {
        const error = e as ErrorResponse;
        return submission.reply({
            fieldErrors: {
                [error.field!]: [error.message]
            }
        });
    }

    const locale = await getLocale();

    return redirect({ href: '/products', locale });
}

export const deleteProduct = async (id: string) => {
    const t = await getTranslations("Products");

    const session = await getSession();

    if (!(session?.user)) {
        throw new Error(t('unauthorized'));
    }

    try {
        const product = await new PrismaProductRepository(t).find(id);
        await new VercelFileStorage().delete(product.image!);
        await new PrismaProductRepository(t).delete(id);
    } catch (e) {
        const error = e as ErrorResponse;
        console.log(error.message);
        throw new Error(t('productDeletionFailed'));
    }

    revalidatePath('/products');
}

