// @flow
import React from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import sortBy from 'lodash/sortBy'
import format from 'date-fns/format'
import compose from 'recompose/compose'

import ErrorBoundary from '../../shared/ErrorBoundary'
import withData1 from './withData1'
import withData2 from './withData2'
import fnslogo from './fnslogo.png'
import AvList from './AvList'
import AktPopList from './AktPopList'
import ErfolgList from './ErfolgList'
import ApberForAp from '../ApberForAp'

const LoadingContainer = styled.div`
  padding: 15px;
  height: 100%;
`
const Container = styled.div`
  /* this part is for when page preview is shown */
  /* Divide single pages with some space and center all pages horizontally */
  /* will be removed in @media print */
  margin: 1cm auto;
  /* Define a white paper background that sticks out from the darker overall background */
  background: #fff;
  /* Show a drop shadow beneath each page */
  box-shadow: 0 4px 5px rgba(75, 75, 75, 0.2);

  /* set dimensions */
  width: 21cm;

  overflow-y: visible;

  @media print {
    /* this is when it is actually printed */
    height: inherit;
    width: inherit;

    margin: 0 !important;
    padding: 0.5cm !important;
    overflow-y: hidden !important;
    /* try this */
    page-break-inside: avoid !important;
    page-break-before: avoid !important;
    page-break-after: avoid !important;

    box-shadow: unset;
    overflow: hidden;
  }
`
const ContentContainer = styled.div`
  padding: 1.5cm;
  font-size: 14px;
  @media print {
    padding: 0;
    overflow: hidden;
  }
`
const FirstPageTitle = styled.p`
  margin-top: 3cm;
  font-size: 22px;
  font-weight: 700;
  text-align: center;
`
const FirstPageSubTitle = styled.p`
  margin-top: 2cm;
  font-size: 18px;
  font-weight: 700;
  text-align: center;
`
const FirstPageFnsLogo = styled.img`
  margin-top: 4cm;
  margin-left: auto;
  margin-right: auto;
  display: block;
`
const FirstPageDate = styled.p`
  margin-top: 10cm;
`
const FirstPageBearbeiter = styled.p`
  @media screen {
    margin-bottom: 3cm;
  }
  break-after: page;
`
const SecondPageTop = styled.div`
  padding-top: 2cm;
`
const SecondPage = styled.div`
  break-after: page;
`
const SecondPageTitle = styled.label`
  padding-top: 2cm;
  font-size: 18px;
  font-weight: 700;
`
const SecondPageText = styled.p`
  hyphens: auto;
`

const enhance = compose(
  withData1,
  withData2,
)

const ApberForYear = ({
  activeNodeArray,
  data1,
  data2,
}: {
  activeNodeArray: Array<String>,
  data1: Object,
  data2: Object,
}) => {
  const data = { ...data1, ...data2 }
  const jahr = get(data1, 'apberuebersichtById.jahr', 0)
  const apberuebersicht = get(data1, 'apberuebersichtById')
  const aps = sortBy(
    get(data2, 'projektById.apsByProjId.nodes', []).filter(
      ap =>
        !!get(ap, 'apbersByApId.nodes[0]', null) &&
        !!get(ap, 'apbersByApId.nodes[0].id'),
    ),
    ap => get(ap, 'aeEigenschaftenByArtId.artname'),
  )

  if (data1.loading || data2.loading) {
    return (
      <Container>
        <LoadingContainer>Lade...</LoadingContainer>
      </Container>
    )
  }
  if (data1.error) {
    console.log(data1.error)
    return `Fehler: ${data1.error.message}`
  }
  if (data2.error) {
    console.log(data2.error)
    return `Fehler: ${data2.error.message}`
  }

  return (
    <ErrorBoundary>
      <Container>
        <ContentContainer>
          <FirstPageTitle>
            Umsetzung der Aktionspläne Flora
            <br />
            im Kanton Zürich
          </FirstPageTitle>
          <FirstPageSubTitle>{`Jahresbericht ${jahr}`}</FirstPageSubTitle>
          <FirstPageFnsLogo src={fnslogo} alt="FNS" width="350" />
          <FirstPageDate>{format(new Date(), 'DD.MM.YYYY')}</FirstPageDate>
          <FirstPageBearbeiter>Karin Marti, topos</FirstPageBearbeiter>
          {!!apberuebersicht.bemerkungen && (
            <SecondPage>
              <SecondPageTop />
              <SecondPageTitle>Zusammenfassung</SecondPageTitle>
              <SecondPageText>{apberuebersicht.bemerkungen}</SecondPageText>
            </SecondPage>
          )}
          <AvList data={data} />
          <ErfolgList jahr={jahr} data={data} />
          <AktPopList data={data} />
          {aps.map(ap => (
            <ApberForAp
              key={ap.id}
              apId={ap.id}
              jahr={jahr}
              apData={ap}
              isSubReport={true}
            />
          ))}
        </ContentContainer>
      </Container>
    </ErrorBoundary>
  )
}

export default enhance(ApberForYear)
