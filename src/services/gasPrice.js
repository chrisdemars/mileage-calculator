const SERIES_ID = 'EMM_EPMRU_PTE_SMI_DPG'; // Michigan regular unleaded

export async function fetchMichiganGasPrice() {
  const apiKey = import.meta.env.VITE_EIA_API_KEY;
  if (!apiKey) throw new Error('EIA API key not configured');

  const url =
    `https://api.eia.gov/v2/petroleum/pri/gnd/data/` +
    `?api_key=${apiKey}` +
    `&frequency=weekly` +
    `&data[]=value` +
    `&facets[series][]=${SERIES_ID}` +
    `&sort[0][column]=period&sort[0][direction]=desc` +
    `&length=1`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`EIA API error: ${res.status}`);

  const json = await res.json();
  const record = json?.response?.data?.[0];
  if (!record) throw new Error('No gas price data returned');

  return { value: parseFloat(record.value), date: record.period };
}
