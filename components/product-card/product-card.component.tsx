"use client";

import React, { useRef, useState } from "react";
import styles from "@/components/product-card/product-card.module.css";
import { Link } from "@/i18n/routing";
import { type ProductDTO } from "@/models/DTOs/product-DTO";
import { useTranslations } from "next-intl";
import { deleteProduct } from "@/actions/product-actions";
import toast from "react-hot-toast";
import DaisyToast from "../daisy-toast/daisy-toast.component";
import { useUser } from "@auth0/nextjs-auth0/client";
import Image from 'next/image';

const ProductCard = ({ product }: { product: ProductDTO }) => {

    const { user } = useUser();

    const t = useTranslations("ProductCard");

    const [deletionLoading, setDeletionLoading] = useState(false);

    const deletionModal = useRef<HTMLDialogElement>(null);

    const showDeletionModal = () => {
        if (deletionModal.current) {
            deletionModal.current.showModal();
        }
    };

    const handleDeletion = (id: string) => {
        setDeletionLoading(true);
        deleteProduct(id).then(() => {
            if (deletionModal.current) {
                deletionModal.current.close();
            }
            toast.custom(<DaisyToast message={t('deletionSuccess')} type="success" />);
            setDeletionLoading(false);
        }).catch((e) => {
            toast.custom(<DaisyToast message={(e as Error).message} type="error" />);
            setDeletionLoading(false);
        });
    };

    return (
        <div className="card bg-base-100 shadow-xl" key={product.id}>
            <figure>
                {
                    product.image &&
                    <Image
                        src={product.image}
                        alt={product.name}
                        width={500}
                        height={500}
                    />
                }
            </figure>
            <div className="card-body">
                <div className="card-actions justify-end">
                    {
                        user &&
                        <div className={styles.action__icons}>
                            <div className="tooltip tooltip-accent" data-tip="Edit product">
                                <Link href={{
                                    pathname: '/products/edit-product/[id]',
                                    params: { id: `${product.id}` },
                                }}>
                                    <svg className="h-6 w-6 text-primary" width="622" height="617" viewBox="0 0 622 617" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M539.817 214.583L406.483 81.25M539.817 214.583L373.2 381.197C351.243 403.153 324.593 420.487 293.997 425.763C263.103 431.093 224.765 432.867 206.481 414.583C188.198 396.3 189.972 357.96 195.3 327.067C200.577 296.47 217.912 269.82 239.867 247.863L406.483 81.25M539.817 214.583C539.817 214.583 639.813 114.583 573.147 47.9167C506.48 -18.75 406.483 81.25 406.483 81.25M591.667 308.333C591.667 525 525 591.667 308.333 591.667C91.6667 591.667 25 525 25 308.333C25 91.6667 91.6667 25 308.333 25" stroke="currentColor" strokeWidth="50" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </Link>
                            </div>
                            <div className="tooltip tooltip-accent" data-tip="Delete product">
                                <button onClick={() => { showDeletionModal(); }}>
                                    <svg className="h-6 w-6 text-error" width="601" height="668" viewBox="0 0 601 668" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M234 334V500.667" stroke="currentColor" strokeWidth="66.6667" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M367.333 334V500.667" stroke="currentColor" strokeWidth="66.6667" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M34 167.333H567.333" stroke="currentColor" strokeWidth="66.6667" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M100.667 267.333V534C100.667 589.23 145.438 634 200.667 634H400.666C455.896 634 500.666 589.23 500.666 534V267.333" stroke="currentColor" strokeWidth="66.6667" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M200.667 100.667C200.667 63.8477 230.514 34 267.333 34H334C370.82 34 400.666 63.8477 400.666 100.667V167.333H200.667V100.667Z" stroke="currentColor" strokeWidth="66.6667" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    }
                    <dialog ref={deletionModal} className="modal modal-bottom sm:modal-middle">
                        <div className="modal-box">
                            <h3 className="font-bold text-lg">{t('deletionModalTitle')}</h3>
                            <p className="py-4">{t('deletionModalDescription')}</p>
                            {
                                deletionLoading ?
                                    <div className="modal-action">
                                        <span className="loading loading-ring loading-lg"></span>
                                    </div> :
                                    <div className="modal-action">
                                        <button className="btn btn-primary btn-outline" onClick={() => {
                                            if (product.id) {
                                                handleDeletion(product.id);
                                            }
                                        }}>{t('delete')}</button>
                                        <form method="dialog">
                                            <button className="btn btn-primary">{t('cancel')}</button>
                                        </form>
                                    </div>
                            }
                        </div>
                    </dialog>
                </div>
                <h2 className="card-title">
                    {product.name}
                    <div className="badge badge-secondary">{product.price}€</div>
                </h2>
                <p>{product.description}</p>
                <div className="card-actions justify-end">
                    <div className="badge badge-outline">Fashion</div>
                    <div className="badge badge-outline">Products</div>
                </div>
            </div>
        </div >
    );
};

export default ProductCard;