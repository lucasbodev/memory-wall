import { FieldMetadata, FieldName, useField } from "@conform-to/react";
import FileUploadField from "@/components/form/file-upload-field/file-upload-field.component";
import formStyles from "@/components/form/form.module.css";
import styles from "@/components/form/file-upload-array-field/file-upload-array-field.module.css";
import { Document } from "@/models/validations/soldier-validators";
import FormField from "@/components/form/form-field/form-field.component";

interface FileUploadArrayFieldProps {
    label: string;
    name: FieldName<unknown, Record<string, unknown>, string[]>;
    fieldList: FieldMetadata<Document>[];
    isPending?: boolean;
}

const FileUploadArrayField = ({ label, name, fieldList, isPending }: FileUploadArrayFieldProps) => {

    const [meta, form] = useField(name);

    return (
        <div className={formStyles.section}>
            <div className={formStyles.fieldHeader}>
                <h3 className={formStyles.label}>{label}</h3>
                <button
                    {...form.insert.getButtonProps({ name: name })}
                    className={formStyles.addBtn}
                    disabled={isPending}
                >
                    <img src="/icons/add.svg" alt="Ajouter" className={formStyles.addIcon} />
                    Ajouter
                </button>
            </div>

            <div className={styles.documentsGrid}>
                {fieldList.map((field, index) => (
                    <div key={field.key} className={styles.documentCard}>
                        <div className={styles.documentHeader}>
                            <h4 className={styles.documentTitle}>Document {index + 1}</h4>
                            {
                                fieldList.length > 1 && (
                                    <button
                                        {...form.remove.getButtonProps({ name: name, index })}
                                        className={styles.documentRemoveBtn}
                                        disabled={isPending}
                                    >
                                        <img src="/icons/trash.svg" alt="Supprimer" width={16} height={16} />
                                    </button>
                                )
                            }
                        </div>

                        <FileUploadField
                            label="Fichier"
                            meta={field.getFieldset().file}
                            isPending={isPending}
                            accept="image/*,application/pdf"
                        />

                        <FormField meta={field.getFieldset().caption} label="Légende" isPending={isPending} />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default FileUploadArrayField;