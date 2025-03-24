import { Repository } from "./repository";
import { prisma } from "@/db";
import { ProductDTO } from "@/models/DTOs/product-DTO";
import { Prisma } from "@prisma/client";
import { ErrorResponse } from "@/models/errors/error-response";

export class PrismaProductRepository extends Repository<ProductDTO> {

    constructor(t: (key: string) => string) {
        super(t);
    }

    async all(): Promise<ProductDTO[]> {
        try {
            const products = await prisma.product.findMany();
            return products.map(product => ({
                id: product.id,
                reference: product.reference,
                name: product.name,
                description: product.description,
                price: product.price,
                image: product.image,
            }));
        } catch (e) {
            console.error((e as Error).message);
            throw new ErrorResponse(this.t('productsFetchFailed'));
        }
    }

    async find(id: string): Promise<ProductDTO> {
        try {
            let product = await prisma.product.findUnique({
                where: { id: id }
            });

            if (!product) {
                throw new ErrorResponse(this.t('productNotFound'));
            }

            return product as ProductDTO;
        } catch (e) {
            console.error((e as Error).message);
            throw new Error(this.t('productFetchFailed'));
        }
    }

    async create(data: ProductDTO): Promise<ProductDTO> {
        try {
            const { reference, name, description, price, image } = data;
            const product = await prisma.product.create({
                data: {
                    reference: reference as string,
                    name: name as string,
                    description: description as string,
                    price: Number(price),
                    image: image as string,
                }
            });
            return product;
        } catch (e) {
            console.error((e as Error).message);
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                if (e.code === 'P2002') {
                    throw new ErrorResponse(this.t('unicityConstraintViolation'), 'reference');
                }
            }
            throw new ErrorResponse(this.t('productCreationFailed'), 'internal');
        }
    }

    async update(data: ProductDTO): Promise<ProductDTO> {
        try {
            const { id, reference, name, description, price, image } = data;
            const product = await prisma.product.update({
                where: {
                    id: id,
                },
                data: {
                    reference: reference as string,
                    name: name as string,
                    description: description as string,
                    price: Number(price),
                    image: image as string,
                }
            });
            return product;
        } catch (e) {
            console.error((e as Error).message);
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                if (e.code === 'P2002') {
                    throw new ErrorResponse(this.t('unicityConstraintViolation'), 'reference');
                }
            }
            throw new ErrorResponse(this.t('productCreationFailed'), 'internal');
        }
    }

    delete(id: string): Promise<ProductDTO> {
        try {
            return prisma.product.delete({
                where: { id: id }
            }).then(product => ({
                id: product.id,
                reference: product.reference,
                name: product.name,
                description: product.description,
                price: product.price,
                image: product.image,
            }) as ProductDTO);
        } catch (e) {
            console.error((e as Error).message);
            throw new ErrorResponse(this.t('productDeletionFailed'));
        }
    }
}