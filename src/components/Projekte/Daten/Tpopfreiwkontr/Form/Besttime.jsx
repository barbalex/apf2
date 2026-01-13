import styles from './Besttime.module.css'

export const Besttime = ({ row }) => (
  <div className={styles.container}>
    <div className={styles.label}>Bester Beobachtungs-Zeitpunkt</div>
    <div className={styles.val}>
      {row?.tpopByTpopId?.popByPopId?.apByApId?.ekfBeobachtungszeitpunkt ?? ''}
    </div>
  </div>
)
