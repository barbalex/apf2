import { useState } from 'react'

import {
  container,
  imageContainer,
  img,
  title,
  notifContainer,
} from './Image.module.css'

export const Image = ({ artname, apId }) => {
  const [notif, setNotif] = useState(null)

  // show notification if image is not found
  // also: do not show image when notification is shown
  //       because hideous placeholder is shown
  const onError = () => setNotif(`Für ${artname} wurde kein Bild gefunden`)

  return (
    <div className={container}>
      <div className={title}>{artname}</div>
      {!notif && (
        <div className={imageContainer}>
          {!!apId && (
            <picture>
              <source
                srcSet={`/${apId}.avif`}
                type="image/avif"
              />
              <img
                className={img}
                src={`/${apId}.webp`}
                onError={onError}
                alt={artname}
              />
            </picture>
          )}
        </div>
      )}
      {!!notif && <div className={notifContainer}>{notif}</div>}
    </div>
  )
}
