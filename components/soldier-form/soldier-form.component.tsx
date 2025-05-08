"use client";

import type React from "react";
import Link from "next/link";
import { useActionState, useEffect } from "react";
import { createSoldier, updateSoldier } from "@/actions/soldier-actions";
import styles from "@/components/soldier-form/soldier-form.module.css";
import { FieldMetadata, FormProvider, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { soldierSchema } from "@/models/validations/soldier-validators";
import Heading, { HeadingTypes } from "@/components/heading/heading.component";
import FormField from "@/components/form/form-field/form-field.component";
import ArrayField from "@/components/form/array-field/array-field.component";
import FileUploadField from "@/components/form/file-upload-field/file-upload-field.component";
import FileUploadArrayField from "@/components/form/file-upload-array-field/file-upload-array-field.component";
import toast from "react-hot-toast";
import { useRouter } from "@/i18n/routing";
import Toast from "@/components/toast/toast.component";
import AutocompleteField, { AutocompleteItem } from "../form/autocomplete-field/autocomplete-field.component";
import { Rank, Unit, Campaign, Medal, PhotoType } from "@prisma/client";
import { SoldierWithRelations } from "@/models/types/soldier";

const SoldierForm = (
    { defaultValue, ranks, units, campaigns, medals }:
        { defaultValue?: SoldierWithRelations, ranks: Rank[], units: Unit[], campaigns: Campaign[], medals: Medal[] }) => {

    const [lastResult, action, isPending] = useActionState(defaultValue ? updateSoldier : createSoldier, undefined);
    const router = useRouter();

    const [form, fields] = useForm({
        lastResult,
        defaultValue: defaultValue
            ? {
                ...defaultValue,
                born: defaultValue.born.toISOString().split("T")[0],
                died: defaultValue.died?.toISOString().split("T")[0],
                campaigns: defaultValue.campaigns?.map((item) => item.campaign) || [],
                medals: defaultValue.medals?.map((item) => item.medal) || [],
                mainPhoto: defaultValue.photos?.find((photo) => photo.type === PhotoType.MAIN)?.url,
                documents: defaultValue.photos?.filter((photo) => photo.type === PhotoType.DOCUMENT).map((doc) => ({ file: doc.url, caption: doc.caption })) || [],
            } : { campaigns: [{}], medals: [{}], documents: [{}] },
        onValidate({ formData }) {
            return parseWithZod(formData, {
                schema: soldierSchema(null)
            })
        },
        shouldValidate: "onBlur",
        shouldRevalidate: "onInput",
    })

    useEffect(() => {
        if (!lastResult) return;
        if (lastResult.error) {
            toast.custom(<Toast message={`Erreur lors de ${defaultValue ? "la modification" : "l'ajout"} du soldat. Vérifiez le formulaire.`} type="error" />);
        } else {
            toast.custom(<Toast message={`Soldat ${defaultValue ? "modifié" : "ajouté"} avec succès !`} type="success" />);
            router.push("/soldiers");
        }
    }, [lastResult])

    return (
        <div className={styles.soldierForm}>
            <Heading text="Nouveau soldat" type={HeadingTypes.H2} />
            <main className={`container ${styles.main}`}>
                <FormProvider context={form.context}>
                    <form
                        id={form.id}
                        onSubmit={form.onSubmit}
                        action={action}
                        className={styles.form}
                    >
                        <div className={styles.formGrid}>
                            {/* Informations Personnelles */}
                            <div className={styles.sectionTitle}>
                                <Heading text="Informations Personnelles" type={HeadingTypes.H3} />
                            </div>
                            <div className={styles.section}>

                                <FormField
                                    type="hidden"
                                    meta={fields.id}
                                />

                                <FormField meta={fields.name} label="Nom Complet" isPending={isPending} />
                                <AutocompleteField
                                    label="Grade"
                                    meta={fields.rank}
                                    suggestions={ranks}
                                    isPending={isPending}
                                />
                                <AutocompleteField
                                    label="Unité"
                                    meta={fields.unit}
                                    suggestions={units}
                                    isPending={isPending}
                                />

                                <div className={styles.fieldRow}>
                                    <FormField type="date" meta={fields.born} label="Date de Naissance" isPending={isPending} />
                                    <FormField type="date" meta={fields.died} label="Date de Décès *" isPending={isPending} />
                                </div>

                                <FormField meta={fields.birthplace} label="Lieu de Naissance" isPending={isPending} />

                                <div className={styles.fieldRow}>
                                    <FormField
                                        type="number"
                                        meta={fields.serviceStart}
                                        label="Début de Service"
                                        isPending={isPending}
                                        min="1939"
                                        max="1945"
                                        placeholder="1939"
                                    />
                                    <FormField
                                        type="number"
                                        meta={fields.serviceEnd}
                                        label="Début de Service"
                                        isPending={isPending}
                                        min="1939"
                                        max="1945"
                                        placeholder="1945"
                                    />
                                </div>
                            </div>

                            {/* Informations Militaires */}
                            <div className={styles.sectionTitle}>
                                <Heading text="Informations Militaires" type={HeadingTypes.H3} />
                            </div>

                            <div className={styles.section}>
                                <FormField
                                    as="textarea"
                                    meta={fields.biography}
                                    label="Biographie"
                                    isPending={isPending}
                                    rows={5}
                                />

                                <FormField
                                    as="textarea"
                                    meta={fields.quote}
                                    label="Citation *"
                                    isPending={isPending}
                                    rows={2}
                                />

                                <ArrayField
                                    name={fields.campaigns.name}
                                    fieldList={fields.campaigns.getFieldList() as FieldMetadata<AutocompleteItem>[]}
                                    label="Campagnes Militaires *"
                                    placeholder="Campagne"
                                    isPending={isPending}
                                    isAutocomplete
                                    suggestions={campaigns}
                                />

                                <ArrayField
                                    name={fields.medals.name}
                                    fieldList={fields.medals.getFieldList() as FieldMetadata<AutocompleteItem>[]}
                                    label="Décorations *"
                                    placeholder="Décoration"
                                    isPending={isPending}
                                    isAutocomplete
                                    suggestions={medals}
                                />
                            </div>
                        </div>

                        {/* Photo Uploads */}
                        <div className={styles.sectionTitle}>
                            <Heading text="Photos et Documents" type={HeadingTypes.H3} />
                        </div>

                        {/* Photo principale */}
                        <div className={styles.section}>
                            <h3 className={styles.label}>Photo Principale</h3>
                            <FileUploadField
                                label="Photo principale"
                                meta={fields.mainPhoto}
                                isPending={isPending}
                            />
                        </div>

                        {/* Documents historiques */}
                        <FileUploadArrayField
                            label="Documents Historiques"
                            name={fields.documents.name}
                            fieldList={fields.documents.getFieldList()}
                            isPending={isPending}
                        />

                        {lastResult?.error?.internal && (
                            <div className={`${styles.alert} ${styles.alertError}`}>{lastResult.error.internal}</div>
                        )}

                        {/* Submit Buttons */}
                        <div className={styles.actions}>
                            <Link href="/soldiers">
                                <button type="button" className={styles.cancelBtn} disabled={isPending}>
                                    Annuler
                                </button>
                            </Link>
                            <button className={styles.submitBtn} disabled={isPending}>
                                {isPending ? <span className={styles.loadingSpinner}></span> : "Enregistrer"}
                            </button>
                        </div>
                    </form>
                </FormProvider>
            </main>
        </div>
    )
}

export default SoldierForm;