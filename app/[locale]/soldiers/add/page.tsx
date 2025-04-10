"use client"

import type React from "react"
import { useRef, useState } from "react"
import Link from "next/link"
import { useActionState } from "react"
import { createSoldier } from "@/actions/soldier-actions"
import ImagePreview from "@/components/image-preview/image-preview"
import styles from "@/app/[locale]/soldiers/add/add-soldier.module.css"
import { FormProvider, useForm } from "@conform-to/react"
import { parseWithZod } from "@conform-to/zod"
import { soldierCreationSchema } from "@/models/validations/soldier-validators"
import Image from "next/image"
import Heading, { HeadingTypes } from "@/components/heading/heading.component"
import FormField from "@/components/form-field/form-field.component"
import ArrayField from "@/components/array-field/array-field.component"

// Type pour les documents historiques
type HistoricalDocument = {
    id: string
    file: File | null
    caption: string
    previewUrl: string
}

// const AddSoldier = ({ defaultValue }: { defaultValue?: SoldierDTO }) => {
const AddSoldier = () => {

    // État pour useActionState
    const [lastResult, action, isPending] = useActionState(createSoldier, undefined)

    // États pour les champs dynamiques
    const [medals, setMedals] = useState([""])

    // État pour la photo principale
    const [mainPhotoPreview, setMainPhotoPreview] = useState("")
    const mainPhotoRef = useRef<HTMLInputElement>(null)

    // État pour les documents historiques
    const [historicalDocuments, setHistoricalDocuments] = useState<HistoricalDocument[]>([
        { id: crypto.randomUUID(), file: null, caption: "", previewUrl: "" },
    ])

    // Configuration du formulaire avec conform
    const [form, fields] = useForm({
        // lastResult,
        defaultValue: { campaigns: [''], medals: [''] },
        onValidate({ formData }) {
            return parseWithZod(formData, {
                schema: soldierCreationSchema(null)
            })
        },
        shouldValidate: "onBlur",
        shouldRevalidate: "onInput",
    })

    // Gérer la prévisualisation de la photo principale
    const handleMainPhotoChange = () => {
        const file = mainPhotoRef.current?.files?.[0]
        if (file) {
            setMainPhotoPreview(URL.createObjectURL(file))
        }
    }

    // Ajouter un nouveau document historique
    const addHistoricalDocument = () => {
        setHistoricalDocuments([
            ...historicalDocuments,
            { id: crypto.randomUUID(), file: null, caption: "", previewUrl: "" },
        ])
    }

    // Supprimer un document historique
    const removeHistoricalDocument = (id: string) => {
        setHistoricalDocuments(historicalDocuments.filter((doc) => doc.id !== id))
    }

    // Mettre à jour un document historique
    const updateHistoricalDocument = (id: string, updates: Partial<HistoricalDocument>) => {
        setHistoricalDocuments(historicalDocuments.map((doc) => (doc.id === id ? { ...doc, ...updates } : doc)))
    }

    // Gérer le changement de fichier pour un document historique
    const handleDocumentFileChange = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const previewUrl = URL.createObjectURL(file)
            updateHistoricalDocument(id, { file, previewUrl })
        }
    }

    // Gérer le changement de légende pour un document historique
    const handleCaptionChange = (id: string, caption: string) => {
        updateHistoricalDocument(id, { caption })
    }

    // Préparer les données du formulaire avant soumission
    const prepareFormData = (formData: FormData) => {
        // Ajouter les documents historiques au FormData
        historicalDocuments.forEach((doc, index) => {
            if (doc.file) {
                formData.append(`historicalDocuments[${index}].file`, doc.file)
                formData.append(`historicalDocuments[${index}].caption`, doc.caption)
            }
        })

        return formData
    }

    return (
        <div className={styles.addSoldier}>
            <Heading text="Nouveau soldat" type={HeadingTypes.H2} />
            <main className={`container ${styles.main}`}>
                {/* {lastResult?.error?.internal && (
          <div className={`${styles.alert} ${styles.alertError}`}>{lastResult.error.internal}</div>
        )} */}
                <FormProvider context={form.context}>
                    <form
                        id={form.id}
                        onSubmit={form.onSubmit}
                        action={action}
                        className={styles.form}
                    >
                        <div className={styles.formGrid}>
                            {/* Informations Personnelles */}
                            <div className={styles.section}>
                                <div className={styles.sectionTitle}>
                                    <Heading text="Informations Personnelles" type={HeadingTypes.H3} />
                                </div>

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
                            <div className={styles.section}>
                                <div className={styles.sectionTitle}>
                                    <Heading text="Informations Militaires" type={HeadingTypes.H3} />
                                </div>

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
                        {/* <h2 className={styles.sectionTitle}>Photos et Documents</h2> */}

                        {/* Photo principale */}
                        <div className={styles.section}>
                            <h3 className={styles.label}>Photo Principale</h3>
                            <div className={styles.uploadCard}>
                                <div className={styles.uploadContent}>
                                    <div className={styles.uploadArea} onClick={() => !isPending && mainPhotoRef.current?.click()}>
                                        {!mainPhotoPreview && (
                                            <>
                                                <Image
                                                    src="/icons/upload.svg"
                                                    alt={"icon"}
                                                    width={16}
                                                    height={16}
                                                    className={styles.uploadIcon}
                                                />
                                                <p className={styles.uploadLabel}>Photo Principale</p>
                                                <p className={styles.uploadHint}>Cliquez pour télécharger</p>
                                            </>
                                        )}
                                        {/* <input
                                        key={fields.mainPhoto?.key}
                                        id={fields.mainPhoto?.id}
                                        name={fields.mainPhoto?.name}
                                        className="hidden"
                                        accept="image/*"
                                        type="file"
                                        ref={mainPhotoRef}
                                        onChange={handleMainPhotoChange}
                                        disabled={isPending}
                                        style={{ display: "none" }}
                                        required
                                    /> */}
                                    </div>
                                    {mainPhotoPreview && (
                                        <ImagePreview src={mainPhotoPreview || "/placeholder.svg"} />
                                    )}
                                    {/* {fields.mainPhoto?.errors && <p className={styles.error}>{fields.mainPhoto.errors}</p>} */}
                                    <p className={styles.uploadFormat}>Format: JPG, PNG. Max: 5MB</p>
                                </div>
                            </div>
                        </div>

                        {/* Documents historiques */}
                        <div className={styles.section}>
                            <div className={styles.fieldHeader}>
                                <h3 className={styles.label}>Documents Historiques</h3>
                                <button type="button" className={styles.addBtn} onClick={addHistoricalDocument} disabled={isPending}>
                                    {/* <Plus className={styles.addIcon} /> */}
                                    <Image
                                        src="/icons/add.svg"
                                        alt={"icon"}
                                        width={16}
                                        height={16}
                                        className={styles.addIcon}
                                    />
                                    Ajouter
                                </button>
                            </div>

                            <div className={styles.documentsGrid}>
                                {historicalDocuments.map((doc) => (
                                    <div key={doc.id} className={styles.documentCard}>
                                        <div className={styles.documentHeader}>
                                            <h4 className={styles.documentTitle}>Document historique</h4>
                                            {historicalDocuments.length > 1 && (
                                                <button
                                                    type="button"
                                                    className={styles.documentRemoveBtn}
                                                    onClick={() => removeHistoricalDocument(doc.id)}
                                                    disabled={isPending}
                                                >
                                                    <Image
                                                        src="/icons/trash.svg"
                                                        alt={"icon"}
                                                        width={16}
                                                        height={16}
                                                    />
                                                    {/* <Trash2 size={16} /> */}
                                                </button>
                                            )}
                                        </div>

                                        <div
                                            className={styles.uploadArea}
                                            onClick={() => {
                                                if (!isPending) {
                                                    const fileInput = document.getElementById(`document-${doc.id}`) as HTMLInputElement
                                                    fileInput?.click()
                                                }
                                            }}
                                        >
                                            {!doc.previewUrl && (
                                                <>
                                                    <Image
                                                        src="/icons/upload.svg"
                                                        alt={"icon"}
                                                        width={16}
                                                        height={16}
                                                        className={styles.uploadIcon}
                                                    />
                                                    {/* <Upload className={styles.uploadIcon} /> */}
                                                    <p className={styles.uploadLabel}>Document Historique</p>
                                                    <p className={styles.uploadHint}>Cliquez pour télécharger</p>
                                                </>
                                            )}
                                            <input
                                                id={`document-${doc.id}`}
                                                type="file"
                                                name={`document-${doc.id}`}
                                                className="hidden"
                                                accept="image/*"
                                                onChange={(e) => handleDocumentFileChange(doc.id, e)}
                                                disabled={isPending}
                                                style={{ display: "none" }}
                                            />
                                        </div>

                                        {doc.previewUrl && (
                                            <ImagePreview src={doc.previewUrl || "/placeholder.svg"} />
                                        )}

                                        <div className={styles.field}>
                                            <label htmlFor={`caption-${doc.id}`} className={styles.label}>
                                                Légende
                                            </label>
                                            <input
                                                id={`caption-${doc.id}`}
                                                type="text"
                                                value={doc.caption}
                                                onChange={(e) => handleCaptionChange(doc.id, e.target.value)}
                                                placeholder="Décrivez ce document..."
                                                className={styles.input}
                                                disabled={isPending}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Submit Buttons */}
                        <div className={styles.actions}>
                            <Link href="/soldiers">
                                <button type="button" className={styles.cancelBtn} disabled={isPending}>
                                    Annuler
                                </button>
                            </Link>
                            <button className={styles.submitBtn} disabled={isPending}>
                                {isPending ? <span className={styles.loadingSpinner}></span> : "Enregistrer le Soldat"}
                            </button>
                        </div>
                    </form>
                </FormProvider>
            </main>
        </div>
    )
}

export default AddSoldier;