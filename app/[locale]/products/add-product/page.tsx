import React from "react";
import styles from "@/app/[locale]/products/add-product/add-product.module.css";
import ProductForm from "@/components/product-form/product-form.component";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Products' });

    return {
        title: t('title')
    };
}

const AddProduct = () => {
    return (
        <div className={styles.add__product__form__container}>
            <ProductForm />
        </div>
    );
};

export default AddProduct;