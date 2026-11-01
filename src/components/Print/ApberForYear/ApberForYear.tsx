import { apiFetch } from '../../../modules/api.ts'
import { DateTime } from 'luxon'
import { useQuery } from '@tanstack/react-query'
import MarkdownIt from 'markdown-it'
import { useParams } from 'react-router'

import fnslogo from './fnslogo.png'
import { AvList } from './AvList.tsx'
import { AktPopList } from './AktPopList.tsx'
import { ErfolgList } from './ErfolgList.tsx'
import { ApberForAps } from './ApberForAps.tsx'
import { ErrorBoundary } from '../../shared/ErrorBoundary.tsx'
import { Spinner } from '../../shared/Spinner.tsx'

import type {
  ApberChartsBulk,
  ApberEkzaehleinheits,
  ApberForYearQueryResult,
  ApberPops,
  ChartsForAp,
  JberQueryResult,
} from './types.ts'

import styles from './ApberForYear.module.css'

const mdParser = new MarkdownIt({ breaks: true })

interface ApberForYearProps {
  jahr?: number | undefined
  apberuebersichtId?: string | undefined
}

export const ApberForYear = (_props: ApberForYearProps) => {
  const { apberuebersichtId, projId } = useParams()

  const { data, error, isLoading } = useQuery({
    queryKey: ['ApberForYearQuery', apberuebersichtId],
    queryFn: async () => {
      // first get year
      const rows = await apiFetch<{ jahr: number | null }[]>(
        `/apberuebersicht?id=eq.${apberuebersichtId}&select=jahr`,
      )
      const data1 = { apberuebersichtById: rows?.[0] ?? { jahr: undefined } }
      const jahr = data1?.apberuebersichtById?.jahr ?? undefined
      // then the per-ap jber list: it defines which aps the report covers
      // (its ids also scope the bulk charts rpc below)
      const jberRows = await apiFetch<NonNullable<JberQueryResult['jberAbc']>['nodes']>(
        '/rpc/jber_abc?select=artname,id,startJahr:start_jahr,bearbeiter,bearbeitung,a3LPop:a_3_l_pop,a3LTpop:a_3_l_tpop,a4LPop:a_4_l_pop,a4LTpop:a_4_l_tpop,a5LPop:a_5_l_pop,a5LTpop:a_5_l_tpop,a7LPop:a_7_l_pop,a7LTpop:a_7_l_tpop,a8LPop:a_8_l_pop,a8LTpop:a_8_l_tpop,a9LPop:a_9_l_pop,a9LTpop:a_9_l_tpop,b1LPop:b_1_l_pop,b1LTpop:b_1_l_tpop,b1FirstYear:b_1_first_year,b1RPop:b_1_r_pop,b1RTpop:b_1_r_tpop,c1LPop:c_1_l_pop,c1LTpop:c_1_l_tpop,c1RPop:c_1_r_pop,c1RTpop:c_1_r_tpop,c1FirstYear:c_1_first_year,firstMassn:first_massn,c2RPop:c_2_r_pop,c2RTpop:c_2_r_tpop,c3RPop:c_3_r_pop,c3RTpop:c_3_r_tpop,c4RPop:c_4_r_pop,c4RTpop:c_4_r_tpop,c5RPop:c_5_r_pop,c5RTpop:c_5_r_tpop,c6RPop:c_6_r_pop,c6RTpop:c_6_r_tpop,c7RPop:c_7_r_pop,c7RTpop:c_7_r_tpop,erfolg,erfolgVorjahr:erfolg_vorjahr',
        {
          method: 'POST',
          body: JSON.stringify({ jahr }),
        },
      )
      const apIds = (jberRows ?? []).map((n) => n?.id)
      const apIdsFilter = `(${apIds.join(',')})`
      // then the rest in parallel: the deep history tree, the three chart
      // datasets for ALL aps at once (one rpc instead of 3 requests per ap -
      // the fan-out exhausted PostgREST's db pool -> 504s), plus the two
      // lists PopMenge needs per ap
      const [tree, chartsBulk, ekzaehleinheits, pops] = await Promise.all([
        apiFetch<ApberForYearQueryResult | null>('/rpc/apber_for_year_data', {
          method: 'POST',
          body: JSON.stringify({
            p_projekt_id: projId,
            p_jahr: jahr,
            p_apberuebersicht_id: apberuebersichtId,
          }),
        }),
        apiFetch<ApberChartsBulk | null>('/rpc/apber_charts_bulk', {
          method: 'POST',
          body: JSON.stringify({
            p_projekt_id: projId,
            p_jahr: jahr,
            p_ap_ids: apIds,
          }),
        }),
        apiFetch<ApberEkzaehleinheits>(
          `/v_ekzaehleinheit?ap_id=in.${apIdsFilter}&zielrelevant=eq.true&select=id,ap_id,tpopkontrzaehlEinheitWerteByZaehleinheitId:tpopkontrzaehl_einheit_werte_by_zaehleinheit_id`,
        ),
        apiFetch<ApberPops>(
          `/q_pop?ap_id=in.${apIdsFilter}&select=id,nr,name,status,ap_id&order=nr.asc,name.asc`,
        ),
      ])
      // slice the bulk per ap, in the shape the chart components expect
      const charts: Record<string, ChartsForAp> = {}
      for (const apId of apIds) {
        charts[apId] = {
          popStatus: {
            popNachStatusForJber: {
              nodes: (chartsBulk?.popStatus ?? []).filter(
                (r) => r.apId === apId,
              ),
            },
          },
          tpopKontrolliert: {
            tpopKontrolliertForJber: {
              // the self-fetching variant applies the old year <= jahr
              // connection filter client-side; same here
              nodes: (chartsBulk?.tpopKontrolliert ?? []).filter(
                (r) => r.apId === apId && (r.year ?? 0) <= (jahr ?? 0),
              ),
            },
          },
          popMenge: {
            apAuswPopMenge: {
              nodes: (chartsBulk?.popMenge ?? []).filter(
                (r) => r.apId === apId,
              ),
            },
            allEkzaehleinheits: {
              nodes: (ekzaehleinheits ?? []).filter((e) => e.ap_id === apId),
            },
            allPops: {
              nodes: (pops ?? []).filter((p) => p.ap_id === apId),
            },
          },
        }
      }

      return {
        data: tree ?? undefined,
        jberData: { jberAbc: { nodes: jberRows ?? [] } } as unknown as JberQueryResult,
        charts,
        jahr,
      }
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
            charts={data?.charts}
          />
        </div>
      </div>
    </ErrorBoundary>
  )
}
