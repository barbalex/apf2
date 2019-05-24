export default file =>
  file.file_mime_type &&
  (file.file_mime_type.toLowerCase().includes('jpeg') ||
    file.file_mime_type.toLowerCase().includes('png'))
