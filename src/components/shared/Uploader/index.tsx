import { useContext } from 'react'
import { FileUploaderRegular, defineLocale } from '@uploadcare/react-uploader'
import '@uploadcare/react-uploader/core.css'

import { signature, expire } from '../../../utils/uploadcareSignature.ts'
import { UploaderContext } from '../../../UploaderContext.js'
import { locale } from './locale.js'

defineLocale('de', locale)

export const Uploader = ({
  onFileUploadSuccess,
  onFileUploadFailed,
  onCommonUploadSuccess,
}) => {
  const uploaderCtx = useContext(UploaderContext)
  const api = uploaderCtx?.current?.getAPI?.()

  return (
    <FileUploaderRegular
      apiRef={api}
      pubkey={import.meta.env.VITE_UPLOADCARE_PUBLIC_KEY}
      effects="crop"
      imageShrink="2056x2056"
      secureSignature={signature}
      secureExpire={expire}
      id="file"
      name="file"
      multiple="true"
      multipleMax={10}
      onFileUploadSuccess={onFileUploadSuccess}
      onFileUploadFailed={onFileUploadFailed}
      onCommonUploadSuccess={onCommonUploadSuccess}
      className="uploadcare"
      ctxName="uploadcare"
      removeCopyright="true"
      localeName="de"
    />
  )
}
