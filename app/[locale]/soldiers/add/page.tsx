"use client"

import type React from "react"
import { useRef, useState } from "react"
import Link from "next/link"
// import { ArrowLeft, Plus, X, Upload, Trash2 } from "lucide-react"
import { useActionState } from "react"
import { createSoldier, SoldierDTO } from "@/actions/soldier-actions"
import ImagePreview from "@/components/image-preview/image-preview"
import styles from "@/app/[locale]/soldiers/add/add-soldier.module.css"
import { useForm } from "@conform-to/react"
import { parseWithZod } from "@conform-to/zod"
import { soldierCreationSchema } from "@/models/validations/soldier-validators"
import Image from "next/image"

// Type pour les documents historiques
type HistoricalDocument = {
    id: string
    file: File | null
    caption: string
    previewUrl: string
}

const AddSoldier = ({ defaultValue }: { defaultValue?: SoldierDTO }) => {
    // État pour useActionState
    const [lastResult, action, isPending] = useActionState(createSoldier, undefined)

    // États pour les champs dynamiques
    const [campaigns, setCampaigns] = useState([""])
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
        defaultValue,
        onValidate({ formData }) {
            return parseWithZod(formData, {
                schema: soldierCreationSchema(null)
            })
        },
        shouldValidate: "onBlur",
        shouldRevalidate: "onInput",
    })

    // Gérer l'ajout/suppression des champs de campagne
    const addCampaign = () => {
        setCampaigns([...campaigns, ""])
    }

    const removeCampaign = (index: number) => {
        const newCampaigns = [...campaigns]
        newCampaigns.splice(index, 1)
        setCampaigns(newCampaigns)
    }

    // Gérer l'ajout/suppression des champs de médaille
    const addMedal = () => {
        setMedals([...medals, ""])
    }

    const removeMedal = (index: number) => {
        const newMedals = [...medals]
        newMedals.splice(index, 1)
        setMedals(newMedals)
    }

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
            {/* Header */}
            <header className="header">
                <div className="container header__container">
                    <div className="header__nav">
                        <Link href="/soldiers" className="header__back-btn">
                            <Image
                                src="/icons/arrow-left.svg"
                                alt={"icon"}
                                width={16}
                                height={16}
                            />
                            {/* <ArrowLeft className="h-6 w-6" /> */}
                        </Link>
                        <h1 className="header__title">Ajouter un Soldat</h1>
                    </div>
                </div>
            </header>

            <main className={`container ${styles.main}`}>
                {/* {lastResult?.error?.internal && (
          <div className={`${styles.alert} ${styles.alertError}`}>{lastResult.error.internal}</div>
        )} */}

                <form
                    id={form.id}
                    onSubmit={form.onSubmit}
                    action={(formData) => action(prepareFormData(formData))}
                    className={styles.form}
                >
                    <div className={styles.formGrid}>
                        {/* Informations Personnelles */}
                        <div className={styles.section}>
                            <h2 className={styles.sectionTitle}>Informations Personnelles</h2>

                            <div className={styles.field}>
                                <label htmlFor={fields.name.id} className={styles.label}>
                                    Nom Complet
                                </label>
                                <input
                                    key={fields.name.key}
                                    id={fields.name.id}
                                    name={fields.name.name}
                                    defaultValue={fields.name.value ?? fields.name.initialValue}
                                    className={`${styles.input} ${fields.name.errors ? styles.inputError : ""}`}
                                    disabled={isPending}
                                    required
                                />
                                {fields.name.errors && <p className={styles.error}>{fields.name.errors}</p>}
                            </div>

                            <div className={styles.field}>
                                <label htmlFor={fields.rank.id} className={styles.label}>
                                    Grade
                                </label>
                                <input
                                    key={fields.rank.key}
                                    id={fields.rank.id}
                                    name={fields.rank.name}
                                    defaultValue={fields.rank.value ?? fields.rank.initialValue}
                                    className={`${styles.input} ${fields.rank.errors ? styles.inputError : ""}`}
                                    disabled={isPending}
                                    required
                                />
                                {fields.rank.errors && <p className={styles.error}>{fields.rank.errors}</p>}
                            </div>

                            <div className={styles.field}>
                                <label htmlFor={fields.unit.id} className={styles.label}>
                                    Unité
                                </label>
                                <input
                                    key={fields.unit.key}
                                    id={fields.unit.id}
                                    name={fields.unit.name}
                                    defaultValue={fields.unit.value ?? fields.unit.initialValue}
                                    className={`${styles.input} ${fields.unit.errors ? styles.inputError : ""}`}
                                    disabled={isPending}
                                    required
                                />
                                {fields.unit.errors && <p className={styles.error}>{fields.unit.errors}</p>}
                            </div>

                            <div className={styles.fieldRow}>
                                <div className={styles.field}>
                                    <label htmlFor={fields.born.id} className={styles.label}>
                                        Date de Naissance
                                    </label>
                                    <input
                                        key={fields.born.key}
                                        id={fields.born.id}
                                        name={fields.born.name}
                                        type="date"
                                        defaultValue={fields.born.value ?? fields.born.initialValue}
                                        className={`${styles.input} ${fields.born.errors ? styles.inputError : ""}`}
                                        disabled={isPending}
                                        required
                                    />
                                    {fields.born.errors && <p className={styles.error}>{fields.born.errors}</p>}
                                </div>
                                <div className={styles.field}>
                                    <label htmlFor={fields.died.id} className={styles.label}>
                                        Date de Décès
                                    </label>
                                    <input
                                        key={fields.died.key}
                                        id={fields.died.id}
                                        name={fields.died.name}
                                        type="date"
                                        defaultValue={fields.died.value ?? fields.died.initialValue}
                                        className={`${styles.input} ${fields.died.errors ? styles.inputError : ""}`}
                                        disabled={isPending}
                                    />
                                    {fields.died.errors && <p className={styles.error}>{fields.died.errors}</p>}
                                </div>
                            </div>

                            <div className={styles.field}>
                                <label htmlFor={fields.birthplace.id} className={styles.label}>
                                    Lieu de Naissance
                                </label>
                                <input
                                    key={fields.birthplace.key}
                                    id={fields.birthplace.id}
                                    name={fields.birthplace.name}
                                    defaultValue={fields.birthplace.value ?? fields.birthplace.initialValue}
                                    className={`${styles.input} ${fields.birthplace.errors ? styles.inputError : ""}`}
                                    disabled={isPending}
                                    required
                                />
                                {fields.birthplace.errors && <p className={styles.error}>{fields.birthplace.errors}</p>}
                            </div>

                            <div className={styles.fieldRow}>
                                <div className={styles.field}>
                                    <label htmlFor={fields.serviceStart.id} className={styles.label}>
                                        Début de Service
                                    </label>
                                    <input
                                        key={fields.serviceStart.key}
                                        id={fields.serviceStart.id}
                                        name={fields.serviceStart.name}
                                        type="number"
                                        min="1939"
                                        max="1945"
                                        placeholder="1939"
                                        defaultValue={fields.serviceStart.value ?? fields.serviceStart.initialValue}
                                        className={`${styles.input} ${fields.serviceStart.errors ? styles.inputError : ""}`}
                                        disabled={isPending}
                                        required
                                    />
                                    {fields.serviceStart.errors && <p className={styles.error}>{fields.serviceStart.errors}</p>}
                                </div>
                                <div className={styles.field}>
                                    <label htmlFor={fields.serviceEnd.id} className={styles.label}>
                                        Fin de Service
                                    </label>
                                    <input
                                        key={fields.serviceEnd.key}
                                        id={fields.serviceEnd.id}
                                        name={fields.serviceEnd.name}
                                        type="number"
                                        min="1939"
                                        max="1945"
                                        placeholder="1945"
                                        defaultValue={fields.serviceEnd.value ?? fields.serviceEnd.initialValue}
                                        className={`${styles.input} ${fields.serviceEnd.errors ? styles.inputError : ""}`}
                                        disabled={isPending}
                                        required
                                    />
                                    {fields.serviceEnd.errors && <p className={styles.error}>{fields.serviceEnd.errors}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Informations Militaires */}
                        <div className={styles.section}>
                            <h2 className={styles.sectionTitle}>Informations Militaires</h2>

                            <div className={styles.field}>
                                <label htmlFor={fields.biography.id} className={styles.label}>
                                    Biographie
                                </label>
                                <textarea
                                    key={fields.biography.key}
                                    id={fields.biography.id}
                                    name={fields.biography.name}
                                    rows={5}
                                    defaultValue={fields.biography.value ?? fields.biography.initialValue}
                                    className={`${styles.textarea} ${fields.biography.errors ? styles.textareaError : ""}`}
                                    disabled={isPending}
                                    required
                                />
                                {fields.biography.errors && <p className={styles.error}>{fields.biography.errors}</p>}
                            </div>

                            <div className={styles.field}>
                                <label htmlFor={fields.quote.id} className={styles.label}>
                                    Citation
                                </label>
                                <textarea
                                    key={fields.quote.key}
                                    id={fields.quote.id}
                                    name={fields.quote.name}
                                    rows={2}
                                    defaultValue={fields.quote.value ?? fields.quote.initialValue}
                                    className={`${styles.textarea} ${fields.quote.errors ? styles.textareaError : ""}`}
                                    disabled={isPending}
                                />
                                {fields.quote.errors && <p className={styles.error}>{fields.quote.errors}</p>}
                            </div>

                            <div className={styles.field}>
                                <div className={styles.fieldHeader}>
                                    <label className={styles.label}>Campagnes Militaires</label>
                                    <button type="button" className={styles.addBtn} onClick={addCampaign} disabled={isPending}>
                                        <Image
                                            src="/icons/add.svg"
                                            alt={"icon"}
                                            width={16}
                                            height={16}
                                            className={styles.addIcon}
                                        />
                                        {/* <Plus className={styles.addIcon} /> */}
                                        Ajouter
                                    </button>
                                </div>

                                {campaigns.map((campaign, index) => (
                                    <div key={index} className={styles.arrayField}>
                                        <input
                                            name="campaigns"
                                            value={campaign}
                                            onChange={(e) => {
                                                const newCampaigns = [...campaigns]
                                                newCampaigns[index] = e.target.value
                                                setCampaigns(newCampaigns)
                                            }}
                                            placeholder={`Campagne ${index + 1}`}
                                            className={styles.input}
                                            disabled={isPending}
                                        />
                                        {campaigns.length > 1 && (
                                            <button
                                                type="button"
                                                className={styles.removeBtn}
                                                onClick={() => removeCampaign(index)}
                                                disabled={isPending}
                                            >
                                                <Image
                                                    src="/icons/close.svg"
                                                    alt={"icon"}
                                                    width={16}
                                                    height={16}
                                                    className={styles.removeIcon}
                                                />
                                                {/* <X className={styles.removeIcon} /> */}
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className={styles.field}>
                                <div className={styles.fieldHeader}>
                                    <label className={styles.label}>Décorations et Médailles</label>
                                    <button type="button" className={styles.addBtn} onClick={addMedal} disabled={isPending}>
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

                                {medals.map((medal, index) => (
                                    <div key={index} className={styles.arrayField}>
                                        <input
                                            name="medals"
                                            value={medal}
                                            onChange={(e) => {
                                                const newMedals = [...medals]
                                                newMedals[index] = e.target.value
                                                setMedals(newMedals)
                                            }}
                                            placeholder={`Médaille ${index + 1}`}
                                            className={styles.input}
                                            disabled={isPending}
                                        />
                                        {medals.length > 1 && (
                                            <button
                                                type="button"
                                                className={styles.removeBtn}
                                                onClick={() => removeMedal(index)}
                                                disabled={isPending}
                                            >
                                                <Image
                                                    src="/icons/close.svg"
                                                    alt={"icon"}
                                                    width={16}
                                                    height={16}
                                                    className={styles.removeIcon}
                                                />
                                                {/* <X className={styles.removeIcon} /> */}
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Photo Uploads */}
                    <h2 className={styles.sectionTitle}>Photos et Documents</h2>

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
                                            {/* <Upload className={styles.uploadIcon} /> */}
                                            <p className={styles.uploadLabel}>Photo Principale</p>
                                            <p className={styles.uploadHint}>Cliquez pour télécharger</p>
                                        </>
                                    )}
                                    <input
                                        // key={fields.mainPhoto?.key}
                                        // id={fields.mainPhoto?.id}
                                        // name={fields.mainPhoto?.name}
                                        className="hidden"
                                        accept="image/*"
                                        type="file"
                                        ref={mainPhotoRef}
                                        onChange={handleMainPhotoChange}
                                        disabled={isPending}
                                        style={{ display: "none" }}
                                        required
                                    />
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
                                Ajouter un document
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
                                        <ImagePreview src={doc.previewUrl || "/placeholder.svg"}/>
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
                        <button type="submit" className={styles.submitBtn} disabled={isPending}>
                            {isPending ? <span className={styles.loadingSpinner}></span> : "Enregistrer le Soldat"}
                        </button>
                    </div>
                </form>
            </main>

            <footer className="footer">
                <div className="container footer__container">
                    <p>© {new Date().getFullYear()} Musée Mémorial des Combattants</p>
                    <p className="footer__text">
                        Cette application permet de découvrir l'histoire des soldats à travers des QR codes placés sur leurs photos.
                    </p>
                </div>
            </footer>
        </div>
    )
}

export default AddSoldier;