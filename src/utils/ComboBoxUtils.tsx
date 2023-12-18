interface Country {
  code: string;
  label: string;
  phone: string;
  suggested?: boolean;
}

/**
 * Converts a country ISO code to a flag emoji.
 * @param countryCode - The ISO country code.
 * @returns The corresponding flag emoji.
 */
const countryCodeToFlagEmoji = (countryCode: string | undefined): string => {
  if (!countryCode || countryCode.length !== 2) {
    console.error('Invalid country code');
    return '';
  }

  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

/**
 * Formats a country object for display.
 * @param country - The country object to format.
 * @returns A string representation of the country, including its flag emoji and label.
 */
const formatCountry = (country: Country | undefined): string => {
  if (!country) {
    console.error('Invalid country object');
    return '';
  }

  const flagEmoji = countryCodeToFlagEmoji(country.code);
  return `${flagEmoji} ${country.label} (+${country.phone})`;
};

export type { Country };
export { formatCountry };
