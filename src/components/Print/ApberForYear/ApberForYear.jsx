import React from 'react'
import styled from '@emotion/styled'
import { DateTime } from 'luxon'
import { useApolloClient } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import MarkdownIt from 'markdown-it'
import { useParams } from 'react-router-dom'

import queryForYear from './query'
import jberQueryForYear from './jberQuery'
import queryForApberuebersicht from '../../Projekte/Daten/Apberuebersicht/query'
import fnslogo from './fnslogo.png'
import AvList from './AvList'
import AktPopList from './AktPopList'
import ErfolgList from './ErfolgList'
import ApberForAps from './ApberForAps'
import ErrorBoundary from '../../shared/ErrorBoundary'
import Spinner from '../../shared/Spinner.jsx'

const mdParser = new MarkdownIt({ breaks: true })

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
    height: auto;
    width: 21cm;

    margin: 0 auto !important;
    padding: 0.5cm !important;
    padding-left: 0 !important;

    box-shadow: unset;
    overflow: visible !important;
  }
`
const ContentContainer = styled.div`
  padding: 1.5cm;
  font-size: 14px;
  @media print {
    padding: 0;
    height: auto;
    overflow: visible !important;
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
  @media screen {
    padding-top: 0;
  }
`
const SecondPage = styled.div`
  break-after: page;
`
const SecondPageTitle = styled.label`
  padding-top: 2cm;
  font-size: 18px;
  font-weight: 700;
`
const SecondPageText = styled.div`
  hyphens: auto;
  padding-top: 0.2cm;
`

const ApberForYear = () => {
  const { apberUebersichtId, projId } = useParams()

  const client = useApolloClient()

  const { data, error, isLoading } = useQuery({
    queryKey: ['ApberForYearQuery', apberUebersichtId],
    queryFn: async () => {
      // first get year
      const { data: data1 } = await client.query({
        query: queryForApberuebersicht,
        variables: {
          id: apberUebersichtId,
        },
        fetchPolicy: 'no-cache',
      })
      const jahr = data1?.apberuebersichtById?.jahr
      // then get data
      const { data } = await client.query({
        query: queryForYear,
        variables: {
          projektId: projId,
          jahr,
          apberuebersichtId: apberUebersichtId,
        },
        fetchPolicy: 'no-cache',
      })
      // then get jber data
      // WARNING: this HAS to be queried later or somehow loading never ended
      const { data: jberData } = await client.query({
        query: jberQueryForYear,
        variables: {
          jahr,
        },
        fetchPolicy: 'no-cache',
      })

      return { data, jberData, jahr }
    },
  })

  if (error) {
    return `Fehler: ${error.message}`
  }

  // DANGER: without rerendering when loading mutates from true to false
  // data remains undefined
  // BUT WITH IT PRINT SOMETIMES ONLY SHOWS THE SPINNER!!!!!!!!!!!!!!!
  if (isLoading) return <Spinner />

  const jahr = data?.jahr
  const apberuebersicht = data?.data?.apberuebersichtById

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
          <FirstPageDate>
            {DateTime.fromJSDate(new Date()).toFormat('dd.LL.yyyy')}
          </FirstPageDate>
          <FirstPageBearbeiter>Karin Marti, topos</FirstPageBearbeiter>
          {!!apberuebersicht?.bemerkungen && (
            <SecondPage>
              <SecondPageTop />
              <SecondPageTitle>Zusammenfassung</SecondPageTitle>
              <SecondPageText>
                <div
                  dangerouslySetInnerHTML={{
                    __html: mdParser.render(apberuebersicht.bemerkungen),
                  }}
                />
              </SecondPageText>
            </SecondPage>
          )}
          <AvList data={data?.jberData} />
          <ErfolgList jahr={jahr} data={data?.jberData} />
          <AktPopList year={jahr} />
          <ApberForAps
            jahr={jahr}
            data={data?.data}
            jberData={data?.jberData}
          />
        </ContentContainer>
      </Container>
    </ErrorBoundary>
  )
}

export default ApberForYear
