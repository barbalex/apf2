import styled from '@emotion/styled'

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
  number,
  popSeit,
} from './CMengen.module.css'

const LabelRow = styled.div`
  font-size: 12px;
  display: flex;
  padding: 0.05cm 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1) !important;
  page-break-inside: avoid;
`
const Year = styled.div`
  position: relative;
  left: 10.9cm;
  width: 2cm;
`
const YearSince = styled.div`
  position: relative;
  left: 11.45cm;
  width: 2cm;
`
const Label1 = styled.div`
  min-width: 10cm;
  max-width: 10cm;
`
const Label2 = styled.div`
  min-width: 8.8cm;
  max-width: 8.8cm;
  padding-left: 1.2cm;
`
const Label2Davon = styled.div`
  padding-left: 1.2cm;
  font-size: 10px;
  min-width: 1.8cm;
  max-width: 1.8cm;
  top: 3px;
  position: relative;
  color: grey;
`
const Label2AfterDavon = styled.div`
  min-width: 7cm;
  max-width: 7cm;
`
const Label3 = styled.div`
  min-width: 7cm;
  max-width: 7cm;
  padding-left: 3cm;
`
const Number = styled.div`
  min-width: 1cm;
  max-width: 1cm;
  text-align: right;
`
const PopSeit = styled.div`
  margin-left: 1cm;
  min-width: 1cm;
  max-width: 1cm;
  text-align: right;
`

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
        <Year>{jahr}</Year>
        <YearSince>{`Seit ${c1FirstYear}`}</YearSince>
      </div>
      <LabelRow>
        <Label1 />
        <Number>Pop</Number>
        <Number>TPop</Number>
        <PopSeit>Pop</PopSeit>
        <Number>TPop</Number>
      </LabelRow>
      <div className={row}>
        <Label1>Anzahl Populationen/Teilpopulationen mit Massnahmen</Label1>
        <Number>{c1LPop}</Number>
        <Number>{c1LTpop}</Number>
        <PopSeit>{c1RPop}</PopSeit>
        <Number>{c1RTpop}</Number>
      </div>
      <div className={row}>
        <Label2>kontrolliert</Label2>
        <Number />
        <Number />
        <PopSeit>{c2RPop}</PopSeit>
        <Number>{c2RTpop}</Number>
      </div>
      <div className={row}>
        <Label2Davon>davon:</Label2Davon>
        <Label2AfterDavon>sehr erfolgreich</Label2AfterDavon>
        <Number />
        <Number />
        <PopSeit>{c3RPop}</PopSeit>
        <Number>{c3RTpop}</Number>
      </div>
      <div className={row}>
        <Label3>erfolgreich</Label3>
        <Number />
        <Number />
        <PopSeit>{c4RPop}</PopSeit>
        <Number>{c4RTpop}</Number>
      </div>
      <div className={row}>
        <Label3>weniger erfolgreich</Label3>
        <Number />
        <Number />
        <PopSeit>{c5RPop}</PopSeit>
        <Number>{c5RTpop}</Number>
      </div>
      <div className={row}>
        <Label3>nicht erfolgreich</Label3>
        <Number />
        <Number />
        <PopSeit>{c6RPop}</PopSeit>
        <Number>{c6RTpop}</Number>
      </div>
      <div className={row}>
        <Label3>mit unsicherer Wirkung</Label3>
        <Number />
        <Number />
        <PopSeit>{c7RPop}</PopSeit>
        <Number>{c7RTpop}</Number>
      </div>
    </div>
  )
}
