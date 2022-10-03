import React, { useState } from 'react'
import { Widget } from '@uploadcare/react-widget'

import { signature, expire } from '../../utils/uploadcareSignature'

const Uploader = ({ onChange }) => {
  // const [value, setValue] = useState()
  // console.log('Uploader, value:', value)

  return (
    <Widget
      // value={value}
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
      onChange={onChange}
    />
  )
}

export default Uploader
