import { forwardRef, memo, useContext } from 'react'
// import { Widget } from '@uploadcare/react-widget'
import { FileUploaderRegular as Widget } from '@uploadcare/react-uploader'
import '@uploadcare/react-uploader/core.css'

import { signature, expire } from '../../utils/uploadcareSignature'
import { UploaderContext } from '../../UploaderContext.js'

export const Uploader = memo(({ onChange }) => {
  const uploaderCtx = useContext(UploaderContext)
  const api = uploaderCtx?.current?.getAPI?.()
  
  return (
    <Widget
      apiRef={api}
      pubkey={import.meta.env.VITE_UPLOADCARE_PUBLIC_KEY}
      locale="de"
      localeTranslations={{
        buttons: {
          choose: {
            files: {
              one: 'Neue Datei hochladen',
              other: 'Neue Dateien hochladen',
            },
            images: {
              one: 'Neues Bild hochladen',
              other: 'Neue Bilder hochladen',
            },
          },
        },
      }}
      effects="crop"
      imageShrink="2056x2056"
      secureSignature={signature}
      secureExpire={expire}
      id="file"
      name="file"
      multiple="true"
      multipleMax={10}
      onFileUploadSuccess={onChange}
      className="uploadcare"
      ctxName="uploadcare"
    />
  )
})
