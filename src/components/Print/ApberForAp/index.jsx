import { useContext } from 'react'
import { observer } from 'mobx-react-lite'
import styled from '@emotion/styled'
import { sortBy } from 'es-toolkit'
import { format } from 'date-fns/format'
import { MdPrint } from 'react-icons/md'
import Fab from '@mui/material/Fab'
import MarkdownIt from 'markdown-it'

import { Ziele } from './Ziele.jsx'
import { Massnahmen } from './Massnahmen.jsx'
import { AMengen } from './AMengen.jsx'
import { BMengen } from './BMengen.jsx'
import { CMengen } from './CMengen.jsx'
import { MobxContext } from '../../../mobxContext.js'
import { ErrorBoundary } from '../../shared/ErrorBoundary.jsx'
import { PopMenge } from '../../Projekte/Daten/ApAuswertung/PopMenge/index.jsx'
import { PopStatus } from '../../Projekte/Daten/ApAuswertung/PopStatus/index.jsx'
import { TpopKontrolliert } from '../../Projekte/Daten/ApAuswertung/TpopKontrolliert/index.jsx'

import {
  noDataContainer,
  container,
  containerSubreport,
  contentContainer,
  contentContainerSubreport,
  header,
  title1,
  titledLabel,
  row,
  fieldRow,
  fieldRowBold,
  fieldRowFullWidth,
  fullWidthField,
  fieldLabel,
  field,
  erfkritRow,
  erfkritErfolg,
  erfkritKriterium,
  fab,
  chartContainer,
} from './index.module.css'

const mdParser = new MarkdownIt({ breaks: true })

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.2cm 0;
  p {
    margin: 0;
  }
  break-inside: avoid;
`
const FieldRow = styled.div`
  display: flex;
  padding: 0.2cm 0;
`
const FieldRowBold = styled.div`
  display: flex;
  padding: 0.2cm 0;
  font-weight: 700;
`
const FieldRowFullWidth = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.2cm 0;
  break-inside: avoid;
`
const FullWidthField = styled.div`
  hyphens: auto;
`
const Field = styled.div`
  width: 100%;
  hyphens: auto;
`
const ErfkritRow = styled.div`
  display: flex;
`
const ErfkritErfolg = styled.div`
  width: 5.5cm;
`
const ErfkritKriterium = styled.div`
  width: 100%;
`
const ChartContainer = styled.div`
  padding: 10px 0;
  @media print {
    break-inside: avoid;
  }
`

export const ApberForAp = observer(
  ({
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
    const store = useContext(MobxContext)
    const { setIsPrint } = store

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
        <div className={noDataContainer}>
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
        <div className={isSubReport ? containerSubreport : container}>
          {!subReportIndex && (
            <Fab
              onClick={onClickPrint}
              title="drucken"
              aria-label="drucken"
              color="primary"
              className={fab}
            >
              <MdPrint />
            </Fab>
          )}
          <div
            className={
              isSubReport ? contentContainerSubreport : contentContainer
            }
          >
            <p className={header}>
              {`Jahresbericht ${jahr},
              ${node?.artname ?? ''},
              ${format(new Date(), 'dd.MM.yyyy')}`}
            </p>

            <h3 className={title1}>{node?.artname ?? ''}</h3>

            <Row>
              <p>{`Start Programm: ${
                node?.startJahr ?? '(Start-Jahr fehlt)'
              }`}</p>
              <p>{`Erste Massnahme: ${node?.firstMassn ?? ''}`}</p>
              <p>{`Erste Kontrolle: ${node?.b1FirstYear ?? ''}`}</p>
            </Row>

            <AMengen
              loading={false}
              node={node}
              jahr={jahr}
            />
            {!!apber.biotopeNeue && (
              <FieldRowFullWidth>
                <label className={titledLabel}>
                  Bemerkungen / Folgerungen für nächstes Jahr: neue Biotope
                </label>
                <FullWidthField>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: mdParser.render(apber?.biotopeNeue ?? ''),
                    }}
                  />
                </FullWidthField>
              </FieldRowFullWidth>
            )}
            <BMengen
              apId={apId}
              jahr={jahr}
              loading={false}
              node={node}
            />
            <ChartContainer>
              <TpopKontrolliert
                apId={apId}
                jahr={jahr}
                height={250}
                print
                isSubReport={isSubReport}
              />
            </ChartContainer>
            <ChartContainer>
              <PopStatus
                apId={apId}
                year={jahr}
                height={250}
                print
                isSubReport={isSubReport}
              />
            </ChartContainer>
            <ChartContainer>
              <PopMenge
                apId={apId}
                jahr={jahr}
                height={250}
                print
                isSubReport={isSubReport}
              />
            </ChartContainer>
            {!!apber.biotopeOptimieren && (
              <FieldRowFullWidth>
                <label className={titledLabel}>
                  Bemerkungen / Folgerungen für nächstes Jahr: Optimierung
                  Biotope
                </label>
                <FullWidthField>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: mdParser.render(apber?.biotopeOptimieren ?? ''),
                    }}
                  />
                </FullWidthField>
              </FieldRowFullWidth>
            )}

            <CMengen
              jahr={jahr}
              loading={false}
              node={node}
            />
            {!!apber.massnahmenPlanungVsAusfuehrung && (
              <FieldRowFullWidth>
                <label className={titledLabel}>
                  Vergleich Ausführung/Planung
                </label>
                <FullWidthField>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: mdParser.render(
                        apber?.massnahmenPlanungVsAusfuehrung ?? '',
                      ),
                    }}
                  />
                </FullWidthField>
              </FieldRowFullWidth>
            )}
            {!!apber.massnahmenOptimieren && (
              <FieldRowFullWidth>
                <label className={titledLabel}>
                  Bemerkungen / Folgerungen für nächstes Jahr: Optimierung
                  Massnahmen
                </label>
                <FullWidthField>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: mdParser.render(
                        apber?.massnahmenOptimieren ?? '',
                      ),
                    }}
                  />
                </FullWidthField>
              </FieldRowFullWidth>
            )}
            {!!apber.massnahmenApBearb && (
              <FieldRowFullWidth>
                <label className={titledLabel}>
                  Weitere Aktivitäten der Art-Verantwortlichen
                </label>
                <FullWidthField>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: mdParser.render(apber?.massnahmenApBearb ?? ''),
                    }}
                  />
                </FullWidthField>
              </FieldRowFullWidth>
            )}
            {!!massns.length && <Massnahmen massns={massns} />}

            <h3 className={title1}>
              D. Einschätzung der Wirkung des AP insgesamt auf die Art
            </h3>
            {!!apber.vergleichVorjahrGesamtziel && (
              <FieldRow>
                <label className={fieldLabel}>
                  Vergleich zu Vorjahr - Ausblick auf Gesamtziel
                </label>
                <Field>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: mdParser.render(
                        apber?.vergleichVorjahrGesamtziel ?? '',
                      ),
                    }}
                  />
                </Field>
              </FieldRow>
            )}
            {!!ziele.length && <Ziele ziele={ziele} />}
            {!!erfkrit.length && (
              <FieldRow>
                <label className={fieldLabel}>Beurteilungsskala</label>
                <Field>
                  {erfkrit.map((e) => (
                    <ErfkritRow key={e.id}>
                      <ErfkritErfolg>{`${
                        e?.apErfkritWerteByErfolg?.text ?? '(fehlt)'
                      }:`}</ErfkritErfolg>
                      <ErfkritKriterium>
                        {e.kriterien || '(fehlt)'}
                      </ErfkritKriterium>
                    </ErfkritRow>
                  ))}
                </Field>
              </FieldRow>
            )}
            {!!apber.apErfkritWerteByBeurteilung && (
              <FieldRowBold>
                <label className={fieldLabel}>Beurteilung</label>
                <Field>{apber?.apErfkritWerteByBeurteilung?.text ?? ''}</Field>
              </FieldRowBold>
            )}
            {!!apber.wirkungAufArt && (
              <FieldRow>
                <label className={fieldLabel}>Bemerkungen</label>
                <Field>{apber?.wirkungAufArt ?? ''}</Field>
              </FieldRow>
            )}
            {!!apber.apberAnalyse && (
              <FieldRow>
                <label className={fieldLabel}>Analyse</label>
                <Field>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: mdParser.render(apber?.apberAnalyse ?? ''),
                    }}
                  />
                </Field>
              </FieldRow>
            )}
            {!!apber.konsequenzenUmsetzung && (
              <FieldRow>
                <label className={fieldLabel}>
                  Konsequenzen für die Umsetzung
                </label>
                <Field>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: mdParser.render(
                        apber?.konsequenzenUmsetzung ?? '',
                      ),
                    }}
                  />
                </Field>
              </FieldRow>
            )}
            {!!apber.konsequenzenErfolgskontrolle && (
              <FieldRow>
                <label className={fieldLabel}>
                  Konsequenzen für die Erfolgskontrolle
                </label>
                <Field>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: mdParser.render(
                        apber?.konsequenzenErfolgskontrolle ?? '',
                      ),
                    }}
                  />
                </Field>
              </FieldRow>
            )}
            <Row>
              {`${
                apberDatum ?
                  format(new Date(apberDatum), 'dd.MM.yyyy')
                : '(Datum fehlt)'
              } / ${node?.bearbeiter ?? '(kein Bearbeiter)'}`}
            </Row>
          </div>
        </div>
      </ErrorBoundary>
    )
  },
)
