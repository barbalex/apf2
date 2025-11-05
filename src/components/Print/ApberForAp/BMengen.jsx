import {
  container,
  title,
  row,
  yearRow,
  labelRow,
  year,
  yearSince,
  label1,
  number,
  popSeit,
} from './BMengen.module.css'

export const BMengen = ({ jahr, loading, node }) => {
  const b1LPop = node?.b1LPop
  const b1LTpop = node?.b1LTpop
  const b1RPop = node?.b1RPop
  const b1RTpop = node?.b1RTpop
  const b1FirstYear = node?.b1FirstYear

  return (
    <div className={container}>
      <h3 className={title}>B. Bestandesentwicklung</h3>
      <div className={yearRow}>
        <div className={year}>{jahr}</div>
        <div
          className={yearSince}
        >{`Seit ${loading ? '...' : b1FirstYear}`}</div>
      </div>
      <div className={labelRow}>
        <div className={label1} />
        <div className={number}>Pop</div>
        <div className={number}>TPop</div>
        <div className={popSeit}>Pop</div>
        <div className={number}>TPop</div>
      </div>
      <div className={row}>
        <div className={label1}>kontrolliert (inkl. Ansaatversuche)</div>
        <div className={number}>{loading ? '...' : b1LPop}</div>
        <div className={number}>{loading ? '...' : b1LTpop}</div>
        <div className={popSeit}>{loading ? '...' : b1RPop}</div>
        <div className={number}>{loading ? '...' : b1RTpop}</div>
      </div>
    </div>
  )
}
