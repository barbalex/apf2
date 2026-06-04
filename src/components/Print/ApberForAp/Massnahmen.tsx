import { DateTime } from 'luxon'

import styles from './Massnahmen.module.css'

export const Massnahmen = ({ massns }) => (
  <div className={styles.container}>
    <div className={styles.title}>Massnahmen im Berichtsjahr:</div>
    <div className={styles.titleRow}>
      <div className={styles.titleSubRow}>
        <div className={styles.popNrName}>Population</div>
        <div className={styles.tpopNrFlurname}>Teil-Population</div>
        <div className={styles.massnDatumTyp}>Massnahme</div>
        <div className={styles.massnBeschreibung} />
      </div>
      <div className={styles.titleSubRow}>
        <div className={styles.popNr}>Nr.</div>
        <div className={styles.popName}>Name</div>
        <div className={styles.tpopNr}>Nr.</div>
        <div className={styles.tpopFlurname}>Flurname</div>
        <div className={styles.massnDatumTitle}>Datum</div>
        <div className={styles.massnTyp}>Typ</div>
        <div className={styles.massnBeschreibung}>Massnahme</div>
      </div>
    </div>
    {massns.map((m) => {
      const mDatum = m.datum ? DateTime.fromSQL(m.datum).toFormat('dd.LL') : ''

      return (
        <div
          className={styles.row}
          key={m.id}
        >
          <div className={styles.popNr}>
            {m?.tpopByTpopId?.popByPopId?.nr ?? ''}
          </div>
          <div className={styles.popName}>
            {m?.tpopByTpopId?.popByPopId?.name ?? ''}
          </div>
          <div className={styles.tpopNr}>{m?.tpopByTpopId?.nr ?? ''}</div>
          <div className={styles.tpopFlurname}>
            {m?.tpopByTpopId?.flurname ?? ''}
          </div>
          <div className={styles.massnDatum}>{mDatum}</div>
          <div className={styles.massnTyp}>
            {m?.tpopmassnTypWerteByTyp?.text ?? ''}
          </div>
          <div className={styles.massnBeschreibung}>
            {m?.beschreibung ?? ''}
          </div>
        </div>
      )
    })}
  </div>
)
