import { useState } from 'react'
import { useSetAtom, useAtomValue } from 'jotai'
import Button from '@mui/material/Button'

import { apiFetch } from '../../../../modules/api.ts'
import { exportModule } from '../../../../modules/export.ts'

import styles from '../index.module.css'

import {
  addNotificationAtom,
  treeTpopkontrGqlFilterAtom,
} from '../../../../store/index.ts'

interface KontrollenProps {
  filtered?: boolean
}

export const Kontrollen = ({ filtered = false }: KontrollenProps) => {
  const addNotification = useSetAtom(addNotificationAtom)
  const tpopkontrGqlFilter = useAtomValue(treeTpopkontrGqlFilterAtom)

  const [queryState, setQueryState] = useState<string | undefined>()

  const onClickKontrollen = async () => {
    setQueryState('lade Daten...')
    let kontrs:
      | {
          id: string
          tpop_id: string | null
          jahr: number | null
          datum: string | null
          typ: number | null
          bearbeiter: string | null
          ueberlebensrate: number | null
          vitalitaet: string | null
          entwicklung: number | null
          ursachen: string | null
          erfolgsbeurteilung: string | null
          umsetzung_aendern: string | null
          kontrolle_aendern: string | null
          bemerkungen: string | null
          lr_delarze: string | null
          lr_umgebung_delarze: string | null
          vegetationstyp: string | null
          konkurrenz: string | null
          moosschicht: string | null
          krautschicht: string | null
          strauchschicht: string | null
          baumschicht: string | null
          idealbiotop_uebereinstimmung: number | null
          handlungsbedarf: string | null
          flaeche_ueberprueft: number | null
          flaeche: number | null
          plan_vorhanden: boolean | null
          deckung_vegetation: number | null
          deckung_nackter_boden: number | null
          deckung_ap_art: number | null
          jungpflanzen_vorhanden: boolean | null
          vegetationshoehe_maximum: number | null
          vegetationshoehe_mittel: number | null
          gefaehrdung: string | null
          created_at: string | null
          updated_at: string | null
          changed_by: string | null
          apber_nicht_relevant: number | null
          apber_nicht_relevant_grund: number | null
          ekf_bemerkungen: string | null
        }[]
      | undefined
    let tpops:
      | {
          id: string
          pop_id: string | null
          nr: number | null
          gemeinde: string | null
          flurname: string | null
          status: number | null
          bekannt_seit: number | null
          status_unklar: boolean | null
          status_unklar_grund: string | null
          lv95_x: number | null
          lv95_y: number | null
          radius: number | null
          hoehe: number | null
          exposition: string | null
          klima: string | null
          neigung: string | null
          beschreibung: string | null
          kataster_nr: string | null
          apber_relevant: number | null
          apber_relevant_grund: number | null
          eigentuemer: string | null
          kontakt: string | null
          nutzungszone: string | null
          bewirtschafter: string | null
          bewirtschaftung: string | null
          ekfrequenz: string | null
          ekfrequenz_abweichend: boolean | null
          ekf_kontrolleur: string | null
        }[]
      | undefined
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
        }[]
      | undefined
    let aps:
      | {
          id: string
          label: string | null
          start_jahr: number | null
          bearbeiter: string | null
          ae_taxonomy_by_art_id: {
            artname: string | null
            familie: string | null
          } | null
          ap_bearbstand_werte_by_bearbeitung: { text: string | null } | null
          ap_umsetzung_werte_by_umsetzung: { text: string | null } | null
          adresse_by_bearbeiter: { name: string | null } | null
        }[]
      | undefined
    let statusWerte = new Map<number, string>()
    let typWerte = new Map<number, string>()
    let entwicklungWerte = new Map<number, string>()
    let idbiotuebereinstWerte = new Map<number, string>()
    let einheitWerte = new Map<number, string>()
    let methodeWerte = new Map<number, string>()
    let emailByAdresse = new Map<string, string>()
    let adressNamen = new Map<string, string>()
    const zaehlsByKontr = new Map<
      string,
      {
        einheit: number | null
        methode: number | null
        anzahl: number | null
      }[]
    >()
    try {
      const kontrSelect =
        'id,tpop_id,jahr,datum,typ,bearbeiter,ueberlebensrate,vitalitaet,entwicklung,ursachen,erfolgsbeurteilung,umsetzung_aendern,kontrolle_aendern,bemerkungen,lr_delarze,lr_umgebung_delarze,vegetationstyp,konkurrenz,moosschicht,krautschicht,strauchschicht,baumschicht,idealbiotop_uebereinstimmung,handlungsbedarf,flaeche_ueberprueft,flaeche,plan_vorhanden,deckung_vegetation,deckung_nackter_boden,deckung_ap_art,jungpflanzen_vorhanden,vegetationshoehe_maximum,vegetationshoehe_mittel,gefaehrdung,created_at,updated_at,changed_by,apber_nicht_relevant,apber_nicht_relevant_grund,ekf_bemerkungen'
      // filtered: the cascade filter runs through query_tpopkontr first
      const kontrsR = await (filtered ?
        (async () => {
          const ids =
            (await apiFetch<{ id: string }[]>(
              '/rpc/query_tpopkontr?select=id',
              {
                method: 'POST',
                body: JSON.stringify({ p_filter: tpopkontrGqlFilter }),
              },
            )) ?? []
          return ids.length ?
              ((await apiFetch(
                `/q_tpopkontr?id=in.(${ids.map((r) => r.id).join(',')})&select=${kontrSelect}`,
              )) ?? [])
            : []
        })()
      : apiFetch(`/q_tpopkontr?select=${kontrSelect}`))
      const [
        tpopsR,
        popsR,
        apsR,
        statusWerteR,
        typWerteR,
        entwicklungWerteR,
        idbiotuebereinstWerteR,
        einheitWerteR,
        methodeWerteR,
        adressenR,
        zaehlsR,
      ] = await Promise.all([
        apiFetch<NonNullable<typeof tpops>>(
          `/q_tpop?select=id,pop_id,nr,gemeinde,flurname,status,bekannt_seit,status_unklar,status_unklar_grund,lv95_x,lv95_y,radius,hoehe,exposition,klima,neigung,beschreibung,kataster_nr,apber_relevant,apber_relevant_grund,eigentuemer,kontakt,nutzungszone,bewirtschafter,bewirtschaftung,ekfrequenz,ekfrequenz_abweichend,ekf_kontrolleur`,
        ),
        apiFetch<NonNullable<typeof pops>>(
          `/q_pop?select=id,ap_id,nr,name,status,bekannt_seit,status_unklar,status_unklar_begruendung,lv95_x,lv95_y`,
        ),
        apiFetch<NonNullable<typeof aps>>(
          `/v_ap?select=id,label,start_jahr,bearbeiter,ae_taxonomy_by_art_id,ap_bearbstand_werte_by_bearbeitung,ap_umsetzung_werte_by_umsetzung,adresse_by_bearbeiter`,
        ),
        apiFetch<{ code: number; text: string | null }[]>(
          `/pop_status_werte?select=code,text`,
        ),
        apiFetch<{ code: number; text: string | null }[]>(
          `/tpopkontr_typ_werte?select=code,text`,
        ),
        apiFetch<{ code: number; text: string | null }[]>(
          `/tpop_entwicklung_werte?select=code,text`,
        ),
        apiFetch<{ code: number; text: string | null }[]>(
          `/tpopkontr_idbiotuebereinst_werte?select=code,text`,
        ),
        apiFetch<{ code: number; text: string | null }[]>(
          `/v_tpopkontrzaehl_einheit_werte?select=code,text`,
        ),
        apiFetch<{ code: number; text: string | null }[]>(
          `/tpopkontrzaehl_methode_werte?select=code,text`,
        ),
        apiFetch<{ id: string; name: string | null }[]>(
          `/v_adresse?select=id,name`,
        ),
        apiFetch<
          {
            tpopkontr_id: string
            einheit: number | null
            methode: number | null
            anzahl: number | null
          }[]
        >(`/q_tpopkontrzaehl?select=tpopkontr_id,einheit,methode,anzahl`),
      ])
      kontrs = (kontrsR as NonNullable<typeof kontrs>) ?? []
      tpops = tpopsR ?? []
      pops = popsR ?? []
      aps = apsR ?? []
      statusWerte = new Map(
        (statusWerteR ?? []).map((w) => [w.code, w.text ?? '']),
      )
      typWerte = new Map((typWerteR ?? []).map((w) => [w.code, w.text ?? '']))
      entwicklungWerte = new Map(
        (entwicklungWerteR ?? []).map((w) => [w.code, w.text ?? '']),
      )
      idbiotuebereinstWerte = new Map(
        (idbiotuebereinstWerteR ?? []).map((w) => [w.code, w.text ?? '']),
      )
      einheitWerte = new Map(
        (einheitWerteR ?? []).map((w) => [w.code, w.text ?? '']),
      )
      methodeWerte = new Map(
        (methodeWerteR ?? []).map((w) => [w.code, w.text ?? '']),
      )
      adressNamen = new Map((adressenR ?? []).map((a) => [a.id, a.name ?? '']))
      for (const z of zaehlsR ?? []) {
        const list = zaehlsByKontr.get(z.tpopkontr_id) ?? []
        list.push(z)
        zaehlsByKontr.set(z.tpopkontr_id, list)
      }
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
        options: { variant: 'error' },
      })
    }
    setQueryState('verarbeite...')
    const tpopById = new Map((tpops ?? []).map((t) => [t.id, t]))
    const popById = new Map((pops ?? []).map((p) => [p.id, p]))
    const apById = new Map((aps ?? []).map((a) => [a.id, a]))
    const rows = (kontrs ?? [])
      .map((n) => {
        const tpop = tpopById.get(n.tpop_id ?? '')
        const pop = tpop ? popById.get(tpop.pop_id ?? '') : undefined
        const apBy = pop?.ap_id ? apById.get(pop.ap_id) : undefined
        return {
          apId: apBy?.id ?? null,
          apFamilie: apBy?.ae_taxonomy_by_art_id?.familie ?? null,
          apArtname: apBy?.ae_taxonomy_by_art_id?.artname ?? null,
          apBearbeitung: apBy?.ap_bearbstand_werte_by_bearbeitung?.text ?? null,
          apStartJahr: apBy?.start_jahr ?? null,
          apUmsetzung: apBy?.ap_umsetzung_werte_by_umsetzung?.text ?? null,
          avName: apBy?.adresse_by_bearbeiter?.name ?? null,
          avEmail: emailByAdresse.get(apBy?.bearbeiter ?? '') ?? null,
          popId: pop?.id ?? null,
          popNr: pop?.nr ?? null,
          popName: pop?.name ?? null,
          popStatus:
            pop?.status == null ? null : (statusWerte.get(pop.status) ?? null),
          popBekanntSeit: pop?.bekannt_seit ?? null,
          popStatusUnklar: pop?.status_unklar ?? null,
          popStatusUnklarBegruendung: pop?.status_unklar_begruendung ?? null,
          popX: pop?.lv95_x ?? null,
          popY: pop?.lv95_y ?? null,
          tpopId: tpop?.id ?? null,
          tpopNr: tpop?.nr ?? null,
          tpopGemeinde: tpop?.gemeinde ?? null,
          tpopFlurname: tpop?.flurname ?? null,
          tpopStatus:
            tpop?.status == null ?
              null
            : (statusWerte.get(tpop.status) ?? null),
          statusDecodiert:
            tpop?.status == null ?
              null
            : (statusWerte.get(tpop.status) ?? null),
          tpopBekanntSeit: tpop?.bekannt_seit ?? null,
          tpopStatusUnklar: tpop?.status_unklar ?? null,
          tpopStatusUnklarGrund: tpop?.status_unklar_grund ?? null,
          tpopX: tpop?.lv95_x ?? null,
          tpopY: tpop?.lv95_y ?? null,
          tpopRadius: tpop?.radius ?? null,
          tpopHoehe: tpop?.hoehe ?? null,
          tpopExposition: tpop?.exposition ?? null,
          tpopKlima: tpop?.klima ?? null,
          tpopNeigung: tpop?.neigung ?? null,
          tpopBeschreibung: tpop?.beschreibung ?? null,
          tpopKatasterNr: tpop?.kataster_nr ?? null,
          tpopApberRelevant: tpop?.apber_relevant ?? null,
          tpopApberRelevantGrund: tpop?.apber_relevant_grund ?? null,
          tpopEigentuemer: tpop?.eigentuemer ?? null,
          tpopKontakt: tpop?.kontakt ?? null,
          tpopNutzungszone: tpop?.nutzungszone ?? null,
          tpopBewirtschafter: tpop?.bewirtschafter ?? null,
          tpopBewirtschaftung: tpop?.bewirtschaftung ?? null,
          tpopEkfrequenz: tpop?.ekfrequenz ?? null,
          tpopEkfrequenzAbweichend: tpop?.ekfrequenz_abweichend ?? null,
          tpopEkfKontrolleur:
            adressNamen.get(tpop?.ekf_kontrolleur ?? '') ?? null,
          id: n.id,
          jahr: n.jahr,
          datum: n.datum,
          typ: n.typ === null ? null : (typWerte.get(n.typ) ?? null),
          bearbeiter: adressNamen.get(n.bearbeiter ?? '') ?? null,
          ueberlebensrate: n.ueberlebensrate,
          vitalitaet: n.vitalitaet,
          entwicklung:
            n.entwicklung === null ?
              null
            : (entwicklungWerte.get(n.entwicklung) ?? null),
          ursachen: n.ursachen,
          erfolgsbeurteilung: n.erfolgsbeurteilung,
          umsetzungAendern: n.umsetzung_aendern,
          kontrolleAendern: n.kontrolle_aendern,
          bemerkungen: n.bemerkungen,
          lrDelarze: n.lr_delarze,
          lrUmgebungDelarze: n.lr_umgebung_delarze,
          vegetationstyp: n.vegetationstyp,
          konkurrenz: n.konkurrenz,
          moosschicht: n.moosschicht,
          krautschicht: n.krautschicht,
          strauchschicht: n.strauchschicht,
          baumschicht: n.baumschicht,
          idealbiotopUebereinstimmung:
            n.idealbiotop_uebereinstimmung === null ?
              null
            : (idbiotuebereinstWerte.get(n.idealbiotop_uebereinstimmung) ??
              null),
          handlungsbedarf: n.handlungsbedarf,
          flaecheUeberprueft: n.flaeche_ueberprueft,
          flaeche: n.flaeche,
          planVorhanden: n.plan_vorhanden,
          deckungVegetation: n.deckung_vegetation,
          deckungNackterBoden: n.deckung_nackter_boden,
          deckungApArt: n.deckung_ap_art,
          jungpflanzenVorhanden: n.jungpflanzen_vorhanden,
          vegetationshoeheMaximum: n.vegetationshoehe_maximum,
          vegetationshoeheMittel: n.vegetationshoehe_mittel,
          gefaehrdung: n.gefaehrdung,
          createdAt: n.created_at,
          updatedAt: n.updated_at,
          changedBy: n.changed_by,
          apberNichtRelevant: n.apber_nicht_relevant,
          apberNichtRelevantGrund: n.apber_nicht_relevant_grund,
          ekfBemerkungen: n.ekf_bemerkungen,
          zaehlungen: (zaehlsByKontr.get(n.id) ?? [])
            .map(
              (z) =>
                `Einheit: ${z.einheit === null ? '(keine)' : (einheitWerte.get(z.einheit) ?? '(keine)')}, Methode: ${z.methode === null ? '(keine)' : (methodeWerte.get(z.methode) ?? '(keine)')}, Anzahl: ${z.anzahl ?? '(keine)'}`,
            )
            .join(' / '),
          _artname: apBy?.ae_taxonomy_by_art_id?.artname ?? '',
        }
      })
      // former orderBy [AP_NAME_ASC, POP_NR_ASC, TPOP_BY_TPOP_ID__NR_ASC, DATUM_ASC]
      .sort(
        (a, b) =>
          a._artname.localeCompare(b._artname) ||
          (a.popNr ?? 0) - (b.popNr ?? 0) ||
          (a.tpopNr ?? 0) - (b.tpopNr ?? 0) ||
          (a.datum ?? '').localeCompare(b.datum ?? ''),
      )
      .map(({ _artname, ...rest }) => rest)
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
      fileName: 'Kontrollen',
    })
    setQueryState(undefined)
  }

  return (
    <Button
      className={styles.button}
      color="inherit"
      disabled={!!queryState}
      onClick={() => void onClickKontrollen()}
    >
      {filtered ? 'Kontrollen (gefiltert)' : 'Kontrollen'}
      {queryState ?
        <span className={styles.progress}>{queryState}</span>
      : null}
    </Button>
  )
}
