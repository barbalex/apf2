import styles from './Ziele.module.css'

export const Ziele = ({ ziele }) => (
  <div className={styles.container}>
    <div className={styles.title}>Ziele im Berichtsjahr:</div>
    <div className={styles.titleRow}>
      <div className={styles.typ}>Typ</div>
      <div className={styles.goal}>Ziel</div>
    </div>
    {ziele.map((z) => {
      const hasZielBer = Boolean(z.erreichung || z.bemerkungen)

      return (
        <div
          className={styles.row}
          key={z.id}
        >
          <div className={styles.typ}>{z?.zielTypWerteByTyp?.text ?? ''}</div>
          <div className={styles.zielColumn}>
            <div className={styles.goal}>{z.bezeichnung || ''}</div>
            {hasZielBer && (
              <div
                className={styles.opinion}
              >{`Beurteilung: ${z.erreichung || '(keine)'}${
                z.bemerkungen ? '; ' : ''
              }${z.bemerkungen || ''}`}</div>
            )}
          </div>
        </div>
      )
    })}
  </div>
)
