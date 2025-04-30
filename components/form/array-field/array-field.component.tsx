import React from "react";
import formStyles from "@/components/form/form.module.css";
import styles from "@/components/form/array-field/array-field.module.css";
import Image from "next/image";
import { FieldMetadata, FieldName, useField } from "@conform-to/react";
import AutocompleteField, { AutocompleteItem } from "@/components/form/autocomplete-field/autocomplete-field.component";
import FormField from "@/components/form/form-field/form-field.component";

interface ArrayFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    name: FieldName<unknown, Record<string, unknown>, string[]>;
    label: string;
    fieldList: FieldMetadata<string | number | AutocompleteItem>[];
    isPending?: boolean;
    isAutocomplete?: boolean;
    suggestions?: AutocompleteItem[];
}

function ArrayField({ name, fieldList, label, isPending = false, isAutocomplete, suggestions, ...props }: ArrayFieldProps) {

    const [meta, form] = useField(name);
    const { placeholder } = props;

    return (
        <div className={formStyles.field}>
            <div className={formStyles.fieldHeader}>
                <label className={formStyles.label}>{label}</label>
                <button className={formStyles.addBtn} disabled={isPending}
                    {...form.insert.getButtonProps({
                        name: meta.name,
                    })}>
                    <Image src="/icons/add.svg" alt="Ajouter" width={16} height={16} className={formStyles.addIcon} />
                    Ajouter
                </button>
            </div>

            {fieldList.map((field, index) => (
                <div key={field.key} className={styles.arrayField}>
                    {
                        isAutocomplete ? (
                            <AutocompleteField
                                meta={field as FieldMetadata<AutocompleteItem>}
                                suggestions={suggestions || []}
                                isPending={isPending}
                                placeholder={`${placeholder} ${index + 1}`}

                            />
                        ) : (
                            <FormField
                                meta={field as FieldMetadata<string | number>}
                                placeholder={`${placeholder} ${index + 1}`}
                                isPending={isPending}
                            />
                        )
                    }

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