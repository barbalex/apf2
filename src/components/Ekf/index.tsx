import { useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'
import { SplitPane, Pane } from 'react-split-pane'
import { apiFetch } from '../../modules/api.ts'

import { isPrintAtom, isEkfSinglePrintAtom } from '../../store/index.ts'

// when Karte was loaded async, it did not load,
// but only in production!
import { EkfList } from './List/index.tsx'
import { Component as Tpopfreiwkontr } from '../Projekte/Daten/Tpopfreiwkontr/index.tsx'
import { getEkfFromData, type EkfQueryResult } from './getEkfFromData.ts'

import styles from './index.module.css'

export const Component = () => {
  const { search } = useLocation()
  const navigate = useNavigate()
  const { userId, ekfId, ekfYear } = useParams()
  const isPrint = useAtomValue(isPrintAtom)
  const isEkfSinglePrint = useAtomValue(isEkfSinglePrintAtom)

  const ekfRefDate = new Date() //.setMonth(new Date().getMonth() - 2)
  const ekfRefYear = new Date(ekfRefDate).getFullYear()

  const { data } = useSuspenseQuery({
    queryKey: ['ekf', userId, ekfYear],
    queryFn: async () => {
      // phase 5: user → its adresse → this year's freiwilligen-kontrollen,
      // joined with tpop/pop/ap/projekt context client-side.
      // accept empty jahr only when the reference year matches (former
      // dataByUserId vs dataWithDateByUserId)
      const jahr = +(ekfYear ?? 0)
      const acceptNullJahr = ekfRefYear === jahr
      const users =
        (await apiFetch<{ adresse_id: string | null }[]>(
          `/user?id=eq.${userId}&select=adresse_id:adresse_id`,
        )) ?? []
      const adresseId = users[0]?.adresse_id ?? null
      if (!adresseId) return { userById: null }
      // only the kontrs of this bearbeiter — then the tpop/pop/ap context
      // is fetched scoped to them, not as full tables (#837: the full
      // q_tpop/q_pop/v_ap pulls were ~5 MB per EKF entry)
      const kontrs = await apiFetch<
        {
          id: string
          datum: string | null
          tpop_id: string | null
        }[]
      >('/rpc/query_tpopkontr?select=id,datum,tpop_id', {
        method: 'POST',
        body: JSON.stringify({
          p_filter: {
            bearbeiter: adresseId,
            typ: { equalTo: 'Freiwilligen-Kontrolle' },
            ...(acceptNullJahr ?
                {
                  or: [{ jahr: { equalTo: jahr } }, { jahr: { isNull: true } }],
                }
              : { jahr: { equalTo: jahr } }),
          },
        }),
      })
      const tpopIds = [
        ...new Set((kontrs ?? []).map((k) => k.tpop_id).filter((t): t is string => !!t)),
      ]
      const tpops = tpopIds.length ?
          await apiFetch<
            {
              id: string
              nr: number | null
              flurname: string | null
              gemeinde: string | null
              pop_id: string | null
            }[]
          >('/rpc/query_tpop?select=id,nr,flurname,gemeinde,pop_id', {
            method: 'POST',
            body: JSON.stringify({
              p_filter: { id: { in: tpopIds } },
            }),
          })
        : []
      const popIds = [
        ...new Set((tpops ?? []).map((t) => t.pop_id).filter((p): p is string => !!p)),
      ]
      const pops = popIds.length ?
          await apiFetch<
            {
              id: string
              nr: number | null
              name: string | null
              ap_id: string | null
            }[]
          >('/rpc/query_pop?select=id,nr,name,ap_id', {
            method: 'POST',
            body: JSON.stringify({
              p_filter: { id: { in: popIds } },
            }),
          })
        : []
      const apIds = [
        ...new Set((pops ?? []).map((p) => p.ap_id).filter((a): a is string => !!a)),
      ]
      const aps = apIds.length ?
          await apiFetch<
            {
              id: string
              ae_taxonomy_by_art_id: { artname: string | null } | null
              projekt_by_proj_id: {
                id: string | null
                name: string | null
              } | null
            }[]
          >(
            // ae_taxonomy_by_art_id/projekt_by_proj_id are computed jsonb
            // columns of v_ap — no column sub-selection possible
            `/v_ap?id=in.(${apIds.join(',')})&select=id,ae_taxonomy_by_art_id,projekt_by_proj_id`,
          )
        : []
      const tpopById = new Map((tpops ?? []).map((t) => [t.id, t]))
      const popById = new Map((pops ?? []).map((p) => [p.id, p]))
      const apById = new Map((aps ?? []).map((a) => [a.id, a]))
      const nodes = (kontrs ?? []).map((e) => {
        const tpop = e.tpop_id ? tpopById.get(e.tpop_id) : undefined
        const pop = tpop?.pop_id ? popById.get(tpop.pop_id) : undefined
        const apBy = pop?.ap_id ? apById.get(pop.ap_id) : undefined
        return {
          id: e.id,
          datum: e.datum,
          tpopByTpopId:
            tpop ?
              {
                id: tpop.id,
                nr: tpop.nr,
                flurname: tpop.flurname,
                gemeinde: tpop.gemeinde,
                popByPopId:
                  pop ?
                    {
                      id: pop.id,
                      nr: pop.nr,
                      name: pop.name,
                      apByApId:
                        apBy ?
                          {
                            id: apBy.id,
                            aeTaxonomyByArtId: apBy.ae_taxonomy_by_art_id,
                            projektByProjId: apBy.projekt_by_proj_id,
                          }
                        : null,
                    }
                  : null,
              }
            : null,
        }
      })
      return {
        userById: {
          id: userId,
          adresseByAdresseId: { tpopkontrsByBearbeiter: { nodes } },
        },
      } as unknown as EkfQueryResult
    },
  })

  const ekf = getEkfFromData({ data })

  useEffect(() => {
    // navigate to first kontrId so form is shown for first ekf
    // IF none is chosen yet
    if (ekf.length > 0 && !ekfId) {
      const firstEkf = ekf[0]
      if (firstEkf) {
        void navigate(
          `/Daten/Benutzer/${userId}/EKF/${ekfYear}/${firstEkf.id}${search}`,
        )
      }
    }
    // adding ekf as dependency causes infinite loop
    // https://github.com/barbalex/apf2/issues/629
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ekfYear, ekfId, navigate, userId, search])

  if (ekf.length === 0) {
    return (
      <div className={styles.noDataContainer}>
        {`Für das Jahr ${ekfYear} existieren offenbar keine Erfolgskontrollen mit Ihnen als BearbeiterIn`}
      </div>
    )
  }

  if (isPrint && isEkfSinglePrint) {
    return <Tpopfreiwkontr id={ekfId} />
  }

  if (isPrint && ekf.length > 0) {
    return (
      <>
        {ekf.map((e) => (
          <Tpopfreiwkontr
            id={e.id}
            key={e.id}
          />
        ))}
      </>
    )
  }

  return (
    <div className={styles.container}>
      <SplitPane direction="horizontal">
        <Pane
          size="350px"
          minSize={100}
        >
          <EkfList ekf={ekf} />
        </Pane>
        {ekfId ?
          <Pane>
            <Tpopfreiwkontr id={ekfId} />
          </Pane>
        : <Pane>
            <div className={styles.innerContainer} />
          </Pane>
        }
      </SplitPane>
    </div>
  )
}
