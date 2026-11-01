import { useState } from 'react'
import { useSetAtom, useAtomValue } from 'jotai'
import Button from '@mui/material/Button'

import { apiFetch } from '../../../../modules/api.ts'
import { exportModule } from '../../../../modules/export.ts'
import { tableIsFiltered } from '../../../../modules/tableIsFiltered.ts'

import styles from '../index.module.css'

import {
  addNotificationAtom,
  treePopGqlFilterAtom,
} from '../../../../store/index.ts'

interface PopsProps {
  filtered?: boolean
}

export const Pops = ({ filtered = false }: PopsProps) => {
  const addNotification = useSetAtom(addNotificationAtom)
  const popGqlFilter = useAtomValue(treePopGqlFilterAtom)

  const [queryState, setQueryState] = useState<string | undefined>()

  const onClickPops = async () => {
    setQueryState('lade Daten...')
    let pops:
      | {
          id: string
          ap_id: string | null
          nr: number | null
          name: string | null
          status: number | null
          bekannt_seit: number | null
          status_unklar: boolean | null
          status_unklar_begruendung: string | null
          lv95_x: number | null
          lv95_y: number | null
          created_at: string | null
          updated_at: string | null
          changed_by: string | null
        }[]
      | undefined
    let aps:
      | {
          id: string
          label: string | null
          start_jahr: number | null
          bearbeiter: string | null
          ae_taxonomy_by_art_id: { artname: string | null } | null
          ap_bearbstand_werte_by_bearbeitung: { text: string | null } | null
          ap_umsetzung_werte_by_umsetzung: { text: string | null } | null
          adresse_by_bearbeiter: { name: string | null } | null
        }[]
      | undefined
    let statusWerte = new Map<number, string>()
    let emailByAdresse = new Map<string, string>()
    try {
      const popSelect =
        'id,ap_id,nr,name,status,bekannt_seit,status_unklar,status_unklar_begruendung,lv95_x,lv95_y,created_at,updated_at,changed_by'
      // filtered: the cascade filter runs through query_pop first
      const [popsR, apsR, statusWerteR] = await Promise.all([
        filtered ?
          (async () => {
            const ids =
              (await apiFetch<{ id: string }[]>('/rpc/query_pop?select=id', {
                method: 'POST',
                body: JSON.stringify({ p_filter: popGqlFilter.filtered }),
              })) ?? []
            return ids.length ?
                ((await apiFetch(
                  `/q_pop?id=in.(${ids.map((r) => r.id).join(',')})&select=${popSelect}`,
                )) ?? [])
              : []
          })()
        : apiFetch(`/q_pop?select=${popSelect}`),
        apiFetch<NonNullable<typeof aps>>(
          `/v_ap?select=id,label,start_jahr,bearbeiter,ae_taxonomy_by_art_id,ap_bearbstand_werte_by_bearbeitung,ap_umsetzung_werte_by_umsetzung,adresse_by_bearbeiter`,
        ),
        apiFetch<{ code: number; text: string | null }[]>(
          `/pop_status_werte?select=code,text`,
        ),
      ])
      pops = (popsR as NonNullable<typeof pops>) ?? []
      aps = apsR ?? []
      statusWerte = new Map(
        (statusWerteR ?? []).map((w) => [w.code, w.text ?? '']),
      )
      // the av emails live on the users of the bearbeiter adresses
      const bearbeiterIds = [
        ...new Set((aps ?? []).map((a) => a.bearbeiter).filter(Boolean)),
      ] as string[]
      if (bearbeiterIds.length) {
        const users =
          (await apiFetch<
            { adresse_id: string | null; email: string | null }[]
          >(
            `/user?adresse_id=in.(${bearbeiterIds.join(',')})&select=adresse_id,email`,
          )) ?? []
        emailByAdresse = new Map(
          users.map((u) => [u.adresse_id ?? '', u.email ?? '']),
        )
      }
    } catch (error) {
      addNotification({
        message: (error as Error).message,
        options: {
          variant: 'error',
        },
      })
    }
    setQueryState('verarbeite...')
    const apById = new Map((aps ?? []).map((a) => [a.id, a]))
    const rows = (pops ?? [])
      .map((n) => {
        const ap = apById.get(n.ap_id ?? '')
        return {
          apId: ap?.id ?? null,
          apArtname: ap?.ae_taxonomy_by_art_id?.artname ?? null,
          apBearbeitung: ap?.ap_bearbstand_werte_by_bearbeitung?.text ?? null,
          apStartJahr: ap?.start_jahr ?? null,
          apUmsetzung: ap?.ap_umsetzung_werte_by_umsetzung?.text ?? null,
          avName: ap?.adresse_by_bearbeiter?.name ?? null,
          avEmail: emailByAdresse.get(ap?.bearbeiter ?? '') ?? null,
          id: n.id,
          nr: n.nr,
          name: n.name,
          status:
            n.status === null ? null : (statusWerte.get(n.status) ?? null),
          bekanntSeit: n.bekannt_seit,
          statusUnklar: n.status_unklar,
          statusUnklarBegruendung: n.status_unklar_begruendung,
          x: n.lv95_x,
          y: n.lv95_y,
          createdAt: n.created_at,
          updatedAt: n.updated_at,
          changedBy: n.changed_by,
        }
      })
      // former orderBy [AP_BY_AP_ID__LABEL_ASC, NR_ASC]
      .sort(
        (a, b) =>
          (apById.get(a.apId ?? '')?.label ?? '').localeCompare(
            apById.get(b.apId ?? '')?.label ?? '',
          ) || (a.nr ?? 0) - (b.nr ?? 0),
      )
    if (rows.length === 0) {
      setQueryState(undefined)
      return addNotification({
        message: 'Die Abfrage retournierte 0 Datensätze',
        options: {
          variant: 'warning',
        },
      })
    }
    void exportModule({
      data: rows,
      fileName: `Populationen${filtered ? '_gefiltert' : ''}`,
    })
    setQueryState(undefined)
  }

  const popIsFiltered = tableIsFiltered({ table: 'pop' })

  return (
    <Button
      className={styles.button}
      color="inherit"
      disabled={!!queryState || (filtered && !popIsFiltered)}
      onClick={() => void onClickPops()}
    >
      {filtered ? 'Populationen (gefiltert)' : 'Populationen'}
      {queryState ?
        <span className={styles.progress}>{queryState}</span>
      : null}
    </Button>
  )
}
