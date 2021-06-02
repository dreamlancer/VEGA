export const formatDecimal = (num: any, places = 2) =>
  parseFloat(num).toFixed(places).replace('.', ',');

export function transformDate(rawDate: any) {
  const myDate = new Date(rawDate.match(/\d+/)[0] * 1);
  return `${`0${myDate.getDate()}`.slice(-2)}/${`0${
    myDate.getMonth() + 1
  }`.slice(-2)}/${myDate.getFullYear()}`;
}

export function formatImporte(value: any) {
  if (!value && value === 0) return '0,00';
  const numValue = parseFloat(value);
  let newString = '';
  newString = numValue.toFixed(2).toString().replace('.', ',');
  if (newString === 'NaN') return '0,00';
  return newString.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export function round(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function roundToFour(value: number) {
  return Math.round((value + Number.EPSILON) * 10000) / 10000;
}

export function showToFour(value : number) {
  return Math.floor((value + Number.EPSILON) * 10000) / 10000;
}