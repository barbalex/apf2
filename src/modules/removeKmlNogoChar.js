/**
 * nimmt Zeichenfolgen entgegen
 * ersetzt Zeichen(-folgen), die kml nicht erträgt mit konformen
 */
const removeKmlNogoChar = (string) => {
  if (string && typeof string === 'string') {
    return string
      .replace(/&/g, 'und')
      .replace(/>>>/g, ' ')
      .replace(/<<</g, ' ')
      .replace(/"/g, '')
      .replace(/'/g, '');
  }
  return string
}

export default removeKmlNogoChar
