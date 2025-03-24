import React from "react";
import styles from "@/app/[locale]/products/edit-product/edit-product.module.css";
import ProductForm from "@/components/product-form/product-form.component";
import { getProduct } from "@/actions/product-actions";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Products' });

    return {
        title: t('title')
    };
}

const EditProduct = async ({ params }: { params: Promise<{ locale: string, id: string }> }) => {
    const id = (await params).id;

    const product = await getProduct(id);

    return (
        <div className={styles.edit__product__form__container}>
            <ProductForm defaultValue={product} />
        </div>
    );
};

export default EditProduct;