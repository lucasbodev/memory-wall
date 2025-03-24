import React from "react";
import { getProducts } from "@/actions/product-actions";
import ProductCard from "@/components/product-card/product-card.component";
import styles from "@/app/[locale]/products/products.module.css";
import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import { getSession } from "@auth0/nextjs-auth0";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Nav' });

    return {
        title: t('productsLink')
    };
}

const Products = async () => {

    const session = await getSession();

    const t = await getTranslations("Products");

    const products = await getProducts();

    return (
        <>
            <div className={styles.products__header}>
                <div>
                    <h1 className={styles.products__title}>{t('title')}</h1>
                    <p className={styles.products__description}>{t('description')}</p>
                </div>
                {
                    session?.user &&
                    <Link className="btn btn-primary" href="/products/add-product" >{t('addProductBtn')}</Link>
                }
            </div>
            {
                products.length === 0 && (
                    <p className="flex justify-center mt-8">{t('noProducts')}</p>
                )
            }
            <div className={styles.products__grid}>
                {
                    products.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))
                }
            </div>
        </>
    );
};

export default Products;