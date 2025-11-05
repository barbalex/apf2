import styled from '@emotion/styled'

const Container = styled.div`
  padding: 0.2cm 0;
  break-inside: avoid;
`
const Title = styled.h3`
  font-size: 16px;
  font-weight: 700;
  margin-bottom: -18px;
`
const Row = styled.div`
  display: flex;
  padding: 0.05cm 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1) !important;
  page-break-inside: avoid;
`
const YearRow = styled.div`
  display: flex;
  padding: 0.05cm 0;
`
const TotalRow = styled(Row)`
  font-weight: 700;
`
const LabelRow = styled(Row)`
  font-size: 12px;
`
const Year = styled.div`
  position: relative;
  left: 10.9cm;
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
const Label2Davon = styled(Label2)`
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
  min-width: 1.2cm;
  max-width: 1.2cm;
  text-align: right;
`
const PopSeit = styled(Number)`
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
    <Container>
      <Title>A. Grundmengen</Title>
      <YearRow>
        <Year>{jahr}</Year>
      </YearRow>
      <LabelRow>
        <Label1 />
        <Number>Pop</Number>
        <Number>TPop</Number>
        <PopSeit />
        <Number />
      </LabelRow>
      <Row>
        <Label1>Anzahl bekannt</Label1>
        <Number>{loading ? '...' : a1LPop}</Number>
        <Number>{loading ? '...' : a1LTpop}</Number>
        <PopSeit />
        <Number />
      </Row>
      <TotalRow>
        <Label2>aktuell</Label2>
        <Number>{loading ? '...' : a2LPop}</Number>
        <Number>{loading ? '...' : a2LTpop}</Number>
        <PopSeit />
        <Number />
      </TotalRow>
      <Row>
        <Label2Davon>davon:</Label2Davon>
        <Label2AfterDavon>ursprünglich</Label2AfterDavon>
        <Number>{loading ? '...' : a3LPop}</Number>
        <Number>{loading ? '...' : a3LTpop}</Number>
        <PopSeit />
        <Number />
      </Row>
      <Row>
        <Label3>angesiedelt (vor Beginn AP)</Label3>
        <Number>{loading ? '...' : a4LPop}</Number>
        <Number>{loading ? '...' : a4LTpop}</Number>
        <PopSeit />
        <Number />
      </Row>
      <Row>
        <Label3>angesiedelt (nach Beginn AP)</Label3>
        <Number>{loading ? '...' : a5LPop}</Number>
        <Number>{loading ? '...' : a5LTpop}</Number>
        <PopSeit />
        <Number />
      </Row>
      <Row>
        <Label2>erloschen (nach 1950):</Label2>
        <Number>{loading ? '...' : a6LPop}</Number>
        <Number>{loading ? '...' : a6LTpop}</Number>
        <PopSeit />
        <Number />
      </Row>
      <Row>
        <Label2Davon>davon:</Label2Davon>
        <Label2AfterDavon>
          zuvor autochthon oder vor AP angesiedelt
        </Label2AfterDavon>
        <Number>{loading ? '...' : a7LPop}</Number>
        <Number>{loading ? '...' : a7LTpop}</Number>
        <PopSeit />
        <Number />
      </Row>
      <Row>
        <Label3>nach Beginn Aktionsplan angesiedelt</Label3>
        <Number>{loading ? '...' : a8LPop}</Number>
        <Number>{loading ? '...' : a8LTpop}</Number>
        <PopSeit />
        <Number />
      </Row>
      <Row>
        <Label2>Ansaatversuche:</Label2>
        <Number>{loading ? '...' : a9LPop}</Number>
        <Number>{loading ? '...' : a9LTpop}</Number>
        <PopSeit />
        <Number />
      </Row>
    </Container>
  )
}
