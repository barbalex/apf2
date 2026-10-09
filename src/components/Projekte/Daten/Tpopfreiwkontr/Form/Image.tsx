import { useState } from 'react'

import styles from './Image.module.css'

interface ImageProps {
  artname: string
  apId: string
}

export const Image = ({ artname, apId }: ImageProps) => {
  const [notif, setNotif] = useState<string | undefined>()

  // show notification if image is not found
  // also: do not show image when notification is shown
  //       because hideous placeholder is shown
  const onError = () => setNotif(`Für ${artname} wurde kein Bild gefunden`)

  return (
    <div className={styles.container}>
      <div className={styles.title}>{artname}</div>
      {!notif && (
        <div className={styles.imageContainer}>
          {!!apId && (
            <picture>
              <source
                srcSet={`/${apId}.avif`}
                type="image/avif"
              />
              <img
                className={styles.img}
                src={`/${apId}.webp`}
                onError={onError}
                alt={artname}
              />
            </picture>
          )}
        </div>
      )}
      {!!notif && <div className={styles.notifContainer}>{notif}</div>}
    </div>
  )
}
