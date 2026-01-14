import styles from './TpopfeldkontrentwicklungPopover.module.css'

export const TpopfeldkontrentwicklungPopover = (
  <>
    <div className={styles.title}>Legende</div>
    <div className={styles.content}>
      Im 1. Jahr der Beobachtung die Entwicklung an der Massnahme beurteilen,
      nachher an vorhergehenden EK.
    </div>
    <div className={styles.content}>
      <div className={styles.columnLeft}>{'zunehmend:'}</div>
      <div className={styles.columnRight}>{'> 10% Zunahme'}</div>
    </div>
    <div className={styles.content}>
      <div className={styles.columnLeft}>stabil:</div>
      <div className={styles.columnRight}>{'± 10%'}</div>
    </div>
    <div className={styles.content}>
      <div className={styles.columnLeft}>abnehmend:</div>
      <div className={styles.columnRight}>{'> 10% Abnahme'}</div>
    </div>
    <div className={styles.content}>
      <div className={styles.columnLeft}>erloschen / nicht etabliert:</div>
      <div className={styles.columnRight}>
        {
          'nach 2 aufeinander folgenden Kontrollen ohne Funde oder nach Einschätzung Art-VerantwortlicheR'
        }
      </div>
    </div>
    <div className={styles.content}>
      <div className={styles.columnLeft}>unsicher:</div>
      <div className={styles.columnRight}>
        {
          'keine Funde aber noch nicht erloschen (nach zwei Kontrollen ohne Funde kann Status erloschen/nicht etabliert gewählt werden)'
        }
      </div>
    </div>
  </>
)
