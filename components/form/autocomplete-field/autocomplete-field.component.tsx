'use client';

import { FieldMetadata, getInputProps } from '@conform-to/react';
import React, { useState, useRef } from 'react';
import formStyles from '@/components/form/form.module.css';

export interface AutocompleteItem {
    id?: string;
    name?: string;
}

interface AutocompleteFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    meta: FieldMetadata<AutocompleteItem | undefined>;
    suggestions: AutocompleteItem[];
    isPending?: boolean;
}

function highlightMatch(text: string, query: string) {
    const index = text.toLowerCase().indexOf(query.toLowerCase());
    if (index === -1 || !query) return text;

    const before = text.slice(0, index);
    const match = text.slice(index, index + query.length);
    const after = text.slice(index + query.length);

    return (
        <>
            {before}
            <strong className="font-semibold text-indigo-600 bg-yellow-100 rounded">
                {match}
            </strong>
            {after}
        </>
    );
}


const AutocompleteField = ({
    label,
    meta,
    suggestions,
    isPending,
    ...props
}: AutocompleteFieldProps) => {
    const autocompleteValue = meta.getFieldset();
    const { defaultValue: idDefaultValue, ...idProps } = getInputProps(autocompleteValue.id, { type: 'hidden' });
    const { defaultValue: nameDefaultValue, ...nameProps } = getInputProps(autocompleteValue.name, { type: 'text' });
    const [inputValue, setInputValue] = useState(nameDefaultValue ?? autocompleteValue.name.initialValue ?? "");
    const [selectedId, setSelectedId] = useState(idDefaultValue ?? autocompleteValue.id.initialValue ?? "");
    const [isOpen, setIsOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const listboxRef = useRef<HTMLUListElement>(null);
    const { placeholder } = props;
    const errorMessage = Array.isArray(autocompleteValue.name.errors) ? autocompleteValue.name.errors[0] : autocompleteValue.name.errors;

    const filteredSuggestions = suggestions
        .map((sugg) => {
            let index;
            if (sugg.name) {
                index = sugg.name.toLowerCase().indexOf(inputValue.toLowerCase());
            }
            return { ...sugg, matchIndex: index };
        })
        .filter((s) => s.matchIndex !== -1)
        .sort((a, b) => {
            if (a.name && b.name) {
                if (a.matchIndex === b.matchIndex) {
                    return a.name.localeCompare(b.name);
                }
                if (a.matchIndex && b.matchIndex) {
                    return a.matchIndex - b.matchIndex;

                }
            }
            return 0;
        });

    const handleSelect = (item: AutocompleteItem) => {
        if (item.id && item.name) {
            setSelectedId(item.id);
            setInputValue(item.name);
            setIsOpen(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setHighlightedIndex((prev) => Math.min(prev + 1, filteredSuggestions.length - 1));
            setIsOpen(true);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setHighlightedIndex((prev) => Math.max(prev - 1, 0));
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (highlightedIndex >= 0 && filteredSuggestions[highlightedIndex]) {
                handleSelect(filteredSuggestions[highlightedIndex]);
            }
        } else if (e.key === 'Escape') {
            setIsOpen(false);
        }
    };

    const normalize = (str: string) =>
        str.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, '');



    return (
        <div role="combobox" aria-expanded={isOpen} aria-haspopup="listbox" className={formStyles.field}>
            {label && (
                <label htmlFor={meta.id} className={formStyles.label}>
                    {label}
                </label>
            )}
            <input
                {...idProps}
                key={autocompleteValue.id.key}
                name={autocompleteValue.id.name}
                value={selectedId}
            />
            <input
                className={`${formStyles.input} ${errorMessage ? formStyles.inputError : ""}`}
                {...nameProps}
                key={autocompleteValue.name.key}
                value={inputValue}
                onChange={(e) => {
                    setInputValue(e.target.value);
                    setSelectedId("")
                    setIsOpen(true);
                }}
                onBlur={() => {
                    const match = suggestions.find(
                        (sugg) => {
                            if(sugg.name){
                                return normalize(sugg.name) === normalize(inputValue)
                            }
                        }
                    );
                    if (match) {
                        handleSelect(match);
                    }
                    setIsOpen(false);
                }}
                onKeyDown={handleKeyDown}
                aria-autocomplete="list"
                aria-controls="autocomplete-listbox"
                aria-activedescendant={
                    highlightedIndex >= 0 ? `autocomplete-option-${highlightedIndex}` : undefined
                }
                autoComplete="off"
                disabled={isPending}
                placeholder={placeholder}
            />

            {isOpen && filteredSuggestions.length > 0 && (
                <ul
                    id="autocomplete-listbox"
                    role="listbox"
                    ref={listboxRef}
                    className="absolute z-10 w-full border bg-white max-h-64 overflow-y-auto rounded shadow"
                >
                    {filteredSuggestions.map((item, index) => (
                        <li
                            key={item.id}
                            id={`autocomplete-option-${index}`}
                            role="option"
                            aria-selected={highlightedIndex === index}
                            className={`p-2 cursor-pointer ${highlightedIndex === index ? 'bg-gray-200' : ''
                                }`}
                            onMouseDown={() => handleSelect(item)}
                        >
                            {item.name && highlightMatch(item.name, inputValue)}
                        </li>
                    ))}
                </ul>
            )}
            {errorMessage && <p className={formStyles.error}>{errorMessage}</p>}
        </div>
    );
};

export default AutocompleteField;
