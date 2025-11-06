import { DateTime } from 'luxon'

import {
  container,
  title,
  row,
  titleRow,
  titleSubRow,
  popNr,
  popName,
  popNrName,
  tpopNr,
  tpopFlurname,
  tpopNrFlurname,
  massnDatum,
  massnDatumTitle,
  massnTyp,
  massnDatumTyp,
  massnBeschreibung,
} from './Massnahmen.module.css'

export const Massnahmen = ({ massns }) => (
  <div className={container}>
    <div className={title}>Massnahmen im Berichtsjahr:</div>
    <div className={titleRow}>
      <div className={titleSubRow}>
        <div className={popNrName}>Population</div>
        <div className={tpopNrFlurname}>Teil-Population</div>
        <div className={massnDatumTyp}>Massnahme</div>
        <div className={massnBeschreibung} />
      </div>
      <div className={titleSubRow}>
        <div className={popNr}>Nr.</div>
        <div className={popName}>Name</div>
        <div className={tpopNr}>Nr.</div>
        <div className={tpopFlurname}>Flurname</div>
        <div className={massnDatumTitle}>Datum</div>
        <div className={massnTyp}>Typ</div>
        <div className={massnBeschreibung}>Massnahme</div>
      </div>
    </div>
    {massns.map((m) => {
      const mDatum = m.datum ? DateTime.fromSQL(m.datum).toFormat('dd.LL') : ''

      return (
        <div
          className={row}
          key={m.id}
        >
          <div className={popNr}>{m?.tpopByTpopId?.popByPopId?.nr ?? ''}</div>
          <div className={popName}>
            {m?.tpopByTpopId?.popByPopId?.name ?? ''}
          </div>
          <div className={tpopNr}>{m?.tpopByTpopId?.nr ?? ''}</div>
          <div className={tpopFlurname}>{m?.tpopByTpopId?.flurname ?? ''}</div>
          <div className={massnDatum}>{mDatum}</div>
          <div className={massnTyp}>
            {m?.tpopmassnTypWerteByTyp?.text ?? ''}
          </div>
          <div className={massnBeschreibung}>{m?.beschreibung ?? ''}</div>
        </div>
      )
    })}
  </div>
)
