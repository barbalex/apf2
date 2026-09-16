import { createContext, type RefObject } from 'react'
import type { UploadCtxProvider } from '@uploadcare/file-uploader'

export const UploaderContext = createContext<RefObject<UploadCtxProvider | null> | null>(null)
