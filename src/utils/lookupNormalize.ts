/** Strip Vietnamese diacritics so "nghe" matches "nghe", "mẹo" matches "meo" queries */
const VI_FROM = 'àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ';
const VI_TO   = 'aaaaaaaaaaaaaaaaaeeeeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuyyyyyd';

export function stripDiacritics(text: string): string {
  return text
    .toLowerCase()
    .split('')
    .map((ch) => {
      const idx = VI_FROM.indexOf(ch);
      return idx >= 0 ? VI_TO[idx] : ch;
    })
    .join('');
}

export function normalizeForSearch(text: string): string {
  return stripDiacritics(text).replace(/\s+/g, ' ').trim();
}

export function normalizeQuery(query: string): string {
  return normalizeForSearch(query);
}