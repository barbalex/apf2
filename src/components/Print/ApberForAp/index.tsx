import { sortBy } from 'es-toolkit'
import { format } from 'date-fns/format'
import { MdPrint } from 'react-icons/md'
import Fab from '@mui/material/Fab'
import MarkdownIt from 'markdown-it'
import { useSetAtom } from 'jotai'

import { setIsPrintAtom } from '../../../store/index.ts'
import { ErrorBoundary } from '../../shared/ErrorBoundary.tsx'
import { PopMenge } from '../../Projekte/Daten/ApAuswertung/PopMenge/index.tsx'
import { PopStatus } from '../../Projekte/Daten/ApAuswertung/PopStatus/index.tsx'
import { TpopKontrolliert } from '../../Projekte/Daten/ApAuswertung/TpopKontrolliert/index.tsx'
import { Ziele } from './Ziele.tsx'
import { AMengen } from './AMengen.tsx'
import { BMengen } from './BMengen.tsx'
import { CMengen } from './CMengen.tsx'
import { Massnahmen } from './Massnahmen.tsx'

import styles from './index.module.css'

const mdParser = new MarkdownIt({ breaks: true })

export const ApberForAp = ({
  apId,
  jahr,
  apData: apDataPassed,
  node,
  /**
   * when ApberForAp is called from ApberForYear
   * isSubReport is passed
   */
  isSubReport = false,
  // and need to build print button only once
  // so only when index is 0
  subReportIndex,
}) => {
  const setIsPrint = useSetAtom(setIsPrintAtom)

  const apData = isSubReport ? apDataPassed : apDataPassed?.apById
  const apber = apData?.apbersByApId?.nodes?.[0] ?? {}
  const apberDatum = apber?.datum
  const erfkrit = sortBy(apData?.erfkritsByApId?.nodes ?? [], [
    (e) => e?.apErfkritWerteByErfolg?.sort,
  ])
  const ziele = sortBy(apData?.zielsByApId?.nodes ?? [], [
    (e) => e?.zielTypWerteByTyp?.sort,
    (e) => e.bezeichnung,
  ])
  const pops = apData?.popsByApId?.nodes ?? []
  const tpops = pops.map((p) => p?.tpopsByPopId?.nodes ?? []).flat()
  const massns = sortBy(
    tpops.map((t) => t?.tpopmassnsByTpopId?.nodes ?? []).flat(),
    [
      (m) => m?.tpopByTpopId?.popByPopId.nr,
      (m) => m?.tpopByTpopId?.nr,
      (m) => m?.datum,
      (m) => m?.tpopmassnTypWerteByTyp?.text,
      (m) => m?.beschreibung,
    ],
  )

  const onClickPrint = () => {
    setIsPrint(true)
    // need a long enough timeout
    // because the component is loaded anew
    // otherwise the graphics are not shown
    setTimeout(() => {
      window.print()
      setIsPrint(false)
    }, 15000)
  }

  if (!node) {
    return (
      <div className={styles.noDataContainer}>
        <div>Sorry, es gibt nicht ausreichend Daten.</div>
        <div>
          Kann es sein, dass es sich nicht um einen gültigen Aktionsplan
          handelt?
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div
        className={isSubReport ? styles.containerSubreport : styles.container}
      >
        {!subReportIndex && (
          <Fab
            onClick={onClickPrint}
            title="drucken"
            aria-label="drucken"
            color="primary"
            className={styles.fab}
          >
            <MdPrint />
          </Fab>
        )}
        <div
          className={
            isSubReport ?
              styles.contentContainerSubreport
            : styles.contentContainer
          }
        >
          <p className={styles.header}>
            {`Jahresbericht ${jahr},
              ${node?.artname ?? ''},
              ${format(new Date(), 'dd.MM.yyyy')}`}
          </p>

          <h3 className={styles.title1}>{node?.artname ?? ''}</h3>

          <div className={styles.row}>
            <p>{`Start Programm: ${
              node?.startJahr ?? '(Start-Jahr fehlt)'
            }`}</p>
            <p>{`Erste Massnahme: ${node?.firstMassn ?? ''}`}</p>
            <p>{`Erste Kontrolle: ${node?.b1FirstYear ?? ''}`}</p>
          </div>

          <AMengen
            loading={false}
            node={node}
            jahr={jahr}
          />
          {!!apber.biotopeNeue && (
            <div className={styles.fieldRowFullWidth}>
              <label className={styles.titledLabel}>
                Bemerkungen / Folgerungen für nächstes Jahr: neue Biotope
              </label>
              <div className={styles.fullWidthField}>
                <div
                  dangerouslySetInnerHTML={{
                    __html: mdParser.render(apber?.biotopeNeue ?? ''),
                  }}
                />
              </div>
            </div>
          )}
          <BMengen
            apId={apId}
            jahr={jahr}
            loading={false}
            node={node}
          />
          <div className={styles.chartContainer}>
            <TpopKontrolliert
              apId={apId}
              jahr={jahr}
              height={250}
              print
              isSubReport={isSubReport}
            />
          </div>
          <div className={styles.chartContainer}>
            <PopStatus
              apId={apId}
              year={jahr}
              height={250}
              print
              isSubReport={isSubReport}
            />
          </div>
          <div className={styles.chartContainer}>
            <PopMenge
              apId={apId}
              jahr={jahr}
              height={250}
              print
              isSubReport={isSubReport}
            />
          </div>
          {!!apber.biotopeOptimieren && (
            <div className={styles.fieldRowFullWidth}>
              <label className={styles.titledLabel}>
                Bemerkungen / Folgerungen für nächstes Jahr: Optimierung Biotope
              </label>
              <div className={styles.fullWidthField}>
                <div
                  dangerouslySetInnerHTML={{
                    __html: mdParser.render(apber?.biotopeOptimieren ?? ''),
                  }}
                />
              </div>
            </div>
          )}

          <CMengen
            jahr={jahr}
            loading={false}
            node={node}
          />
          {!!apber.massnahmenPlanungVsAusfuehrung && (
            <div className={styles.fieldRowFullWidth}>
              <label className={styles.titledLabel}>
                Vergleich Ausführung/Planung
              </label>
              <div className={styles.fullWidthField}>
                <div
                  dangerouslySetInnerHTML={{
                    __html: mdParser.render(
                      apber?.massnahmenPlanungVsAusfuehrung ?? '',
                    ),
                  }}
                />
              </div>
            </div>
          )}
          {!!apber.massnahmenOptimieren && (
            <div className={styles.fieldRowFullWidth}>
              <label className={styles.titledLabel}>
                Bemerkungen / Folgerungen für nächstes Jahr: Optimierung
                Massnahmen
              </label>
              <div className={styles.fullWidthField}>
                <div
                  dangerouslySetInnerHTML={{
                    __html: mdParser.render(apber?.massnahmenOptimieren ?? ''),
                  }}
                />
              </div>
            </div>
          )}
          {!!apber.massnahmenApBearb && (
            <div className={styles.fieldRowFullWidth}>
              <label className={styles.titledLabel}>
                Weitere Aktivitäten der Art-Verantwortlichen
              </label>
              <div className={styles.fullWidthField}>
                <div
                  dangerouslySetInnerHTML={{
                    __html: mdParser.render(apber?.massnahmenApBearb ?? ''),
                  }}
                />
              </div>
            </div>
          )}
          {!!massns.length && <Massnahmen massns={massns} />}

          <h3 className={styles.title1}>
            D. Einschätzung der Wirkung des AP insgesamt auf die Art
          </h3>
          {!!apber.vergleichVorjahrGesamtziel && (
            <div className={styles.fieldRow}>
              <label className={styles.fieldLabel}>
                Vergleich zu Vorjahr - Ausblick auf Gesamtziel
              </label>
              <div className={styles.field}>
                <div
                  dangerouslySetInnerHTML={{
                    __html: mdParser.render(
                      apber?.vergleichVorjahrGesamtziel ?? '',
                    ),
                  }}
                />
              </div>
            </div>
          )}
          {!!ziele.length && <Ziele ziele={ziele} />}
          {!!erfkrit.length && (
            <div className={styles.fieldRow}>
              <label className={styles.fieldLabel}>Beurteilungsskala</label>
              <div className={styles.field}>
                {erfkrit.map((e) => (
                  <div
                    className={styles.erfkritRow}
                    key={e.id}
                  >
                    <div className={styles.erfkritErfolg}>{`${
                      e?.apErfkritWerteByErfolg?.text ?? '(fehlt)'
                    }:`}</div>
                    <div className={styles.erfkritKriterium}>
                      {e.kriterien || '(fehlt)'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {!!apber.apErfkritWerteByBeurteilung && (
            <div className={styles.fieldRowBold}>
              <label className={styles.fieldLabel}>Beurteilung</label>
              <div className={styles.field}>
                {apber?.apErfkritWerteByBeurteilung?.text ?? ''}
              </div>
            </div>
          )}
          {!!apber.wirkungAufArt && (
            <div className={styles.fieldRow}>
              <label className={styles.fieldLabel}>Bemerkungen</label>
              <div className={styles.field}>{apber?.wirkungAufArt ?? ''}</div>
            </div>
          )}
          {!!apber.apberAnalyse && (
            <div className={styles.fieldRow}>
              <label className={styles.fieldLabel}>Analyse</label>
              <div className={styles.field}>
                <div
                  dangerouslySetInnerHTML={{
                    __html: mdParser.render(apber?.apberAnalyse ?? ''),
                  }}
                />
              </div>
            </div>
          )}
          {!!apber.konsequenzenUmsetzung && (
            <div className={styles.fieldRow}>
              <label className={styles.fieldLabel}>
                Konsequenzen für die Umsetzung
              </label>
              <div className={styles.field}>
                <div
                  dangerouslySetInnerHTML={{
                    __html: mdParser.render(apber?.konsequenzenUmsetzung ?? ''),
                  }}
                />
              </div>
            </div>
          )}
          {!!apber.konsequenzenErfolgskontrolle && (
            <div className={styles.fieldRow}>
              <label className={styles.fieldLabel}>
                Konsequenzen für die Erfolgskontrolle
              </label>
              <div className={styles.field}>
                <div
                  dangerouslySetInnerHTML={{
                    __html: mdParser.render(
                      apber?.konsequenzenErfolgskontrolle ?? '',
                    ),
                  }}
                />
              </div>
            </div>
          )}
          <div className={styles.row}>
            {`${
              apberDatum ?
                format(new Date(apberDatum), 'dd.MM.yyyy')
              : '(Datum fehlt)'
            } / ${node?.bearbeiter ?? '(kein Bearbeiter)'}`}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
}
