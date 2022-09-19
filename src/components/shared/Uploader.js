import React from 'react'
import { Widget } from '@uploadcare/react-widget'

import { signature, expire } from '../../utils/uploadcareSignature'

const Uploader = ({ onChange }) => (
  <Widget
    // value="what"
    publicKey={process.env.GATSBY_UPLOADCARE_PUBLIC_KEY}
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
    onFileSelect={onChange}
  />
)

export default Uploader
