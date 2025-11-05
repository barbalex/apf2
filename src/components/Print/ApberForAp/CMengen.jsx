import {
  container,
  title,
  row,
  yearRow,
  labelRow,
  year,
  yearSince,
  label1,
  label2,
  label2Davon,
  label2AfterDavon,
  label3,
  numberClass,
  popSeit,
} from './CMengen.module.css'

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
    <div className={container}>
      <h3 className={title}>C. Zwischenbilanz zur Wirkung von Massnahmen</h3>
      <div className={yearRow}>
        <div className={year}>{jahr}</div>
        <div className={yearSince}>{`Seit ${c1FirstYear}`}</div>
      </div>
      <div className={labelRow}>
        <div className={label1} />
        <div className={numberClass}>Pop</div>
        <div className={numberClass}>TPop</div>
        <div className={popSeit}>Pop</div>
        <div className={numberClass}>TPop</div>
      </div>
      <div className={row}>
        <div className={label1}>
          Anzahl Populationen/Teilpopulationen mit Massnahmen
        </div>
        <div className={numberClass}>{c1LPop}</div>
        <div className={numberClass}>{c1LTpop}</div>
        <div className={popSeit}>{c1RPop}</div>
        <div className={numberClass}>{c1RTpop}</div>
      </div>
      <div className={row}>
        <div className={label2}>kontrolliert</div>
        <div className={numberClass} />
        <div className={numberClass} />
        <div className={popSeit}>{c2RPop}</div>
        <div className={numberClass}>{c2RTpop}</div>
      </div>
      <div className={row}>
        <div className={label2Davon}>davon:</div>
        <div className={label2AfterDavon}>sehr erfolgreich</div>
        <div className={numberClass} />
        <div className={numberClass} />
        <div className={popSeit}>{c3RPop}</div>
        <div className={numberClass}>{c3RTpop}</div>
      </div>
      <div className={row}>
        <div className={label3}>erfolgreich</div>
        <div className={numberClass} />
        <div className={numberClass} />
        <div className={popSeit}>{c4RPop}</div>
        <div className={numberClass}>{c4RTpop}</div>
      </div>
      <div className={row}>
        <div className={label3}>weniger erfolgreich</div>
        <div className={numberClass} />
        <div className={numberClass} />
        <div className={popSeit}>{c5RPop}</div>
        <div className={numberClass}>{c5RTpop}</div>
      </div>
      <div className={row}>
        <div className={label3}>nicht erfolgreich</div>
        <div className={numberClass} />
        <div className={numberClass} />
        <div className={popSeit}>{c6RPop}</div>
        <div className={numberClass}>{c6RTpop}</div>
      </div>
      <div className={row}>
        <div className={label3}>mit unsicherer Wirkung</div>
        <div className={numberClass} />
        <div className={numberClass} />
        <div className={popSeit}>{c7RPop}</div>
        <div className={numberClass}>{c7RTpop}</div>
      </div>
    </div>
  )
}
