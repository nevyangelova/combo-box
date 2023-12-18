/**
 * `ComboBoxRoot` is the container component for the ComboBox.
 * It positions the dropdown list relative to the input field
 * and sets the font to match Material-UI's default typography.
 */

import styled, {css} from 'styled-components';

interface OptionItemProps {
    highlighted: boolean;
}

export const ComboBoxRoot = styled.div`
    position: relative;
    margin: 20px auto;
    width: 100%;
    font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;
`;

export const InputField = styled.input`
    width: 100%;
    padding: 12px 20px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 16px;
    box-sizing: border-box;

    &:hover {
        border-color: #b0b0b0;
    }

    &:focus {
        outline: none;
        border-color: #3f51b5;
        box-shadow: 0 0 0 2px rgba(63, 81, 181, 0.2);
    }
`;

export const OptionsList = styled.ul`
    position: absolute;
    list-style: none;
    margin: 0;
    padding: 0;
    width: 100%;
    max-height: 500px;
    z-index: 1;
    overflow-y: scroll;
    background-color: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    border-radius: 4px;
    border: 1px solid #ccc;
`;

const highlightedStyle = css`
    background-color: #f4f4f4;
    color: #3f51b5;
`;

export const OptionItem = styled.li<OptionItemProps>`
    padding: 12px 20px;
    cursor: pointer;
    transition: background-color 0.2s, color 0.2s;

    ${(props) => props.highlighted && highlightedStyle}

    &:hover {
        ${highlightedStyle}
    }
`;
