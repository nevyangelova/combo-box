import { useState, useEffect, KeyboardEvent, useRef, useMemo, useCallback } from 'react';
import { debounce } from 'lodash';

/**
 * Custom hook for managing ComboBox state and keyboard interactions.
 *
 * @param options - Array of items to be displayed as options in the ComboBox.
 * @param inputValue - Current value of the ComboBox input field.
 * @param setInputValue - Function to set the value of the input field.
 * @returns ComboBoxHookReturn object containing:
 * - isOpen: State controlling the visibility of the options dropdown.
 * - setIsOpen: Function to set the isOpen state.
 * - highlightedIndex: Index of the currently highlighted option via keyboard navigation.
 * - setHighlightedIndex: Function to set the highlightedIndex state.
 * - filteredOptions: Array of objects that match the inputValue.
 * - handleKeyDown: Function to handle keyboard navigation within the options dropdown.
 */
interface ComboBoxItem {
  label: string;
  value: string;
}

interface ComboBoxHookProps {
  options: ComboBoxItem[];
  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
}

interface ComboBoxHookReturn {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  highlightedIndex: number;
  setHighlightedIndex: (index: number) => void;
  filteredOptions: ComboBoxItem[];
  handleKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
  optionsListRef: React.RefObject<HTMLUListElement>;
}

export const useComboBox = ({
  options,
  inputValue,
  setInputValue,
}: ComboBoxHookProps): ComboBoxHookReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const optionsListRef = useRef<HTMLUListElement>(null);

  const debouncedSearch = useMemo(
    () =>
      debounce(() => {
        setHighlightedIndex(inputValue ? 0 : -1);
      }, 300),
    [inputValue],
  );

  useEffect(() => {
    debouncedSearch();
    return () => {
      debouncedSearch.cancel();
    };
  }, [inputValue, debouncedSearch]);

  useEffect(() => {
    if (highlightedIndex !== -1 && isOpen && optionsListRef.current) {
      const list = optionsListRef.current;
      const activeItem = list.children[highlightedIndex] as HTMLElement;
      if (activeItem) {
        const listHeight = list.clientHeight;
        const itemTop = activeItem.offsetTop;
        const itemHeight = activeItem.clientHeight;

        // Determine the scroll behavior based on the position of the highlighted item
        if (itemTop < list.scrollTop) {
          // Scroll up to make the item fully visible at the top
          list.scrollTop = itemTop;
        } else if (itemTop + itemHeight > list.scrollTop + listHeight) {
          // Scroll down to make the item fully visible at the bottom
          list.scrollTop = itemTop + itemHeight - listHeight;
        }
      }
    }
  }, [highlightedIndex, isOpen]);

  /**
   * filteredOptions Calculation:
   * - Options are filtered based on the presence of inputValue in the label property of each Country object.
   */
  const filteredOptions = useMemo(() => {
    return options.filter((option) =>
      option.label.toLowerCase().includes(inputValue.toLowerCase()),
    );
  }, [options, inputValue]);

  /**
   * handleKeyDown Logic:
   * - 'ArrowDown' and 'ArrowUp' move the highlightedIndex within the range of filteredOptions.
   * - 'Enter' sets the input value to the label of the highlighted option and closes the dropdown.
   * - 'Escape' closes the dropdown without selecting an option.
   */
  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          setHighlightedIndex((prevIndex) =>
            prevIndex < filteredOptions.length - 1 ? prevIndex + 1 : 0,
          );
          break;
        case 'ArrowUp':
          event.preventDefault();
          setHighlightedIndex((prevIndex) =>
            prevIndex > 0 ? prevIndex - 1 : filteredOptions.length - 1,
          );
          break;
        case 'Enter':
          event.preventDefault();
          if (highlightedIndex < 0 && filteredOptions.length > 0) {
            setHighlightedIndex(0);
            const selectedOption = filteredOptions[0];
            setInputValue(selectedOption.label);
            setIsOpen(false);
          } else if (highlightedIndex >= 0) {
            const selectedOption = filteredOptions[highlightedIndex];
            setInputValue(selectedOption.label);
            setIsOpen(false);
          }
          break;
        case 'Escape':
          setIsOpen(false);
          break;
        default:
          break;
      }
    },
    [highlightedIndex, filteredOptions, setInputValue],
  );

  return {
    isOpen,
    setIsOpen,
    highlightedIndex,
    setHighlightedIndex,
    filteredOptions,
    handleKeyDown,
    optionsListRef,
  };
};

export default useComboBox;
