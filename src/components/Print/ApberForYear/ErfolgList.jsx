import { Fragment } from 'react'

import { ErrorBoundary } from '../../shared/ErrorBoundary.jsx'
import styles from './ErfolgList.module.css'

export const ErfolgList = ({ jahr, data }) => {
  const nodes = data?.jberAbc?.nodes ?? []
  const apRows = nodes.map((ap) => {
    const veraenderung =
      ap.erfolg === 6 || ap.erfolgVorjahr === 6 ? ''
      : ap.erfolg === null || ap.erfolgVorjahr === null ? ''
      : ap.erfolg - ap.erfolgVorjahr === 0 ? ''
      : ap.erfolg - ap.erfolgVorjahr > 0 ? '―'
      : '╋'
    // Problem: in print some artnames are very long
    // this pushes columns to the right, off of the print
    // Seems that overflow/ellipis is not respected
    // so need to shorten names
    const artname =
      ap.artname?.length > 82 ?
        `${ap.artname?.substring?.(0, 82)}...`
      : (ap.artname ?? '')

    return {
      //ap: ap.artname,
      ap: artname,
      erfolgNicht: ap?.erfolg === 5 ? 'X' : '',
      erfolgWenig: ap?.erfolg === 4 ? 'X' : '',
      erfolgMaessig: ap?.erfolg === 3 ? 'X' : '',
      erfolgGut: ap?.erfolg === 2 ? 'X' : '',
      erfolgSehr: ap?.erfolg === 1 ? 'X' : '',
      erfolgUnsicher: ap?.erfolg === 6 ? 'X' : '',
      nichtBeurteilt: ap?.erfolg === null ? 'X' : '',
      veraenderung,
      keineMassnahme: ap.c1LPop === 0 ? 'X' : '',
      apExists: ap.bearbeitung === 3 ? 'X' : '',
    }
  })

  //console.log('ErfolgList, apRows:', apRows)

  return (
    <ErrorBoundary>
      <div className={styles.container}>
        <p className={styles.overallTitle}>{`Erfolg ${jahr}`}</p>
        <div className={styles.table}>
          <div className={styles.apTitle}>Art</div>
          <div className={styles.erfolgSpanningTitle}>Erfolg</div>
          <div className={styles.styles.keineMassnTitle}>
            <div>keine Massnahme</div>
            <div>im Berichtsjahr</div>
          </div>
          <div className={styles.apExistsTitle}>
            <div>Aktionsplan</div>
            <div>erstellt</div>
          </div>
          <div className={styles.erfolgNichtTitle}>
            <div>nicht</div>
          </div>
          <div className={styles.erfolgWenigTitle}>
            <div>wenig</div>
          </div>
          <div className={styles.erfolgMaessigTitle}>
            <div>mässig</div>
          </div>
          <div className={styles.erfolgGutTitle}>
            <div>gut</div>
          </div>
          <div className={styles.erfolgSehrTitle}>
            <div>sehr</div>
          </div>
          <div className={styles.erfolgAenderungTitle}>
            <div>Veränderung</div>
          </div>
          <div className={styles.erfolgUnsicherTitle}>
            <div>unsicher</div>
          </div>
          <div className={styles.erfolgNichtBeurteiltTitle}>
            <div>nicht beurteilt</div>
          </div>
          {apRows.map((row, index) => {
            // eslint-disable-next-line eqeqeq
            const odd = Math.abs(index % 2) == 1

            return (
              <Fragment key={row.ap}>
                <div
                  className={styles.ap}
                  style={{
                    ...(odd ? { backgroundColor: 'rgba(0,0,0,0.03)' } : {}),
                  }}
                >
                  {row.ap}
                </div>
                <div
                  className={styles.erfolgNicht}
                  style={{
                    backgroundColor:
                      !!row.erfolgNicht ? 'red'
                      : odd ? 'rgba(0,0,0,0.03)'
                      : 'unset',
                  }}
                >
                  {row.erfolgNicht}
                </div>
                <div
                  className={styles.erfolgWenig}
                  style={{
                    backgroundColor:
                      !!row.erfolgWenig ? 'orange'
                      : odd ? 'rgba(0,0,0,0.03)'
                      : 'unset',
                  }}
                >
                  {row.erfolgWenig}
                </div>
                <div
                  className={styles.erfolgMaessig}
                  style={{
                    backgroundColor:
                      !!row.erfolgMaessig ? 'yellow'
                      : odd ? 'rgba(0,0,0,0.03)'
                      : 'unset',
                  }}
                >
                  {row.erfolgMaessig}
                </div>
                <div
                  className={styles.erfolgGut}
                  style={{
                    backgroundColor:
                      !!row.erfolgGut ? '#00f6ff'
                      : odd ? 'rgba(0,0,0,0.03)'
                      : 'unset',
                  }}
                >
                  {row.erfolgGut}
                </div>
                <div
                  className={styles.erfolgSehr}
                  style={{
                    backgroundColor:
                      !!row.erfolgSehr ? '#00ff00'
                      : odd ? 'rgba(0,0,0,0.03)'
                      : 'unset',
                  }}
                >
                  {row.erfolgSehr}
                </div>
                <div
                  className={styles.erfolgVeraenderung}
                  style={{
                    ...(odd ? { backgroundColor: 'rgba(0,0,0,0.03)' } : {}),
                  }}
                >
                  {row.veraenderung}
                </div>
                <div
                  className={styles.erfolgUnsicher}
                  style={{
                    backgroundColor:
                      !!row.erfolgUnsicher ? '#afafaf'
                      : odd ? 'rgba(0,0,0,0.03)'
                      : 'unset',
                  }}
                >
                  {row.erfolgUnsicher}
                </div>
                <div
                  className={styles.erfolgNichtBeurteilt}
                  style={{
                    ...(odd ? { backgroundColor: 'rgba(0,0,0,0.03)' } : {}),
                  }}
                >
                  {row.nichtBeurteilt}
                </div>
                <div
                  className={styles.keineMassnahme}
                  style={{
                    ...(odd ? { backgroundColor: 'rgba(0,0,0,0.03)' } : {}),
                  }}
                >
                  {row.keineMassnahme}
                </div>
                <div
                  className={styles.apExists}
                  style={{
                    ...(odd ? { backgroundColor: 'rgba(0,0,0,0.03)' } : {}),
                  }}
                >
                  {row.apExists}
                </div>
              </Fragment>
            )
          })}
        </div>
      </div>
    </ErrorBoundary>
  )
}
