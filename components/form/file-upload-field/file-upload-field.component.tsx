'use client';

import React, { useRef, useState, useEffect } from "react";
import { FieldMetadata, getInputProps } from "@conform-to/react";
import Image from "next/image";
import styles from "@/components/form/file-upload-field/file-upload-field.module.css";
import formStyles from "@/components/form/form.module.css";
import ImagePreview from "@/components/image-preview/image-preview";

interface FileUploadFieldProps {
  label: string;
  meta: FieldMetadata<string | File | undefined>;
  isPending?: boolean;
  accept?: string;
}

const FileUploadField = ({
  label,
  meta,
  isPending = false,
  accept = "image/*,.jpg,.jpeg,.png,.heic,.heif",
}: FileUploadFieldProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [hasNewFile, setHasNewFile] = useState(false);

  useEffect(() => {
    // Initialise la preview si une URL est présente
    if (typeof meta.value === "string" && !hasNewFile) {
      setPreview(meta.value);
    }
  }, [meta.value, hasNewFile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        setHasNewFile(true);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
      setHasNewFile(false);
    }
  };

  const { defaultValue, value, ...cleanInputProps } = getInputProps(meta, { type: "file" });
  const inputProps = hasNewFile ? cleanInputProps : {};

  return (
    <div className={`${styles.uploadCard} ${meta.errors && formStyles.inputError}`}>
      <div className={styles.uploadContent}>
        <div
          className={styles.uploadArea}
          onClick={() => !isPending && inputRef.current?.click()}
        >

          {!preview && (
            <>
              <Image
                src="/icons/upload.svg"
                alt="upload icon"
                width={16}
                height={16}
                className={styles.uploadIcon}
              />
              <p className={styles.uploadLabel}>{label}</p>
              <p className={styles.uploadHint}>Cliquez pour télécharger</p>
            </>
          )}
          {preview && preview.length && <ImagePreview src={preview} />}

          <input
            {...inputProps}
            // defaultValue={''}
            key={meta.key}
            ref={inputRef}
            type="file"
            onChange={handleChange}
            accept={accept}
            className={formStyles.hidden}
            disabled={isPending}
          />
        </div>

        {/* ⚠️ Valeur existante (URL) si pas de nouveau fichier sélectionné */}
        {!hasNewFile && typeof meta.value === "string" && (
          <input
            type="hidden"
            name={meta.name}
            value={meta.value}
          />
        )}

        {meta.errors && <p className={formStyles.error}>{meta.errors}</p>}
        <p className={styles.uploadFormat}>Format: JPG, PNG. Max: 4.5MB</p>
      </div>
    </div>
  );
};

export default FileUploadField;