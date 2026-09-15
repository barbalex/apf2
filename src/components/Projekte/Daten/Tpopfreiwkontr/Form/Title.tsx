import type { TpopkontrRow } from './index.tsx'

import styles from './Title.module.css'

interface TitleProps {
  row: Partial<TpopkontrRow>
}

export const Title = ({ row }: TitleProps) => {
  const year = row?.jahr ?? new Date().getFullYear()

  return (
    <div
      className={styles.container}
    >{`Erfolgskontrolle Artenschutz Flora ${year}`}</div>
  )
}
