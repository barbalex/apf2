import {
  container,
  title,
  row,
  zielColumn,
  titleRow,
  typ,
  goal,
  opinion,
} from './Ziele.module.css'

export const Ziele = ({ ziele }) => (
  <div className={container}>
    <div className={title}>Ziele im Berichtsjahr:</div>
    <div className={titleRow}>
      <div className={typ}>Typ</div>
      <div className={goal}>Ziel</div>
    </div>
    {ziele.map((z) => {
      const hasZielBer = Boolean(z.erreichung || z.bemerkungen)

      return (
        <div
          className={row}
          key={z.id}
        >
          <div className={typ}>{z?.zielTypWerteByTyp?.text ?? ''}</div>
          <div className={zielColumn}>
            <div className={goal}>{z.bezeichnung || ''}</div>
            {hasZielBer && (
              <div
                className={opinion}
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
