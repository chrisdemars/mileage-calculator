export function formatMiles(miles) {
  if (miles == null) return '—';
  return miles.toFixed(1) + ' mi';
}

export function formatKm(miles) {
  if (miles == null) return '—';
  return (miles * 1.60934).toFixed(1) + ' km';
}

export function formatCurrency(amount) {
  if (amount == null) return '—';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

export function formatGasPrice(price) {
  if (price == null) return '—';
  return '$' + price.toFixed(3) + '/gal';
}
