import React, {useState, useRef, useEffect, useCallback, useMemo} from 'react';
import {
    ComboBoxRoot,
    InputField,
    OptionsList,
    OptionItem,
} from './ComboBox.root';
import {useComboBox} from '../hooks/useComboBox';

/**
 * ComboBox component that allows users to select an option from a dropdown list.
 * @param {ComboBoxItem[]} options - Array of items to choose from.
 * @returns The ComboBox component with input field and dropdown list.
 */
interface ComboBoxItem {
    label: string;
    value: string;
}
interface ComboBoxProps {
    options: ComboBoxItem[];
    onChange?: (option: ComboBoxItem) => void;
}

const ComboBox: React.FC<ComboBoxProps> = React.memo(({options, onChange}) => {
    const [inputValue, setInputValue] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const blurTimeoutRef = useRef<number | null>(null);

    const {
        isOpen,
        setIsOpen,
        highlightedIndex,
        filteredOptions,
        handleKeyDown,
        optionsListRef,
    } = useComboBox({options, inputValue, setInputValue});

    useEffect(() => {
        if (!isOpen) {
            inputRef.current?.focus();
        }
    }, [isOpen]);

    useEffect(() => {
        return () => {
            // Clear timeout on unmount
            if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
        };
    }, []);

    /**
     * Handles changes in the ComboBox input field.
     * @param {React.ChangeEvent<HTMLInputElement>} event - The change event from the input field.
     */
    const handleInputChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setInputValue(event.target.value);
            setIsOpen(event.target.value.length > 0);
            onChange?.(event.target.value as unknown as ComboBoxItem);
        },
        [setInputValue, setIsOpen, onChange]
    );

    /**
     * Handles clicking on an option in the dropdown list.
     * @param {ComboBoxItem} option - The selected option.
     */
    const handleOptionClick = useCallback(
        (option: ComboBoxItem) => {
            setInputValue(option.label);
            setIsOpen(false);
            inputRef.current?.focus();
            onChange?.(option);
        },
        [setInputValue, setIsOpen, onChange]
    );

    const optionClickCallbacks = useMemo(
        () => filteredOptions.map((option) => () => handleOptionClick(option)),
        [filteredOptions, handleOptionClick]
    );

    /**
     * Handles blur events on the input field.
     */
    const handleBlur = () => {
        blurTimeoutRef.current = window.setTimeout(() => {
            setIsOpen(false);
        }, 100);
    };

    return (
        <ComboBoxRoot>
            <InputField
                role='combobox'
                ref={inputRef}
                type='text'
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
                aria-activedescendant={
                    highlightedIndex !== -1
                        ? `option-${filteredOptions[highlightedIndex]?.value}`
                        : undefined
                }
            />
            {isOpen && (
                <OptionsList
                    role='listbox'
                    aria-expanded={isOpen}
                    ref={optionsListRef}
                >
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map((option, index) => (
                            <OptionItem
                                id={`option-${option.value}`}
                                role='option'
                                aria-selected={highlightedIndex === index}
                                key={index}
                                onClick={optionClickCallbacks[index]}
                                highlighted={highlightedIndex === index}
                            >
                                {option.label}
                            </OptionItem>
                        ))
                    ) : (
                        <OptionItem highlighted={false}>
                            No options available
                        </OptionItem>
                    )}
                </OptionsList>
            )}
        </ComboBoxRoot>
    );
});

export default ComboBox;
