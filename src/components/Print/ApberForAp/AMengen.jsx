import styled from '@emotion/styled'

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
  number,
  popSeit,
} from './AMengen.module.css'

const Label2Davon = styled.div`
  font-size: 10px;
  min-width: 1.8cm;
  max-width: 1.8cm;
  top: 3px;
  position: relative;
  color: grey;
  padding-left: 1.2cm;
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
  min-width: 1.2cm;
  max-width: 1.2cm;
  text-align: right;
`
const PopSeit = styled.div`
  min-width: 1.2cm;
  max-width: 1.2cm;
  text-align: right;
  margin-left: 1cm;
`

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
        <Number>Pop</Number>
        <Number>TPop</Number>
        <PopSeit />
        <Number />
      </div>
      <div className={row}>
        <div className={label1}>Anzahl bekannt</div>
        <Number>{loading ? '...' : a1LPop}</Number>
        <Number>{loading ? '...' : a1LTpop}</Number>
        <PopSeit />
        <Number />
      </div>
      <div className={totalRow}>
        <div className={label2}>aktuell</div>
        <Number>{loading ? '...' : a2LPop}</Number>
        <Number>{loading ? '...' : a2LTpop}</Number>
        <PopSeit />
        <Number />
      </div>
      <div className={row}>
        <Label2Davon>davon:</Label2Davon>
        <Label2AfterDavon>ursprünglich</Label2AfterDavon>
        <Number>{loading ? '...' : a3LPop}</Number>
        <Number>{loading ? '...' : a3LTpop}</Number>
        <PopSeit />
        <Number />
      </div>
      <div className={row}>
        <Label3>angesiedelt (vor Beginn AP)</Label3>
        <Number>{loading ? '...' : a4LPop}</Number>
        <Number>{loading ? '...' : a4LTpop}</Number>
        <PopSeit />
        <Number />
      </div>
      <div className={row}>
        <Label3>angesiedelt (nach Beginn AP)</Label3>
        <Number>{loading ? '...' : a5LPop}</Number>
        <Number>{loading ? '...' : a5LTpop}</Number>
        <PopSeit />
        <Number />
      </div>
      <div className={row}>
        <div className={label2}>erloschen (nach 1950):</div>
        <Number>{loading ? '...' : a6LPop}</Number>
        <Number>{loading ? '...' : a6LTpop}</Number>
        <PopSeit />
        <Number />
      </div>
      <div className={row}>
        <Label2Davon>davon:</Label2Davon>
        <Label2AfterDavon>
          zuvor autochthon oder vor AP angesiedelt
        </Label2AfterDavon>
        <Number>{loading ? '...' : a7LPop}</Number>
        <Number>{loading ? '...' : a7LTpop}</Number>
        <PopSeit />
        <Number />
      </div>
      <div className={row}>
        <Label3>nach Beginn Aktionsplan angesiedelt</Label3>
        <Number>{loading ? '...' : a8LPop}</Number>
        <Number>{loading ? '...' : a8LTpop}</Number>
        <PopSeit />
        <Number />
      </div>
      <div className={row}>
        <div className={label2}>Ansaatversuche:</div>
        <Number>{loading ? '...' : a9LPop}</Number>
        <Number>{loading ? '...' : a9LTpop}</Number>
        <PopSeit />
        <Number />
      </div>
    </div>
  )
}
