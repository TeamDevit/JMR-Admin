export const convertNumberToWords = (num) => {
  if (isNaN(num) || num === null || num === '') {
    return "";
  }
  const a = ['', 'one ', 'two ', 'three ', 'four ', 'five ', 'six ', 'seven ', 'eight ', 'nine ', 'ten ', 'eleven ', 'twelve ', 'thirteen ', 'fourteen ', 'fifteen ', 'sixteen ', 'seventeen ', 'eighteen ', 'nineteen '];
  const b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
  const c = ['', 'hundred', 'thousand', 'lakh', 'crore'];

  const numString = String(num);
  let output = '';

  const inWords = (m, place) => {
    let s = a[Number(m)];
    if (Number(m) > 19) {
      s = b[Math.floor(Number(m) / 10)] + ' ' + a[Number(m) % 10];
    }
    if (s !== '') {
      output += s + ' ' + c[place] + ' ';
    }
  };

  const n = ('000000000' + numString).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
  if (!n) return '';

  inWords(n[1], 4);
  inWords(n[2], 3);
  inWords(n[3], 2);
  inWords(n[4], 1);
  inWords(n[5], 0);

  const words = output.replace(/\s+/g, ' ').trim();
  const titleCaseWords = words.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  return titleCaseWords + " Rupees";
};