import styles from './CMengen.module.css'

export const CMengen = ({ jahr, loading, node }) => {
  const c1LPop = loading ? '...' : node?.c1LPop
  const c1LTpop = loading ? '...' : node?.c1LTpop
  const c1RPop = loading ? '...' : node?.c1RPop
  const c1RTpop = loading ? '...' : node?.c1RTpop
  const c2RPop = loading ? '...' : node?.c2RPop
  const c2RTpop = loading ? '...' : node?.c2RTpop
  const c3RPop = loading ? '...' : node?.c3RPop
  const c3RTpop = loading ? '...' : node?.c3RTpop
  const c4RPop = loading ? '...' : node?.c4RPop
  const c4RTpop = loading ? '...' : node?.c4RTpop
  const c5RPop = loading ? '...' : node?.c5RPop
  const c5RTpop = loading ? '...' : node?.c5RTpop
  const c6RPop = loading ? '...' : node?.c6RPop
  const c6RTpop = loading ? '...' : node?.c6RTpop
  const c7RPop = loading ? '...' : node?.c7RPop
  const c7RTpop = loading ? '...' : node?.c7RTpop
  const c1FirstYear = loading ? '...' : node?.c1FirstYear

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>
        C. Zwischenbilanz zur Wirkung von Massnahmen
      </h3>
      <div className={styles.yearRow}>
        <div className={styles.year}>{jahr}</div>
        <div className={styles.yearSince}>{`Seit ${c1FirstYear}`}</div>
      </div>
      <div className={styles.labelRow}>
        <div className={styles.label1} />
        <div className={styles.numberClass}>Pop</div>
        <div className={styles.numberClass}>TPop</div>
        <div className={styles.popSeit}>Pop</div>
        <div className={styles.numberClass}>TPop</div>
      </div>
      <div className={styles.row}>
        <div className={styles.label1}>
          Anzahl Populationen/Teilpopulationen mit Massnahmen
        </div>
        <div className={styles.numberClass}>{c1LPop}</div>
        <div className={styles.numberClass}>{c1LTpop}</div>
        <div className={styles.popSeit}>{c1RPop}</div>
        <div className={styles.numberClass}>{c1RTpop}</div>
      </div>
      <div className={styles.row}>
        <div className={styles.label2}>kontrolliert</div>
        <div className={styles.numberClass} />
        <div className={styles.numberClass} />
        <div className={styles.popSeit}>{c2RPop}</div>
        <div className={styles.numberClass}>{c2RTpop}</div>
      </div>
      <div className={styles.row}>
        <div className={styles.label2Davon}>davon:</div>
        <div className={styles.label2AfterDavon}>sehr erfolgreich</div>
        <div className={styles.numberClass} />
        <div className={styles.numberClass} />
        <div className={styles.popSeit}>{c3RPop}</div>
        <div className={styles.numberClass}>{c3RTpop}</div>
      </div>
      <div className={styles.row}>
        <div className={styles.label3}>erfolgreich</div>
        <div className={styles.numberClass} />
        <div className={styles.numberClass} />
        <div className={styles.popSeit}>{c4RPop}</div>
        <div className={styles.numberClass}>{c4RTpop}</div>
      </div>
      <div className={styles.row}>
        <div className={styles.label3}>weniger erfolgreich</div>
        <div className={styles.numberClass} />
        <div className={styles.numberClass} />
        <div className={styles.popSeit}>{c5RPop}</div>
        <div className={styles.numberClass}>{c5RTpop}</div>
      </div>
      <div className={styles.row}>
        <div className={styles.label3}>nicht erfolgreich</div>
        <div className={styles.numberClass} />
        <div className={styles.numberClass} />
        <div className={styles.popSeit}>{c6RPop}</div>
        <div className={styles.numberClass}>{c6RTpop}</div>
      </div>
      <div className={styles.row}>
        <div className={styles.label3}>mit unsicherer Wirkung</div>
        <div className={styles.numberClass} />
        <div className={styles.numberClass} />
        <div className={styles.popSeit}>{c7RPop}</div>
        <div className={styles.numberClass}>{c7RTpop}</div>
      </div>
    </div>
  )
}
