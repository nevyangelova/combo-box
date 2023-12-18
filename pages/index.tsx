import * as React from 'react';
import styled from 'styled-components';
import countries from '../src/utils/countries';
import ComboBox from '../src/components/ComboBox';
import {formatCountry} from '../src/utils/ComboBoxUtils';

const StyledPageContent = styled.div`
    margin: 10rem;
`;

const comboBoxCountries = countries.map((country) => ({
    label: formatCountry(country),
    value: country.code,
}));

export default function LandingPage() {
    return (
        <StyledPageContent>
            <h1>Demo</h1>
            <ComboBox options={comboBoxCountries} />
            <p>
                The ComboBox component is a custom dropdown input that allows
                users to select options from a list. It is designed to replicate
                the UX of Chrome&apos;s URL bar and supports keyboard navigation
                and accessibility.
            </p>
        </StyledPageContent>
    );
}
