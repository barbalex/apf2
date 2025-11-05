import {
  container,
  title,
  row,
  yearRow,
  totalRow,
  labelRow,
  year,
  label1,
  label2,
  label2Davon,
  label2AfterDavon,
  label3,
  numberClass,
  popSeit,
} from './AMengen.module.css'

export const AMengen = ({ loading, jahr, node }) => {
  const a3LPop = node?.a3LPop
  const a3LTpop = node?.a3LTpop
  const a4LPop = node?.a4LPop
  const a4LTpop = node?.a4LTpop
  const a5LPop = node?.a5LPop
  const a5LTpop = node?.a5LTpop
  const a7LPop = node?.a7LPop
  const a7LTpop = node?.a7LTpop
  const a8LPop = node?.a8LPop
  const a8LTpop = node?.a8LTpop
  const a9LPop = node?.a9LPop
  const a9LTpop = node?.a9LTpop
  const a1LPop =
    loading ? '...' : a3LPop + a4LPop + a5LPop + a7LPop + a8LPop + a9LPop
  const a1LTpop =
    loading ? '...' : a3LTpop + a4LTpop + a5LTpop + a7LTpop + a8LTpop + a9LTpop
  const a2LPop = loading ? '...' : a3LPop + a4LPop + a5LPop
  const a2LTpop = loading ? '...' : a3LTpop + a4LTpop + a5LTpop
  const a6LPop = loading ? '...' : a7LPop + a8LPop
  const a6LTpop = loading ? '...' : a7LTpop + a8LTpop

  return (
    <div className={container}>
      <h3 className={title}>A. Grundmengen</h3>
      <div className={yearRow}>
        <div className={year}>{jahr}</div>
      </div>
      <div className={labelRow}>
        <div className={label1} />
        <div className={numberClass}>Pop</div>
        <div className={numberClass}>TPop</div>
        <div className={popSeit} />
        <div className={numberClass} />
      </div>
      <div className={row}>
        <div className={label1}>Anzahl bekannt</div>
        <div className={numberClass}>{loading ? '...' : a1LPop}</div>
        <div className={numberClass}>{loading ? '...' : a1LTpop}</div>
        <div className={popSeit} />
        <div className={numberClass} />
      </div>
      <div className={totalRow}>
        <div className={label2}>aktuell</div>
        <div className={numberClass}>{loading ? '...' : a2LPop}</div>
        <div className={numberClass}>{loading ? '...' : a2LTpop}</div>
        <div className={popSeit} />
        <div className={numberClass} />
      </div>
      <div className={row}>
        <div className={label2Davon}>davon:</div>
        <div className={label2AfterDavon}>ursprünglich</div>
        <div className={numberClass}>{loading ? '...' : a3LPop}</div>
        <div className={numberClass}>{loading ? '...' : a3LTpop}</div>
        <div className={popSeit} />
        <div className={numberClass} />
      </div>
      <div className={row}>
        <div className={label3}>angesiedelt (vor Beginn AP)</div>
        <div className={numberClass}>{loading ? '...' : a4LPop}</div>
        <div className={numberClass}>{loading ? '...' : a4LTpop}</div>
        <div className={popSeit} />
        <div className={numberClass} />
      </div>
      <div className={row}>
        <div className={label3}>angesiedelt (nach Beginn AP)</div>
        <div className={numberClass}>{loading ? '...' : a5LPop}</div>
        <div className={numberClass}>{loading ? '...' : a5LTpop}</div>
        <div className={popSeit} />
        <div className={numberClass} />
      </div>
      <div className={row}>
        <div className={label2}>erloschen (nach 1950):</div>
        <div className={numberClass}>{loading ? '...' : a6LPop}</div>
        <div className={numberClass}>{loading ? '...' : a6LTpop}</div>
        <div className={popSeit} />
        <div className={numberClass} />
      </div>
      <div className={row}>
        <div className={label2Davon}>davon:</div>
        <div className={label2AfterDavon}>
          zuvor autochthon oder vor AP angesiedelt
        </div>
        <div className={numberClass}>{loading ? '...' : a7LPop}</div>
        <div className={numberClass}>{loading ? '...' : a7LTpop}</div>
        <div className={popSeit} />
        <div className={numberClass} />
      </div>
      <div className={row}>
        <div className={label3}>nach Beginn Aktionsplan angesiedelt</div>
        <div className={numberClass}>{loading ? '...' : a8LPop}</div>
        <div className={numberClass}>{loading ? '...' : a8LTpop}</div>
        <div className={popSeit} />
        <div className={numberClass} />
      </div>
      <div className={row}>
        <div className={label2}>Ansaatversuche:</div>
        <div className={numberClass}>{loading ? '...' : a9LPop}</div>
        <div className={numberClass}>{loading ? '...' : a9LTpop}</div>
        <div className={popSeit} />
        <div className={numberClass} />
      </div>
    </div>
  )
}
