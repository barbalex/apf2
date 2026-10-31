import { useState } from 'react'
import { useSetAtom } from 'jotai'
import { sortBy } from 'es-toolkit'
import Button from '@mui/material/Button'

import { apiFetch } from '../../../../modules/api.ts'
import { exportModule } from '../../../../modules/export.ts'


import styles from '../index.module.css'
import wollmilchsauStyles from './Wollmilchsau.module.css'

import { addNotificationAtom } from '../../../../store/index.ts'

export const Wollmilchsau = () => {
  const addNotification = useSetAtom(addNotificationAtom)
  const [queryState, setQueryState] = useState<string | undefined>()

  const onClickWollmilchsau = async () => {
    setQueryState('lade Daten...')
    let nodes: Record<string, unknown>[] = []
    try {
      nodes =
        (await apiFetch<Record<string, unknown>[]>(
          `/v_tpop_erste_und_letzte_kontrolle_und_letzter_tpopber?select=*`,
        )) ?? []
    } catch (error) {
      addNotification({
        message: (error as Error).message,
        options: {
          variant: 'error',
        },
      })
    }
    setQueryState('verarbeite...')
    const rows = nodes.map((z) => ({
      ap_id: z['ap_id'] ?? '',
      familie: z['familie'] ?? '',
      artname: z['artname'] ?? '',
      ap_bearbeitung: z['ap_bearbeitung'] ?? '',
      ap_start_jahr: z['ap_start_jahr'] ?? '',
      ap_umsetzung: z['ap_umsetzung'] ?? '',
      pop_id: z['pop_id'] ?? '',
      pop_nr: z['pop_nr'] ?? '',
      pop_name: z['pop_name'] ?? '',
      pop_status: z['pop_status'] ?? '',
      pop_bekannt_seit: z['pop_bekannt_seit'] ?? '',
      pop_status_unklar: z['pop_status_unklar'] ?? '',
      pop_status_unklar_begruendung: z['pop_status_unklar_begruendung'] ?? '',
      pop_x: z['pop_x'] ?? '',
      pop_y: z['pop_y'] ?? '',
      id: z['id'] ?? '',
      nr: z['nr'] ?? '',
      gemeinde: z['gemeinde'] ?? '',
      flurname: z['flurname'] ?? '',
      status: z['status'] ?? '',
      status_decodiert: z['status_decodiert'] ?? '',
      bekannt_seit: z['bekannt_seit'] ?? '',
      status_unklar: z['status_unklar'] ?? '',
      status_unklar_grund: z['status_unklar_grund'] ?? '',
      lv95X: z['x'] ?? '',
      lv95Y: z['y'] ?? '',
      radius: z['radius'] ?? '',
      hoehe: z['hoehe'] ?? '',
      exposition: z['exposition'] ?? '',
      klima: z['klima'] ?? '',
      neigung: z['neigung'] ?? '',
      beschreibung: z['beschreibung'] ?? '',
      kataster_nr: z['kataster_nr'] ?? '',
      apber_relevant: z['apber_relevant'] ?? '',
      apber_relevant_grund: z['apber_relevant_grund'] ?? '',
      eigentuemer: z['eigentuemer'] ?? '',
      kontakt: z['kontakt'] ?? '',
      nutzungszone: z['nutzungszone'] ?? '',
      bewirtschafter: z['bewirtschafter'] ?? '',
      bewirtschaftung: z['bewirtschaftung'] ?? '',
      ekfrequenz: z['ekfrequenz'] ?? '',
      ekfrequenz_abweichend: z['ekfrequenz_abweichend'] ?? '',
      created_at: z['created_at'] ?? '',
      updated_at: z['updated_at'] ?? '',
      changed_by: z['changed_by'] ?? '',
      anzahl_kontrollen: z['anzahl_kontrollen'] ?? '',
      erste_kontrolle_id: z['erste_kontrolle_id'] ?? '',
      erste_kontrolle_jahr: z['erste_kontrolle_jahr'] ?? '',
      erste_kontrolle_datum: z['erste_kontrolle_datum'] ?? '',
      erste_kontrolle_typ: z['erste_kontrolle_typ'] ?? '',
      erste_kontrolle_bearbeiter: z['erste_kontrolle_bearbeiter'] ?? '',
      erste_kontrolle_ueberlebensrate:
        z['erste_kontrolle_ueberlebensrate'] ?? '',
      erste_kontrolle_vitalitaet: z['erste_kontrolle_vitalitaet'] ?? '',
      erste_kontrolle_entwicklung: z['erste_kontrolle_entwicklung'] ?? '',
      erste_kontrolle_ursachen: z['erste_kontrolle_ursachen'] ?? '',
      erste_kontrolle_erfolgsbeurteilung:
        z['erste_kontrolle_erfolgsbeurteilung'] ?? '',
      erste_kontrolle_umsetzung_aendern:
        z['erste_kontrolle_umsetzung_aendern'] ?? '',
      erste_kontrolle_kontrolle_aendern:
        z['erste_kontrolle_kontrolle_aendern'] ?? '',
      erste_kontrolle_bemerkungen: z['erste_kontrolle_bemerkungen'] ?? '',
      erste_kontrolle_lr_delarze: z['erste_kontrolle_lr_delarze'] ?? '',
      erste_kontrolle_lr_umgebung_delarze:
        z['erste_kontrolle_lr_umgebung_delarze'] ?? '',
      erste_kontrolle_vegetationstyp: z['erste_kontrolle_vegetationstyp'] ?? '',
      erste_kontrolle_konkurrenz: z['erste_kontrolle_konkurrenz'] ?? '',
      erste_kontrolle_moosschicht: z['erste_kontrolle_moosschicht'] ?? '',
      erste_kontrolle_krautschicht: z['erste_kontrolle_krautschicht'] ?? '',
      erste_kontrolle_strauchschicht: z['erste_kontrolle_strauchschicht'] ?? '',
      erste_kontrolle_baumschicht: z['erste_kontrolle_baumschicht'] ?? '',
      erste_kontrolle_idealbiotop_uebereinstimmung:
        z['erste_kontrolle_idealbiotop_uebereinstimmung'] ?? '',
      erste_kontrolle_handlungsbedarf:
        z['erste_kontrolle_handlungsbedarf'] ?? '',
      erste_kontrolle_flaeche_ueberprueft:
        z['erste_kontrolle_flaeche_ueberprueft'] ?? '',
      erste_kontrolle_flaeche: z['erste_kontrolle_flaeche'] ?? '',
      erste_kontrolle_plan_vorhanden: z['erste_kontrolle_plan_vorhanden'] ?? '',
      erste_kontrolle_deckung_vegetation:
        z['erste_kontrolle_deckung_vegetation'] ?? '',
      erste_kontrolle_deckung_nackter_boden:
        z['erste_kontrolle_deckung_nackter_boden'] ?? '',
      erste_kontrolle_deckung_ap_art: z['erste_kontrolle_deckung_ap_art'] ?? '',
      erste_kontrolle_jungpflanzen_vorhanden:
        z['erste_kontrolle_jungpflanzen_vorhanden'] ?? '',
      erste_kontrolle_vegetationshoehe_maximum:
        z['erste_kontrolle_vegetationshoehe_maximum'] ?? '',
      erste_kontrolle_vegetationshoehe_mittel:
        z['erste_kontrolle_vegetationshoehe_mittel'] ?? '',
      erste_kontrolle_gefaehrdung: z['erste_kontrolle_gefaehrdung'] ?? '',
      erste_kontrolle_created_at: z['erste_kontrolle_created_at'] ?? '',
      erste_kontrolle_updated_at: z['erste_kontrolle_updated_at'] ?? '',
      erste_kontrolle_changed_by: z['erste_kontrolle_changed_by'] ?? '',
      erste_kontrolle_apber_nicht_relevant:
        z['erste_kontrolle_apber_nicht_relevant'] ?? '',
      erste_kontrolle_apber_nicht_relevant_grund:
        z['erste_kontrolle_apber_nicht_relevant_grund'] ?? '',
      erste_kontrolle_ekf_bemerkungen:
        z['erste_kontrolle_ekf_bemerkungen'] ?? '',
      erste_kontrolle_zaehlung_anzahlen:
        z['erste_kontrolle_zaehlung_anzahlen'] ?? '',
      erste_kontrolle_zaehlung_einheiten:
        z['erste_kontrolle_zaehlung_einheiten'] ?? '',
      erste_kontrolle_zaehlung_methoden:
        z['erste_kontrolle_zaehlung_methoden'] ?? '',
      letzte_kontrolle_id: z['letzte_kontrolle_id'] ?? '',
      letzte_kontrolle_jahr: z['letzte_kontrolle_jahr'] ?? '',
      letzte_kontrolle_datum: z['letzte_kontrolle_datum'] ?? '',
      letzte_kontrolle_typ: z['letzte_kontrolle_typ'] ?? '',
      letzte_kontrolle_bearbeiter: z['letzte_kontrolle_bearbeiter'] ?? '',
      letzte_kontrolle_ueberlebensrate:
        z['letzte_kontrolle_ueberlebensrate'] ?? '',
      letzte_kontrolle_vitalitaet: z['letzte_kontrolle_vitalitaet'] ?? '',
      letzte_kontrolle_entwicklung: z['letzte_kontrolle_entwicklung'] ?? '',
      letzte_kontrolle_ursachen: z['letzte_kontrolle_ursachen'] ?? '',
      letzte_kontrolle_erfolgsbeurteilung:
        z['letzte_kontrolle_erfolgsbeurteilung'] ?? '',
      letzte_kontrolle_umsetzung_aendern:
        z['letzte_kontrolle_umsetzung_aendern'] ?? '',
      letzte_kontrolle_kontrolle_aendern:
        z['letzte_kontrolle_kontrolle_aendern'] ?? '',
      letzte_kontrolle_bemerkungen: z['letzte_kontrolle_bemerkungen'] ?? '',
      letzte_kontrolle_lr_delarze: z['letzte_kontrolle_lr_delarze'] ?? '',
      letzte_kontrolle_lr_umgebung_delarze:
        z['letzte_kontrolle_lr_umgebung_delarze'] ?? '',
      letzte_kontrolle_vegetationstyp:
        z['letzte_kontrolle_vegetationstyp'] ?? '',
      letzte_kontrolle_konkurrenz: z['letzte_kontrolle_konkurrenz'] ?? '',
      letzte_kontrolle_moosschicht: z['letzte_kontrolle_moosschicht'] ?? '',
      letzte_kontrolle_krautschicht: z['letzte_kontrolle_krautschicht'] ?? '',
      letzte_kontrolle_strauchschicht:
        z['letzte_kontrolle_strauchschicht'] ?? '',
      letzte_kontrolle_baumschicht: z['letzte_kontrolle_baumschicht'] ?? '',
      letzte_kontrolle_idealbiotop_uebereinstimmung:
        z['letzte_kontrolle_idealbiotop_uebereinstimmung'] ?? '',
      letzte_kontrolle_handlungsbedarf:
        z['letzte_kontrolle_handlungsbedarf'] ?? '',
      letzte_kontrolle_flaeche_ueberprueft:
        z['letzte_kontrolle_flaeche_ueberprueft'] ?? '',
      letzte_kontrolle_flaeche: z['letzte_kontrolle_flaeche'] ?? '',
      letzte_kontrolle_plan_vorhanden:
        z['letzte_kontrolle_plan_vorhanden'] ?? '',
      letzte_kontrolle_deckung_vegetation:
        z['letzte_kontrolle_deckung_vegetation'] ?? '',
      letzte_kontrolle_deckung_nackter_boden:
        z['letzte_kontrolle_deckung_nackter_boden'] ?? '',
      letzte_kontrolle_deckung_ap_art:
        z['letzte_kontrolle_deckung_ap_art'] ?? '',
      letzte_kontrolle_jungpflanzen_vorhanden:
        z['letzte_kontrolle_jungpflanzen_vorhanden'] ?? '',
      letzte_kontrolle_vegetationshoehe_maximum:
        z['letzte_kontrolle_vegetationshoehe_maximum'] ?? '',
      letzte_kontrolle_vegetationshoehe_mittel:
        z['letzte_kontrolle_vegetationshoehe_mittel'] ?? '',
      letzte_kontrolle_gefaehrdung: z['letzte_kontrolle_gefaehrdung'] ?? '',
      letzte_kontrolle_changed: z['letzte_kontrolle_changed'] ?? '',
      letzte_kontrolle_changed_by: z['letzte_kontrolle_changed_by'] ?? '',
      letzte_kontrolle_apber_nicht_relevant:
        z['letzte_kontrolle_apber_nicht_relevant'] ?? '',
      letzte_kontrolle_apber_nicht_relevant_grund:
        z['letzte_kontrolle_apber_nicht_relevant_grund'] ?? '',
      letzte_kontrolle_ekf_bemerkungen:
        z['letzte_kontrolle_ekf_bemerkungen'] ?? '',
      letzte_kontrolle_zaehlung_anzahlen:
        z['letzte_kontrolle_zaehlung_anzahlen'] ?? '',
      letzte_kontrolle_zaehlung_einheiten:
        z['letzte_kontrolle_zaehlung_einheiten'] ?? '',
      letzte_kontrolle_zaehlung_methoden:
        z['letzte_kontrolle_zaehlung_methoden'] ?? '',
      tpopber_anz: z['tpopber_anz'] ?? '',
      tpopber_id: z['tpopber_id'] ?? '',
      tpopber_jahr: z['tpopber_jahr'] ?? '',
      tpopber_entwicklung: z['tpopber_entwicklung'] ?? '',
      tpopber_bemerkungen: z['tpopber_bemerkungen'] ?? '',
      tpopber_created_at: z['tpopber_created_at'] ?? '',
      tpopber_updated_at: z['tpopber_updated_at'] ?? '',
      tpopber_changed_by: z['tpopber_changed_by'] ?? '',
    }))
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
      data: sortBy(rows, ['artname', 'pop_nr', 'nr']),
      fileName:
        'TeilpopulationenAnzKontrInklusiveLetzteKontrUndLetztenTPopBericht',
    })
    setQueryState(undefined)
  }

  return (
    <Button
      className={styles.button}
      color="inherit"
      disabled={!!queryState}
      onClick={() => void onClickWollmilchsau()}
    >
      <div>Teilpopulationen mit:</div>
      <ul
        style={{
          paddingLeft: '18px',
          marginTop: '5px',
          marginBottom: '10px',
        }}
      >
        <li className={wollmilchsauStyles.li}>Anzahl Kontrollen</li>
        <li className={wollmilchsauStyles.li}>erste Kontrolle</li>
        <li className={wollmilchsauStyles.li}>erste Zählung</li>
        <li className={wollmilchsauStyles.li}>letzte Kontrolle</li>
        <li className={wollmilchsauStyles.li}>letzte Zählung</li>
        <li className={wollmilchsauStyles.li}>
          letzter Teilpopulationsbericht
        </li>
      </ul>
      <div className={wollmilchsauStyles.ewm}>
        {'= "Eier legende Wollmilchsau". Vorsicht: kann > 2 Minuten dauern!'}
      </div>
      {queryState ?
        <div className={wollmilchsauStyles.progress}>{queryState}</div>
      : null}
    </Button>
  )
}
