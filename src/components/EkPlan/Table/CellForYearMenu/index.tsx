import { apiDelete, apiFetch, apiInsert } from '../../../../modules/api.ts'
import { useState } from 'react'
import { useSetAtom, useAtomValue } from 'jotai'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import { MdEdit as EditIcon, MdViewList as ListIcon } from 'react-icons/md'
import { useQuery, useQueryClient } from '@tanstack/react-query'

import {
  userNameAtom,
  addNotificationAtom,
  ekPlanShowEkAtom,
  ekPlanShowEkfAtom,
  ekPlanShowMassnAtom,
  ekPlanYearClickedAtom,
  ekPlanYearMenuAnchorAtom,
  ekPlanCloseYearCellMenuAtom,
} from '../../../../store/index.ts'

import { EksMenu } from './EksMenu/index.tsx'
import { EkfsMenu } from './EkfsMenu/index.tsx'
import { MassnsMenu } from './MassnsMenu/index.tsx'
import type { EkplanmenuTpopQueryResult } from './types.ts'

import styles from './index.module.css'

const anchorOrigin = {
  horizontal: 'right',
  vertical: 'top',
} as const

export const CellForYearMenu = () => {
  const addNotification = useSetAtom(addNotificationAtom)
  const tsQueryClient = useQueryClient()

  const showEk = useAtomValue(ekPlanShowEkAtom)
  const showEkf = useAtomValue(ekPlanShowEkfAtom)
  const showMassn = useAtomValue(ekPlanShowMassnAtom)
  const yearClicked = useAtomValue(ekPlanYearClickedAtom)
  const yearMenuAnchor = useAtomValue(ekPlanYearMenuAnchorAtom)
  const closeYearCellMenu = useSetAtom(ekPlanCloseYearCellMenuAtom)
  const { year, tpopId } = yearClicked

  const [eksAnchor, setEksAnchor] = useState<HTMLElement | null>(null)
  const [ekfsAnchor, setEkfsAnchor] = useState<HTMLElement | null>(null)
  const [massnsAnchor, setMassnsAnchor] = useState<HTMLElement | null>(null)

  const closeEksMenu = () => setEksAnchor(null)
  const closeEkfsMenu = () => setEkfsAnchor(null)
  const closeMassnsMenu = () => setMassnsAnchor(null)

  const removeEkPlan = async (typ: string) => {
    // menu actions only fire after a cell click set tpopId
    if (!tpopId) return
    let qResult:
      | {
          data?:
            | { allEkplans?: { nodes?: { id: string; typ: string }[] } }
            | undefined
        }
      | undefined
    try {
      qResult = {
        data: {
          allEkplans: {
            nodes:
              (await apiFetch<{ id: string; typ: string }[]>(
                `/ekplan?tpop_id=eq.${tpopId}&jahr=eq.${year}&select=id,typ`,
              )) ?? [],
          },
        },
      }
    } catch (error) {
      closeYearCellMenu()
      return addNotification({
        message: (error as Error).message,
        options: {
          variant: 'error',
        },
      })
    }
    const id = qResult?.data?.allEkplans?.nodes?.find((o) => o?.typ === typ)?.id
    if (!id) return
    try {
      await apiDelete('ekplan', id)
    } catch (error) {
      addNotification({
        message: (error as Error).message,
        options: {
          variant: 'error',
        },
      })
    }
    void tsQueryClient.invalidateQueries({
      queryKey: ['RowQueryForEkPlan'],
    })
    closeYearCellMenu()
  }

  const onClickEkEntfernen = () => removeEkPlan('EK')
  const onClickEkfEntfernen = () => removeEkPlan('EKF')

  const userName = useAtomValue(userNameAtom)

  const addEkPlan = async (typ: string) => {
    try {
      await apiInsert('ekplan', {
        tpop_id: tpopId,
        jahr: year,
        // ek_type enum labels are lowercase; the callers pass the
        // uppercased graphql values
        typ: typ.toLowerCase(),
        changed_by: userName,
      })
    } catch (error) {
      addNotification({
        message: (error as Error).message,
        options: {
          variant: 'error',
        },
      })
    }
    void tsQueryClient.invalidateQueries({
      queryKey: ['RowQueryForEkPlan'],
    })
    closeYearCellMenu()
  }

  const onClickEkPlanen = () => addEkPlan('EK')
  const onClickEkfPlanen = () => addEkPlan('EKF')

  const { data } = useQuery({
    queryKey: ['CellForYearMenu', tpopId, year, showEk, showEkf, showMassn],
    queryFn: async () => {
      // phase 5: the @include-driven document became conditionally-fetched
      // REST calls; werte/adresse texts join client-side
      const [
        kontrs,
        massnsRaw,
        tpopRow,
        einheitWerteR,
        methodeWerteR,
        massnTypWerteR,
        adressenR,
      ] = await Promise.all([
        apiFetch<
          {
            id: string
            datum: string | null
            typ: string | null
            bearbeiter: string | null
            tpopkontr_id?: string
          }[]
        >('/rpc/query_tpopkontr?select=id,datum,typ,bearbeiter', {
          method: 'POST',
          body: JSON.stringify({
            p_filter: {
              tpopByTpopId: { id: { equalTo: tpopId } },
              jahr: { equalTo: year },
            },
            p_order: [{ field: 'datum', dir: 'asc' }],
          }),
        }),
        showMassn ?
          apiFetch(
            '/rpc/query_tpopmassn?select=id,datum,typ,beschreibung,anz_triebe,anz_pflanzen,zieleinheit_anzahl,bearbeiter',
            {
              method: 'POST',
              body: JSON.stringify({
                p_filter: {
                  tpopByTpopId: { id: { equalTo: tpopId } },
                  jahr: { equalTo: year },
                },
                p_order: [{ field: 'datum', dir: 'asc' }],
              }),
            },
          )
        : Promise.resolve([]),
        apiFetch<
          {
            id: string
            pop_by_pop_id: {
              id: string
              ap_by_ap_id: { id: string; proj_id: string | null } | null
            } | null
          }[]
        >(`/v_tpop?id=eq.${tpopId}&select=id,pop_by_pop_id`),
        apiFetch<{ code: number; text: string | null }[]>(
          '/v_tpopkontrzaehl_einheit_werte?select=code,text',
        ),
        apiFetch<{ code: number; text: string | null }[]>(
          '/tpopkontrzaehl_methode_werte?select=code,text',
        ),
        apiFetch<
          { code: number; text: string | null; ansiedlung: boolean | null }[]
        >('/tpopmassn_typ_werte?select=code,text,ansiedlung'),
        apiFetch<{ id: string; name: string | null }[]>(
          '/v_adresse?select=id,name',
        ),
      ])
      const kontrIds = ((kontrs ?? []) as { id: string }[]).map((k) => k.id)
      const zaehls =
        kontrIds.length ?
          ((await apiFetch<
            {
              tpopkontr_id: string
              einheit: number | null
              methode: number | null
              anzahl: number | null
            }[]
          >(
            `/q_tpopkontrzaehl?tpopkontr_id=in.(${kontrIds.join(',')})&select=tpopkontr_id,einheit,methode,anzahl`,
          )) ?? [])
        : []
      const einheitWerte = new Map(
        (einheitWerteR ?? []).map((w) => [w.code, w.text ?? '']),
      )
      const methodeWerte = new Map(
        (methodeWerteR ?? []).map((w) => [w.code, w.text ?? '']),
      )
      const massnTypWerte = new Map(
        (massnTypWerteR ?? []).map((w) => [
          w.code,
          { text: w.text ?? '', ansiedlung: w.ansiedlung },
        ]),
      )
      const adressen = new Map(
        (adressenR ?? []).map((a) => [a.id, a.name ?? '']),
      )
      const zaehlsByKontr = new Map<string, typeof zaehls>()
      for (const z of zaehls) {
        const list = zaehlsByKontr.get(z.tpopkontr_id) ?? []
        list.push(z)
        zaehlsByKontr.set(z.tpopkontr_id, list)
      }
      const mapKontr = (k: {
        id: string
        datum: string | null
        typ: string | null
        bearbeiter: string | null
      }) => ({
        id: k.id,
        datum: k.datum,
        typ: k.typ,
        adresseByBearbeiter:
          k.bearbeiter ?
            { id: k.bearbeiter, name: adressen.get(k.bearbeiter) ?? null }
          : null,
        tpopkontrzaehlsByTpopkontrId: {
          nodes: (zaehlsByKontr.get(k.id) ?? []).map((z) => ({
            id: `${k.id}_${z.einheit ?? 'x'}_${z.methode ?? 'x'}`,
            einheit: z.einheit,
            anzahl: z.anzahl,
            tpopkontrzaehlEinheitWerteByEinheit:
              z.einheit == null ?
                null
              : { id: z.einheit, text: einheitWerte.get(z.einheit) ?? null },
            tpopkontrzaehlMethodeWerteByMethode:
              z.methode == null ?
                null
              : { id: z.methode, text: methodeWerte.get(z.methode) ?? null },
          })),
        },
      })
      const eks = (
        (kontrs ?? []) as unknown as Parameters<typeof mapKontr>[0][]
      )
        .filter((k) => showEk && k.typ !== 'Freiwilligen-Kontrolle')
        .map(mapKontr)
      const ekfs = (
        (kontrs ?? []) as unknown as Parameters<typeof mapKontr>[0][]
      )
        .filter((k) => showEkf && k.typ === 'Freiwilligen-Kontrolle')
        .map(mapKontr)
      const massns = (
        (massnsRaw ?? []) as {
          id: string
          datum: string | null
          typ: number | null
          beschreibung: string | null
          anz_triebe: number | null
          anz_pflanzen: number | null
          zieleinheit_anzahl: number | null
          bearbeiter: string | null
        }[]
      )
        .filter((m) =>
          m.typ == null ? false : massnTypWerte.get(m.typ)?.ansiedlung === true,
        )
        .map((m) => ({
          id: m.id,
          datum: m.datum,
          tpopmassnTypWerteByTyp:
            m.typ == null ?
              null
            : { id: m.typ, text: massnTypWerte.get(m.typ)?.text ?? null },
          beschreibung: m.beschreibung,
          anzTriebe: m.anz_triebe,
          anzPflanzen: m.anz_pflanzen,
          zieleinheitAnzahl: m.zieleinheit_anzahl,
          tpopkontrzaehlEinheitWerteByZieleinheitEinheit: null,
          bemerkungen: null as string | null,
          adresseByBearbeiter:
            m.bearbeiter ?
              { id: m.bearbeiter, name: adressen.get(m.bearbeiter) ?? null }
            : null,
        }))
      const tpopNode = (tpopRow ?? [])[0]
      const popOfTpop = tpopNode?.pop_by_pop_id ?? null
      const apOfPop = popOfTpop?.ap_by_ap_id ?? null
      return {
        tpopById:
          tpopNode ?
            {
              id: tpopId,
              eks: { nodes: eks },
              ekfs: { nodes: ekfs },
              massns: { nodes: massns },
              popByPopId:
                popOfTpop ?
                  {
                    id: popOfTpop.id,
                    apByApId:
                      apOfPop ?
                        {
                          id: apOfPop.id,
                          projId: apOfPop.proj_id,
                        }
                      : null,
                  }
                : null,
            }
          : null,
      } as unknown as EkplanmenuTpopQueryResult
    },
    // DO NOT add suspense here, it breaks the menu display (entire ekplan form reloads)
  })
  const tpop = data?.tpopById ?? undefined
  const eks = data?.tpopById?.eks?.nodes ?? []
  const ekfs = data?.tpopById?.ekfs?.nodes ?? []
  const massns = data?.tpopById?.massns?.nodes ?? []

  return (
    <>
      <Menu
        anchorReference="anchorPosition"
        anchorPosition={{
          top: yearMenuAnchor?.top ?? 0,
          left: yearMenuAnchor?.right ?? 0,
        }}
        anchorOrigin={anchorOrigin}
        open={Boolean(yearMenuAnchor)}
        onClose={closeYearCellMenu}
      >
        <h5 className={styles.yearCellMenuTitle}>{yearClicked.title}</h5>
        {showEk && (
          <div>
            {yearClicked.ekPlan ?
              <MenuItem
                className={styles.menuItem}
                onClick={() => void onClickEkEntfernen()}
              >
                <ListItemIcon className={styles.listItemIcon}>
                  <EditIcon />
                </ListItemIcon>
                <ListItemText
                  className={styles.listItemText}
                  primary="EK-Planung entfernen"
                />
              </MenuItem>
            : <MenuItem
                className={styles.menuItem}
                onClick={() => void onClickEkPlanen()}
              >
                <ListItemIcon className={styles.listItemIcon}>
                  <EditIcon />
                </ListItemIcon>
                <ListItemText
                  className={styles.listItemText}
                  primary="EK planen"
                />
              </MenuItem>
            }
          </div>
        )}
        {showEkf && (
          <div>
            {yearClicked.ekfPlan ?
              <MenuItem
                className={styles.menuItem}
                onClick={() => void onClickEkfEntfernen()}
              >
                <ListItemIcon className={styles.listItemIcon}>
                  <EditIcon />
                </ListItemIcon>
                <ListItemText
                  className={styles.listItemText}
                  primary="EKF-Planung entfernen"
                />
              </MenuItem>
            : <MenuItem
                className={styles.menuItem}
                onClick={() => void onClickEkfPlanen()}
              >
                <ListItemIcon className={styles.listItemIcon}>
                  <EditIcon />
                </ListItemIcon>
                <ListItemText
                  className={styles.listItemText}
                  primary="EKF planen"
                />
              </MenuItem>
            }
          </div>
        )}
        {showEk && !!eks.length && (
          <MenuItem
            className={styles.menuItem}
            onClick={(e) => setEksAnchor(e.currentTarget)}
            style={{
              backgroundColor: eksAnchor ? 'rgba(0, 0, 0, 0.08)' : 'unset',
            }}
          >
            <ListItemIcon className={styles.listItemIcon}>
              <ListIcon />
            </ListItemIcon>
            <ListItemText
              className={styles.listItemText}
              primary={`EK (${eks.length})`}
            />
          </MenuItem>
        )}
        {showEkf && !!ekfs.length && (
          <MenuItem
            className={styles.menuItem}
            onClick={(e) => setEkfsAnchor(e.currentTarget)}
            style={{
              backgroundColor: ekfsAnchor ? 'rgba(0, 0, 0, 0.08)' : 'unset',
            }}
          >
            <ListItemIcon className={styles.listItemIcon}>
              <ListIcon />
            </ListItemIcon>
            <ListItemText
              className={styles.listItemText}
              primary={`EKF (${ekfs.length})`}
            />
          </MenuItem>
        )}
        {showMassn && !!massns.length && (
          <MenuItem
            className={styles.menuItem}
            onClick={(e) => setMassnsAnchor(e.currentTarget)}
            style={{
              backgroundColor: massnsAnchor ? 'rgba(0, 0, 0, 0.08)' : 'unset',
            }}
          >
            <ListItemIcon className={styles.listItemIcon}>
              <ListIcon />
            </ListItemIcon>
            <ListItemText
              className={styles.listItemText}
              primary={`Ansiedlungen (${massns.length})`}
            />
          </MenuItem>
        )}
      </Menu>
      {!!eksAnchor && (
        <EksMenu
          tpop={tpop}
          eks={eks}
          eksAnchor={eksAnchor}
          closeEksMenu={closeEksMenu}
        />
      )}
      {!!ekfsAnchor && (
        <EkfsMenu
          tpop={tpop}
          ekfs={ekfs}
          ekfsAnchor={ekfsAnchor}
          closeEkfsMenu={closeEkfsMenu}
        />
      )}
      {!!massnsAnchor && (
        <MassnsMenu
          tpop={tpop}
          massns={massns}
          massnsAnchor={massnsAnchor}
          closeMassnsMenu={closeMassnsMenu}
        />
      )}
    </>
  )
}
