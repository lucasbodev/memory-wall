"use client"

import type React from "react"
import Link from "next/link"
import { useActionState } from "react"
import { createSoldier } from "@/actions/soldier-actions"
import styles from "@/app/[locale]/soldiers/add/add-soldier.module.css"
import { FieldMetadata, FormProvider, useForm } from "@conform-to/react"
import { parseWithZod } from "@conform-to/zod"
import { soldierCreationSchema } from "@/models/validations/soldier-validators"
import Heading, { HeadingTypes } from "@/components/heading/heading.component"
import FormField, { FieldMetadataValue } from "@/components/form/form-field/form-field.component"
import ArrayField from "@/components/form/array-field/array-field.component"
import FileUploadField from "@/components/form/file-upload-field/file-upload-field.component"
import FileUploadArrayField from "@/components/form/file-upload-array-field/file-upload-array-field.component"

// const AddSoldier = ({ defaultValue }: { defaultValue?: SoldierDTO }) => {
const AddSoldier = () => {

    // État pour useActionState
    const [lastResult, action, isPending] = useActionState(createSoldier, undefined)

    // Configuration du formulaire avec conform
    const [form, fields] = useForm({
        lastResult,
        defaultValue: { campaigns: [''], medals: [''], documents: [{}] },
        onValidate({ formData }) {
            return parseWithZod(formData, {
                schema: soldierCreationSchema(null)
            })
        },
        shouldValidate: "onBlur",
        shouldRevalidate: "onInput",
    })

    return (
        <div className={styles.addSoldier}>
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
                                <FormField meta={fields.name} label="Nom Complet" isPending={isPending} />
                                <FormField meta={fields.rank} label="Grade" isPending={isPending} />
                                <FormField meta={fields.unit} label="Unité" isPending={isPending} />

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
                                    fieldList={fields.campaigns.getFieldList()}
                                    label="Campagnes Militaires *"
                                    placeholder="Campagne"
                                    isPending={isPending}
                                />

                                <ArrayField
                                    name={fields.medals.name}
                                    fieldList={fields.medals.getFieldList()}
                                    label="Décorations *"
                                    placeholder="Décoration"
                                    isPending={isPending}
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

export default AddSoldier;