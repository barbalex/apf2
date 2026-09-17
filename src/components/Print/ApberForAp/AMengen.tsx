import type { ApberForApJberAbcNode } from './types.ts'

import styles from './AMengen.module.css'

interface AMengenProps {
  loading: boolean
  jahr?: number | undefined
  node?: ApberForApJberAbcNode | undefined
}

export const AMengen = ({ loading, jahr, node }: AMengenProps) => {
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
    loading ?
      '...'
    : (a3LPop ?? 0) +
      (a4LPop ?? 0) +
      (a5LPop ?? 0) +
      (a7LPop ?? 0) +
      (a8LPop ?? 0) +
      (a9LPop ?? 0)
  const a1LTpop =
    loading ?
      '...'
    : (a3LTpop ?? 0) +
      (a4LTpop ?? 0) +
      (a5LTpop ?? 0) +
      (a7LTpop ?? 0) +
      (a8LTpop ?? 0) +
      (a9LTpop ?? 0)
  const a2LPop =
    loading ? '...' : (a3LPop ?? 0) + (a4LPop ?? 0) + (a5LPop ?? 0)
  const a2LTpop =
    loading ? '...' : (a3LTpop ?? 0) + (a4LTpop ?? 0) + (a5LTpop ?? 0)
  const a6LPop = loading ? '...' : (a7LPop ?? 0) + (a8LPop ?? 0)
  const a6LTpop = loading ? '...' : (a7LTpop ?? 0) + (a8LTpop ?? 0)

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>A. Grundmengen</h3>
      <div className={styles.yearRow}>
        <div className={styles.year}>{jahr}</div>
      </div>
      <div className={styles.labelRow}>
        <div className={styles.label1} />
        <div className={styles.numberClass}>Pop</div>
        <div className={styles.numberClass}>TPop</div>
        <div className={styles.popSeit} />
        <div className={styles.numberClass} />
      </div>
      <div className={styles.row}>
        <div className={styles.label1}>Anzahl bekannt</div>
        <div className={styles.numberClass}>{loading ? '...' : a1LPop}</div>
        <div className={styles.numberClass}>{loading ? '...' : a1LTpop}</div>
        <div className={styles.popSeit} />
        <div className={styles.numberClass} />
      </div>
      <div className={styles.totalRow}>
        <div className={styles.label2}>aktuell</div>
        <div className={styles.numberClass}>{loading ? '...' : a2LPop}</div>
        <div className={styles.numberClass}>{loading ? '...' : a2LTpop}</div>
        <div className={styles.popSeit} />
        <div className={styles.numberClass} />
      </div>
      <div className={styles.row}>
        <div className={styles.label2Davon}>davon:</div>
        <div className={styles.label2AfterDavon}>ursprünglich</div>
        <div className={styles.numberClass}>{loading ? '...' : a3LPop}</div>
        <div className={styles.numberClass}>{loading ? '...' : a3LTpop}</div>
        <div className={styles.popSeit} />
        <div className={styles.numberClass} />
      </div>
      <div className={styles.row}>
        <div className={styles.label3}>angesiedelt (vor Beginn AP)</div>
        <div className={styles.numberClass}>{loading ? '...' : a4LPop}</div>
        <div className={styles.numberClass}>{loading ? '...' : a4LTpop}</div>
        <div className={styles.popSeit} />
        <div className={styles.numberClass} />
      </div>
      <div className={styles.row}>
        <div className={styles.label3}>angesiedelt (nach Beginn AP)</div>
        <div className={styles.numberClass}>{loading ? '...' : a5LPop}</div>
        <div className={styles.numberClass}>{loading ? '...' : a5LTpop}</div>
        <div className={styles.popSeit} />
        <div className={styles.numberClass} />
      </div>
      <div className={styles.row}>
        <div className={styles.label2}>erloschen (nach 1950):</div>
        <div className={styles.numberClass}>{loading ? '...' : a6LPop}</div>
        <div className={styles.numberClass}>{loading ? '...' : a6LTpop}</div>
        <div className={styles.popSeit} />
        <div className={styles.numberClass} />
      </div>
      <div className={styles.row}>
        <div className={styles.label2Davon}>davon:</div>
        <div className={styles.label2AfterDavon}>
          zuvor autochthon oder vor AP angesiedelt
        </div>
        <div className={styles.numberClass}>{loading ? '...' : a7LPop}</div>
        <div className={styles.numberClass}>{loading ? '...' : a7LTpop}</div>
        <div className={styles.popSeit} />
        <div className={styles.numberClass} />
      </div>
      <div className={styles.row}>
        <div className={styles.label3}>nach Beginn Aktionsplan angesiedelt</div>
        <div className={styles.numberClass}>{loading ? '...' : a8LPop}</div>
        <div className={styles.numberClass}>{loading ? '...' : a8LTpop}</div>
        <div className={styles.popSeit} />
        <div className={styles.numberClass} />
      </div>
      <div className={styles.row}>
        <div className={styles.label2}>Ansaatversuche:</div>
        <div className={styles.numberClass}>{loading ? '...' : a9LPop}</div>
        <div className={styles.numberClass}>{loading ? '...' : a9LTpop}</div>
        <div className={styles.popSeit} />
        <div className={styles.numberClass} />
      </div>
    </div>
  )
}
