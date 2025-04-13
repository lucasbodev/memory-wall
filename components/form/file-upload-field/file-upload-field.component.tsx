'use client';

import React, { useRef, useState } from "react";
import { FieldMetadata } from "@conform-to/react";
import Image from "next/image";
import formStyles from "@/components/form/form.module.css";
import styles from "@/components/form/file-upload-field/file-upload-field.module.css";
import ImagePreview from "@/components/image-preview/image-preview"; // <- ton composant preview

interface FileUploadFieldProps {
  label: string;
  meta: FieldMetadata<File>;
  isPending?: boolean;
  accept?: string;
}

const FileUploadField = ({ label, meta, isPending = false, accept = "image/*", }: FileUploadFieldProps) =>{
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  return (
    <div className={styles.uploadCard}>
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
          {preview && <ImagePreview src={preview} />}
          <input
            // {...meta}
            id={meta.id}
            name={meta.name}
            ref={inputRef}
            type="file"
            onChange={handleChange}
            accept={accept}
            className="hidden"
            disabled={isPending}
          />
        </div>

        {meta.errors && <p className={formStyles.error}>{meta.errors}</p>}
        <p className={styles.uploadFormat}>Format: JPG, PNG. Max: 5MB</p>
      </div>
    </div>
  );
}

export default FileUploadField;