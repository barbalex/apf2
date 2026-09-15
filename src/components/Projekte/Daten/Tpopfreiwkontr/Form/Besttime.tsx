import type { TpopkontrRow } from './index.tsx'

import styles from './Besttime.module.css'

interface BesttimeProps {
  row: Partial<TpopkontrRow>
}

export const Besttime = ({ row }: BesttimeProps) => (
  <div className={styles.container}>
    <div className={styles.label}>Bester Beobachtungs-Zeitpunkt</div>
    <div className={styles.val}>
      {row?.tpopByTpopId?.popByPopId?.apByApId?.ekfBeobachtungszeitpunkt ?? ''}
    </div>
  </div>
)
