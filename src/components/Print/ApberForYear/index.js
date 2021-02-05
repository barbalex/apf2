import React, { useContext } from 'react'
import styled from 'styled-components'
import { DateTime } from 'luxon'
import { observer } from 'mobx-react-lite'
import { useQuery } from '@apollo/client'
import MarkdownIt from 'markdown-it'
import { gql } from '@apollo/client'

import query2 from './query2'
import fnslogo from './fnslogo.png'
import AvList from './AvList'
import AktPopList from './AktPopList'
import ErfolgList from './ErfolgList'
import ApberForAps from './ApberForAps'
import storeContext from '../../../storeContext'
import ErrorBoundary from '../../shared/ErrorBoundary'

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
  const store = useContext(storeContext)
  const {
    apberuebersichtIdInActiveNodeArray,
    projIdInActiveNodeArray,
  } = store.tree

  const apberuebersichtId =
    apberuebersichtIdInActiveNodeArray || '99999999-9999-9999-9999-999999999999'
  const projektId =
    projIdInActiveNodeArray || '99999999-9999-9999-9999-999999999999'
  const { data: data1, loading: loading1, error: error1 } = useQuery(
    gql`
      query apberuebersichtByIdForApberForYear($apberuebersichtId: UUID!) {
        apberuebersichtById(id: $apberuebersichtId) {
          id
          jahr
          bemerkungen
        }
      }
    `,
    {
      variables: {
        apberuebersichtId,
      },
    },
  )
  const jahr = data1?.apberuebersichtById?.jahr ?? 0
  const { data: data2, loading: loading2, error: error2 } = useQuery(query2, {
    variables: {
      projektId,
      jahr,
    },
  })

  //console.log('ApberForYear', { loading1, loading2, data1, data2, error2 })
  console.log('ApberForYear', { loading2, data2, jahr, projektId })

  if (error1) {
    return `Fehler: ${error1.message}`
  }
  if (error2) {
    return `Fehler: ${error2.message}`
  }

  const apberuebersicht = data1?.apberuebersichtById

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
          <AvList data={data2} />
          <ErfolgList jahr={jahr} data={data2} />
          <AktPopList year={jahr} />
          <ApberForAps jahr={jahr} data={data2} />
        </ContentContainer>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(ApberForYear)
