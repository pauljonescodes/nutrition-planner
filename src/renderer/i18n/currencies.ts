const currencies = ['USD', 'EUR', 'JPY', 'GBP', 'CNY', 'CAD', 'AUD', 'CHF'];
export default currencies;

const regionToCurrencyMap = {
  US: 'USD',
  CA: 'CAD',
  AU: 'AUD',
  GB: 'GBP',
  CH: 'CHF',
  CN: 'CNY',
  JP: 'JPY',
  EU: 'EUR', // Note: 'EU' is not a real region code, used here for simplicity
};

export const getDefaultCurrency = () => {
  // Attempt to find a currency for the region code
  const currency = Object.entries(regionToCurrencyMap).find(([region]) =>
    navigator.language.includes(region),
  )?.[1];

  // Fallback to 'USD' if no currency found for the region
  return currency || 'USD';
};
