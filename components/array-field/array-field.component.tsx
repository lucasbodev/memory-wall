import React from "react";
import styles from "@/components/array-field/array-field.module.css";
import Image from "next/image";
import { FieldMetadata, FieldName, FormMetadata, useField, useFormMetadata } from "@conform-to/react";
import FormField from "@/components/form-field/form-field.component";

interface ArrayFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    name: FieldName<unknown, Record<string, unknown>, string[]>;
    label: string;
    fieldList: FieldMetadata<string | number>[];
    isPending?: boolean;
}

const ArrayField = ({ name, fieldList, label, isPending = false, ...props }: ArrayFieldProps) => {

    const [meta, form] = useField(name);
    const { placeholder } = props;

    return (
        <div className={styles.field}>
            <div className={styles.fieldHeader}>
                <label className={styles.label}>{label}</label>
                <button className={styles.addBtn} disabled={isPending}
                    {...form.insert.getButtonProps({
                        name: meta.name,
                    })}>
                    <Image src="/icons/add.svg" alt="Ajouter" width={16} height={16} className={styles.addIcon} />
                    Ajouter
                </button>
            </div>

            {fieldList.map((field, index) => (
                <div key={field.key} className={styles.arrayField}>
                    <FormField
                        meta={field}
                        placeholder={`${placeholder} ${index + 1}`}
                        isPending={isPending}
                    />

                    {fieldList.length > 1 && (
                        <button
                            className={styles.removeBtn}
                            disabled={isPending}
                            {...form.remove.getButtonProps({
                                name: meta.name,
                                index,
                            })}
                        >
                            <Image src="/icons/close.svg" alt="Supprimer" width={16} height={16} className={styles.removeIcon} />
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
};

export default ArrayField;