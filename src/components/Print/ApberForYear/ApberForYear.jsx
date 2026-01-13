import { DateTime } from 'luxon'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import MarkdownIt from 'markdown-it'
import { useParams } from 'react-router'

import { query } from './query.js'
import { jberQuery } from './jberQuery.js'
import { query as queryForApberuebersicht } from '../../Projekte/Daten/Apberuebersicht/query.js'
import fnslogo from './fnslogo.png'
import { AvList } from './AvList.jsx'
import { AktPopList } from './AktPopList.jsx'
import { ErfolgList } from './ErfolgList.jsx'
import { ApberForAps } from './ApberForAps.jsx'
import { ErrorBoundary } from '../../shared/ErrorBoundary.jsx'
import { Spinner } from '../../shared/Spinner.jsx'

import styles from './ApberForYear.module.css'

const mdParser = new MarkdownIt({ breaks: true })

export const ApberForYear = () => {
  const { apberuebersichtId, projId } = useParams()

  const apolloClient = useApolloClient()

  const { data, error, isLoading } = useQuery({
    queryKey: ['ApberForYearQuery', apberuebersichtId],
    queryFn: async () => {
      // first get year
      const { data: data1 } = await apolloClient.query({
        query: queryForApberuebersicht,
        variables: {
          id: apberuebersichtId,
        },
        fetchPolicy: 'no-cache',
      })
      const jahr = data1?.apberuebersichtById?.jahr
      // then get data
      const { data } = await apolloClient.query({
        query: query,
        variables: {
          projektId: projId,
          jahr,
          apberuebersichtId,
        },
        fetchPolicy: 'no-cache',
      })
      // then get jber data
      // WARNING: this HAS to be queried later or somehow loading never ended
      const { data: jberData } = await apolloClient.query({
        query: jberQuery,
        variables: {
          jahr,
        },
        fetchPolicy: 'no-cache',
      })

      return { data, jberData, jahr }
    },
  })

  if (error) return `Fehler: ${error.message}`

  // // DANGER: without rerendering when loading mutates from true to false
  // // data remains undefined
  // // BUT WITH IT PRINT SOMETIMES ONLY SHOWS THE SPINNER!!!!!!!!!!!!!!!
  // if (isLoading) return <Spinner />

  const jahr = data?.jahr
  const apberuebersicht = data?.data?.apberuebersichtById

  // don't use Suspense - without jahr things fail hard
  if (isLoading) return <Spinner />

  return (
    <ErrorBoundary>
      <div className={styles.container}>
        <div className={styles.contentContainer}>
          <p className={styles.firstPageTitle}>
            Umsetzung der Aktionspläne Flora
            <br />
            im Kanton Zürich
          </p>
          <p className={styles.firstPageSubTitle}>{`Jahresbericht ${jahr}`}</p>
          <img
            className={styles.firstPageFnsLogo}
            src={fnslogo}
            alt="FNS"
            width="350"
          />
          <p className={styles.firstPageDate}>
            {DateTime.fromJSDate(new Date()).toFormat('dd.LL.yyyy')}
          </p>
          <p className={styles.firstPageBearbeiter}>Karin Marti, topos</p>
          {!!apberuebersicht?.bemerkungen && (
            <div className={styles.secondPage}>
              <div className={styles.secondPageTop} />
              <label className={styles.secondPageTitle}>Zusammenfassung</label>
              <div className={styles.secondPageText}>
                <div
                  dangerouslySetInnerHTML={{
                    __html: mdParser.render(apberuebersicht.bemerkungen),
                  }}
                />
              </div>
            </div>
          )}
          <AvList data={data?.jberData} />
          <ErfolgList
            jahr={jahr}
            data={data?.jberData}
          />
          <AktPopList year={jahr} />
          <ApberForAps
            jahr={jahr}
            data={data?.data}
            jberData={data?.jberData}
          />
        </div>
      </div>
    </ErrorBoundary>
  )
}
