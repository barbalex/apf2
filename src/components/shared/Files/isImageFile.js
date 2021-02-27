const isImageFile = (file) =>
  file.fileMimeType &&
  (file.fileMimeType.toLowerCase().includes('jpeg') ||
    file.fileMimeType.toLowerCase().includes('png'))

export default isImageFile
