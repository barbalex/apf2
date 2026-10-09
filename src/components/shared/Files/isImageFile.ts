export interface ImageFile {
  fileMimeType?: string | null
}

export const isImageFile = (file: ImageFile): boolean =>
  !!file.fileMimeType &&
  (file.fileMimeType.toLowerCase().includes('jpeg') ||
    file.fileMimeType.toLowerCase().includes('png'))
