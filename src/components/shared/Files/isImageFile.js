export default file =>
  file.fileMimeType &&
  (file.fileMimeType.toLowerCase().includes('jpeg') ||
    file.fileMimeType.toLowerCase().includes('png'))
