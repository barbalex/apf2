import styles from './BMengen.module.css'

export const BMengen = ({ jahr, loading, node }) => {
  const b1LPop = node?.b1LPop
  const b1LTpop = node?.b1LTpop
  const b1RPop = node?.b1RPop
  const b1RTpop = node?.b1RTpop
  const b1FirstYear = node?.b1FirstYear

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>B. Bestandesentwicklung</h3>
      <div className={styles.yearRow}>
        <div className={styles.year}>{jahr}</div>
        <div
          className={styles.yearSince}
        >{`Seit ${loading ? '...' : b1FirstYear}`}</div>
      </div>
      <div className={styles.labelRow}>
        <div className={styles.label1} />
        <div className={styles.number}>Pop</div>
        <div className={styles.number}>TPop</div>
        <div className={styles.popSeit}>Pop</div>
        <div className={styles.number}>TPop</div>
      </div>
      <div className={styles.row}>
        <div className={styles.label1}>kontrolliert (inkl. Ansaatversuche)</div>
        <div className={styles.number}>{loading ? '...' : b1LPop}</div>
        <div className={styles.number}>{loading ? '...' : b1LTpop}</div>
        <div className={styles.popSeit}>{loading ? '...' : b1RPop}</div>
        <div className={styles.number}>{loading ? '...' : b1RTpop}</div>
      </div>
    </div>
  )
}
