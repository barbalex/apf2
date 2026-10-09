import { useContext } from 'react'
import { FileUploaderRegular, defineLocale } from '@uploadcare/react-uploader'
import type { TProps } from '@uploadcare/react-uploader'
import '@uploadcare/react-uploader/core.css'

import { signature, expire } from '../../../utils/uploadcareSignature.ts'
import { UploaderContext } from '../../../UploaderContext.ts'
import { locale } from './locale.ts'

defineLocale('de', locale as unknown as Parameters<typeof defineLocale>[1])

type UploaderEventProps = Pick<
  TProps<'Regular'>,
  'onFileUploadSuccess' | 'onFileUploadFailed' | 'onCommonUploadSuccess'
>

export type FileUploadSuccessEvent = Parameters<
  NonNullable<UploaderEventProps['onFileUploadSuccess']>
>[0]
export type FileUploadFailedEvent = Parameters<
  NonNullable<UploaderEventProps['onFileUploadFailed']>
>[0]
export type CommonUploadSuccessEvent = Parameters<
  NonNullable<UploaderEventProps['onCommonUploadSuccess']>
>[0]

export interface UploaderProps {
  onFileUploadSuccess: (
    event: FileUploadSuccessEvent | null | undefined,
  ) => void | Promise<void>
  onFileUploadFailed: (
    event: FileUploadFailedEvent | null | undefined,
  ) => void | Promise<void>
  onCommonUploadSuccess: (
    event: CommonUploadSuccessEvent | null | undefined,
  ) => void | Promise<void>
}

export const Uploader = ({
  onFileUploadSuccess,
  onFileUploadFailed,
  onCommonUploadSuccess,
}: UploaderProps) => {
  const uploaderCtx = useContext(UploaderContext)
  const api = uploaderCtx?.current?.getAPI?.()

  // the upstream config typings are inconsistent (e.g. multipleMax is typed
  // as number in one package and string in the other), so assemble the props
  // and cast them to the wrapper's own prop type
  const props = {
    // the typings expect a ref but the api object works at runtime
    apiRef: api,
    pubkey: import.meta.env.VITE_UPLOADCARE_PUBLIC_KEY,
    effects: 'crop',
    imageShrink: '2056x2056',
    secureSignature: signature,
    secureExpire: String(expire),
    id: 'file',
    name: 'file',
    multiple: true,
    multipleMax: 10,
    onFileUploadSuccess,
    onFileUploadFailed,
    onCommonUploadSuccess,
    ctxName: 'uploadcare',
    removeCopyright: true,
    localeName: 'de',
  } as unknown as TProps<'Regular'>

  return <FileUploaderRegular {...props} className="uploadcare" />
}
