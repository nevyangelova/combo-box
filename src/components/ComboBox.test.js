import * as React from 'react';
import {expect} from 'chai';
import {createClientRender, fireEvent, screen} from 'test/utils';
import {spy} from 'sinon';
import ComboBox from './ComboBox';

describe('<ComboBox />', () => {
    const render = createClientRender();
    const optionsMock = [
        {code: 'US', label: 'United States', phone: '+1'},
        {code: 'CA', label: 'Canada', phone: '+1'},
        {code: 'MX', label: 'Mexico', phone: '+52'},
        {code: 'FR', label: 'France', phone: '+33'},
        {code: 'DE', label: 'Germany', phone: '+49'},
        {code: 'RU', label: 'Russia', phone: '+7'},
        {code: 'JP', label: 'Japan', phone: '+81'},
        {code: 'CN', label: 'China', phone: '+86'},
        {code: 'IN', label: 'India', phone: '+91'},
    ];

    it('should prevent the default event handlers', () => {
        const handleSubmit = spy();
        const handleChange = spy();
        const {getAllByRole} = render(
            <div
                onKeyDown={(event) => {
                    if (!event.defaultPrevented && event.key === 'Enter') {
                        handleSubmit();
                    }
                }}
            >
                <ComboBox onChange={handleChange} options={optionsMock} />
            </div>
        );

        const textbox = screen.getByRole('combobox');
        fireEvent.change(textbox, {target: {value: 'Uni'}}); // open the popup on user input only to correcly replicate the omnibox UI
        fireEvent.keyDown(textbox, {key: 'ArrowDown'}); // focus the first option
        const options = getAllByRole('option');
        expect(textbox).to.have.attribute(
            'aria-activedescendant',
            options[0].getAttribute('id')
        );

        fireEvent.keyDown(textbox, {key: 'Enter'}); // select the first option
        expect(handleSubmit.callCount).to.equal(0);
        expect(handleChange.callCount).to.equal(1);
    });

    it('should handle empty options list', () => {
        render(<ComboBox options={[]} />);

        const textbox = screen.getByRole('combobox');
        fireEvent.click(textbox);
        expect(screen.queryAllByRole('option')).to.have.lengthOf(0);
    });

    it('should filter options based on input', async () => {
        render(<ComboBox options={optionsMock} />);
        const textbox = screen.getByRole('combobox');
        fireEvent.change(textbox, {target: {value: 'United'}});

        await screen.findByRole('option');

        const filteredOptions = screen.queryAllByRole('option');
        expect(filteredOptions).to.have.lengthOf(1);
    });

    it('should handle keyboard navigation', async () => {
        render(<ComboBox options={optionsMock} />);
        const textbox = screen.getByRole('combobox');
        fireEvent.change(textbox, {target: {value: 'Uni'}});

        await screen.findByRole('option');

        const options = screen.queryAllByRole('option');
        expect(options).to.have.length.above(0);
    });

    it('should display "No options available" when no options match the input', async () => {
        render(<ComboBox options={optionsMock} />);
        const textbox = screen.getByRole('combobox');
        fireEvent.change(textbox, {target: {value: 'ZZZ'}});

        await screen.findByText('No options available');

        const noOptionsMessage = screen.queryByText('No options available');
        expect(noOptionsMessage).to.not.equal(null);
    });

    it('should not select any option with non-existent input', () => {
        render(<ComboBox options={optionsMock} />);

        const textbox = screen.getByRole('combobox');
        fireEvent.change(textbox, {target: {value: 'ZZZ'}});
        expect(screen.queryAllByRole('option')).to.have.lengthOf(0);
    });

    it('should close the dropdown after an option is selected', async () => {
        render(<ComboBox options={optionsMock} />);
        const textbox = screen.getByRole('combobox');
        fireEvent.change(textbox, {target: {value: 'United'}});

        await screen.findByRole('option');

        const firstOption = screen.getAllByRole('option')[0];
        fireEvent.click(firstOption);
        expect(screen.queryAllByRole('option')).to.have.lengthOf(0);
    });

    it('should have correct ARIA roles', () => {
        render(<ComboBox options={optionsMock} />);
        const textbox = screen.getByRole('combobox');
        fireEvent.change(textbox, {target: {value: 'mexi'}});

        expect(textbox).to.have.attribute('role', 'combobox');

        const options = screen.queryAllByRole('option');
        expect(options).to.not.equal('');
        options.forEach((option) => {
            expect(option).to.have.attribute('role', 'option');
        });
    });

    it('should update aria-activedescendant correctly', async () => {
        render(<ComboBox options={optionsMock} />);
        const textbox = screen.getByRole('combobox');
        fireEvent.change(textbox, {target: {value: 'ger'}});
        await screen.findByRole('option');

        fireEvent.keyDown(textbox, {key: 'ArrowDown'});
        const firstOption = screen.getAllByRole('option')[0];
        expect(textbox).to.have.attribute(
            'aria-activedescendant',
            firstOption.getAttribute('id')
        );
    });

    it('should use aria-selected correctly', async () => {
        render(<ComboBox options={optionsMock} />);
        const textbox = screen.getByRole('combobox');
        fireEvent.change(textbox, {target: {value: 'chin'}});
        await screen.findByRole('option');

        fireEvent.keyDown(textbox, {key: 'ArrowDown'});
        const firstOption = screen.getAllByRole('option')[0];
        expect(firstOption).to.have.attribute('aria-selected', 'true');
    });

    it('should use aria-expanded correctly', async () => {
        render(<ComboBox options={optionsMock} />);
        const textbox = screen.getByRole('combobox');

        // Initially, the dropdown should not be present
        expect(screen.queryByRole('listbox')).to.equal(null);

        fireEvent.change(textbox, {target: {value: 'United'}});
        const list = await screen.findByRole('listbox');
        expect(list).to.have.attribute('aria-expanded', 'true');
    });
});
