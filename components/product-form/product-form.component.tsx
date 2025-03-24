"use client";

import React, { useActionState, useRef, useState } from "react";
import styles from "@/components/product-form/product-form.module.css";
import { useTranslations } from "next-intl";
import { createProduct, updateProduct } from "@/actions/product-actions";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { productCreationSchema, productUpdateSchema } from "@/models/validations/product-validators";
import { type ProductDTO } from "@/models/DTOs/product-DTO";
import ImagePreview from "@/components/image-preview/image-preview";

const ProductForm = ({ defaultValue }: { defaultValue?: ProductDTO }) => {

    const t = useTranslations("ProductForm");
    const [lastResult, action, isPending] = useActionState(
        defaultValue ? updateProduct : createProduct,
        undefined
    );
    const fileInput = useRef<HTMLInputElement>(null);
    const [imageUrl, setImageUrl] = useState<string>('');

    const [form, fields] = useForm({
        lastResult,
        defaultValue,
        onValidate({ formData }) {
            return parseWithZod(formData, {
                schema: (defaultValue ? productUpdateSchema(t) : productCreationSchema(t))
            });
        },
        shouldValidate: 'onBlur',
        shouldRevalidate: 'onInput',
    });

    const handleFileUpload = () => {
        const file = fileInput.current?.files?.[0];
        if (file) {
            setImageUrl(URL.createObjectURL(file));
        }
    };

    return (
        <form id={form.id} onSubmit={form.onSubmit} action={action}>
            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title">{
                        defaultValue ?
                            t('editProductTitle') :
                            t('addProductTitle')
                    }</h2>
                    <p className="text-default-400">{
                        defaultValue ?
                            t('editProductDescription') :
                            t('addProductDescription')
                    }</p>
                    {
                        lastResult?.error?.internal &&
                        <span className="alert alert-error">
                            {lastResult.error.internal}
                        </span>
                    }
                    <div className={styles.double__column__form}>
                        {
                            defaultValue && <input type="hidden" key="id" name="id" value={defaultValue.id} />
                        }
                        <div className={styles.form__left}>
                            <label className="form-control w-full max-w-xs">
                                <div className="label">
                                    <span className="label-text">{t('referenceLabel')}</span>
                                </div>
                                <input
                                    key={fields.reference.key}
                                    name={fields.reference.name}
                                    defaultValue={fields.reference.value ?? fields.reference.initialValue}
                                    className={`input input-bordered w-full max-w-xs ${fields.reference.errors && "input-error"}`}
                                    type="text" placeholder={t('referencePlaceholder')}
                                    disabled={isPending}
                                />
                                {
                                    fields.reference.errors &&
                                    <div className="label">
                                        <span className="label-text-alt text-error">{fields.reference.errors}</span>
                                    </div>
                                }

                            </label>
                            <label className="form-control w-full max-w-xs">
                                <div className="label">
                                    <span className="label-text">{t('nameLabel')}</span>
                                </div>
                                <input
                                    key={fields.name.key}
                                    name={fields.name.name}
                                    defaultValue={fields.name.value ?? fields.name.initialValue}
                                    className={`input input-bordered w-full max-w-xs ${fields.name.errors && "input-error"}`}
                                    type="text" placeholder={t('namePlaceholder')}
                                    disabled={isPending}
                                />
                                {
                                    fields.name.errors &&
                                    <div className="label">
                                        <span className="label-text-alt text-error">{fields.name.errors}</span>
                                    </div>
                                }

                            </label>
                            <label className="form-control">
                                <div className="label">
                                    <span className="label-text">{t('descriptionLabel')}</span>
                                </div>
                                <textarea
                                    key={fields.description.key}
                                    name={fields.description.name}
                                    defaultValue={fields.description.value ?? fields.description.initialValue}
                                    className={`textarea textarea-bordered h-24 ${fields.description.errors && "textarea-error"}`}
                                    placeholder={t('descriptionPlaceholder')}
                                    disabled={isPending}></textarea>
                                {
                                    fields.description.errors &&
                                    <div className="label">
                                        <span className="label-text-alt text-error">{fields.description.errors}</span>
                                    </div>
                                }
                            </label>
                            <label className="form-control w-full max-w-xs">
                                <div className="label">
                                    <span className="label-text">{t('priceLabel')}</span>
                                </div>
                                <input
                                    key={fields.price.key}
                                    name={fields.price.name}
                                    defaultValue={fields.price.value ?? fields.price.initialValue}
                                    className={`input input-bordered w-full max-w-xs ${fields.price.errors && "input-error"}`}
                                    type="number" placeholder={t('pricePlaceholder')}
                                    disabled={isPending}
                                />
                                {
                                    fields.price.errors &&
                                    <div className="label">
                                        <span className="label-text-alt text-error">{fields.price.errors}</span>
                                    </div>
                                }
                            </label>
                        </div>
                        <div className={styles.form__right}>
                            <label className="form-control w-full max-w-xs">
                                <div className="label">
                                    <span className="label-text">{t('imagePickerLabel')}</span>
                                </div>
                                <input
                                    key={fields.image.key}
                                    name={fields.image.name}
                                    className={`file-input file-input-bordered w-full max-w-xs ${fields.image.errors && "file-input-error"}`}
                                    type="file"
                                    disabled={isPending}
                                    onChange={handleFileUpload}
                                    ref={fileInput}
                                />
                                {
                                    fields.image.errors &&
                                    <div className="label">
                                        <span className="label-text-alt text-error">{fields.image.errors}</span>
                                    </div>
                                }
                            </label>
                            {
                                defaultValue ?
                                    <ImagePreview src={defaultValue.image} /> :
                                    imageUrl ?
                                        <ImagePreview src={imageUrl} /> :
                                        <ImagePreview />
                            }

                        </div>
                    </div>
                    <div className="card-actions justify-end">
                        {
                            isPending ?
                                <span className="loading loading-ring loading-lg"></span> :
                                <button className="btn btn-primary">{t('saveProductBtn')}</button>
                        }
                    </div>
                </div>
            </div>
        </form>
    );
};

export default ProductForm;