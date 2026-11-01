import type { ApId } from './Ap.ts';
import type { PopId } from './Pop.ts';
import type { TpopId } from './Tpop.ts';
import type { TpopkontrId } from './Tpopkontr.ts';
import type { TpopberId } from './Tpopber.ts';

/**
 * Represents the view apflora.v_tpop_erste_und_letzte_kontrolle_und_letzter_tpopber
 * (id) references tpop (id)
 */
export default interface VTpopErsteUndLetzteKontrolleUndLetzterTpopber {
  ap_id: ApId | null;

  familie: string | null;

  artname: string | null;

  ap_bearbeitung: string | null;

  ap_start_jahr: number | null;

  ap_umsetzung: string | null;

  ap_bearbeiter: string | null;

  pop_id: PopId;

  pop_nr: number | null;

  pop_name: string | null;

  pop_status: string | null;

  pop_bekannt_seit: number | null;

  pop_status_unklar: boolean | null;

  pop_status_unklar_begruendung: string | null;

  pop_x: number;

  pop_y: number;

  id: TpopId;

  nr: number | null;

  gemeinde: string | null;

  flurname: string | null;

  status: number | null;

  status_decodiert: string | null;

  bekannt_seit: number | null;

  status_unklar: boolean | null;

  status_unklar_grund: string | null;

  x: number;

  y: number;

  radius: number | null;

  hoehe: number | null;

  exposition: string | null;

  klima: string | null;

  neigung: string | null;

  boden_typ: string | null;

  boden_kalkgehalt: string | null;

  boden_durchlaessigkeit: string | null;

  boden_humus: string | null;

  boden_naehrstoffgehalt: string | null;

  boden_abtrag: string | null;

  wasserhaushalt: string | null;

  beschreibung: string | null;

  kataster_nr: string | null;

  apber_relevant: boolean | null;

  apber_relevant_grund: number | null;

  eigentuemer: string | null;

  kontakt: string | null;

  nutzungszone: string | null;

  bewirtschafter: string | null;

  bewirtschaftung: string | null;

  ekfrequenz: string | null;

  ekfrequenz_abweichend: boolean | null;

  created_at: string;

  updated_at: string;

  changed_by: string | null;

  anzahl_kontrollen: string;

  letzte_kontrolle_id: TpopkontrId;

  letzte_kontrolle_jahr: number | null;

  letzte_kontrolle_datum: string | null;

  letzte_kontrolle_typ: string | null;

  letzte_kontrolle_bearbeiter: string | null;

  letzte_kontrolle_ueberlebensrate: number | null;

  letzte_kontrolle_vitalitaet: string | null;

  letzte_kontrolle_entwicklung: string | null;

  letzte_kontrolle_ursachen: string | null;

  letzte_kontrolle_erfolgsbeurteilung: string | null;

  letzte_kontrolle_umsetzung_aendern: string | null;

  letzte_kontrolle_kontrolle_aendern: string | null;

  letzte_kontrolle_bemerkungen: string | null;

  letzte_kontrolle_lr_delarze: string | null;

  letzte_kontrolle_lr_umgebung_delarze: string | null;

  letzte_kontrolle_vegetationstyp: string | null;

  letzte_kontrolle_konkurrenz: string | null;

  letzte_kontrolle_moosschicht: string | null;

  letzte_kontrolle_krautschicht: string | null;

  letzte_kontrolle_strauchschicht: string | null;

  letzte_kontrolle_baumschicht: string | null;

  letzte_kontrolle_idealbiotop_uebereinstimmung: string | null;

  letzte_kontrolle_handlungsbedarf: string | null;

  letzte_kontrolle_flaeche_ueberprueft: number | null;

  letzte_kontrolle_flaeche: number | null;

  letzte_kontrolle_plan_vorhanden: boolean | null;

  letzte_kontrolle_deckung_vegetation: number | null;

  letzte_kontrolle_deckung_nackter_boden: number | null;

  letzte_kontrolle_deckung_ap_art: number | null;

  letzte_kontrolle_jungpflanzen_vorhanden: boolean | null;

  letzte_kontrolle_vegetationshoehe_maximum: number | null;

  letzte_kontrolle_vegetationshoehe_mittel: number | null;

  letzte_kontrolle_gefaehrdung: string | null;

  letzte_kontrolle_created_at: string;

  letzte_kontrolle_updated_at: string;

  letzte_kontrolle_changed_by: string | null;

  letzte_kontrolle_apber_nicht_relevant: boolean | null;

  letzte_kontrolle_apber_nicht_relevant_grund: string | null;

  letzte_kontrolle_ekf_bemerkungen: string | null;

  letzte_kontrolle_zaehlung_anzahlen: string;

  letzte_kontrolle_zaehlung_einheiten: string;

  letzte_kontrolle_zaehlung_methoden: string;

  erste_kontrolle_id: TpopkontrId;

  erste_kontrolle_jahr: number | null;

  erste_kontrolle_datum: string | null;

  erste_kontrolle_typ: string | null;

  erste_kontrolle_bearbeiter: string | null;

  erste_kontrolle_ueberlebensrate: number | null;

  erste_kontrolle_vitalitaet: string | null;

  erste_kontrolle_entwicklung: string | null;

  erste_kontrolle_ursachen: string | null;

  erste_kontrolle_erfolgsbeurteilung: string | null;

  erste_kontrolle_umsetzung_aendern: string | null;

  erste_kontrolle_kontrolle_aendern: string | null;

  erste_kontrolle_bemerkungen: string | null;

  erste_kontrolle_lr_delarze: string | null;

  erste_kontrolle_lr_umgebung_delarze: string | null;

  erste_kontrolle_vegetationstyp: string | null;

  erste_kontrolle_konkurrenz: string | null;

  erste_kontrolle_moosschicht: string | null;

  erste_kontrolle_krautschicht: string | null;

  erste_kontrolle_strauchschicht: string | null;

  erste_kontrolle_baumschicht: string | null;

  erste_kontrolle_idealbiotop_uebereinstimmung: string | null;

  erste_kontrolle_handlungsbedarf: string | null;

  erste_kontrolle_flaeche_ueberprueft: number | null;

  erste_kontrolle_flaeche: number | null;

  erste_kontrolle_plan_vorhanden: boolean | null;

  erste_kontrolle_deckung_vegetation: number | null;

  erste_kontrolle_deckung_nackter_boden: number | null;

  erste_kontrolle_deckung_ap_art: number | null;

  erste_kontrolle_jungpflanzen_vorhanden: boolean | null;

  erste_kontrolle_vegetationshoehe_maximum: number | null;

  erste_kontrolle_vegetationshoehe_mittel: number | null;

  erste_kontrolle_gefaehrdung: string | null;

  erste_kontrolle_created_at: string;

  erste_kontrolle_updated_at: string;

  erste_kontrolle_changed_by: string | null;

  erste_kontrolle_apber_nicht_relevant: boolean | null;

  erste_kontrolle_apber_nicht_relevant_grund: string | null;

  erste_kontrolle_ekf_bemerkungen: string | null;

  erste_kontrolle_zaehlung_anzahlen: string;

  erste_kontrolle_zaehlung_einheiten: string;

  erste_kontrolle_zaehlung_methoden: string;

  tpopber_anz: string;

  tpopber_id: TpopberId;

  tpopber_jahr: number | null;

  tpopber_entwicklung: string | null;

  tpopber_bemerkungen: string | null;

  tpopber_created_at: string;

  tpopber_updated_at: string;

  tpopber_changed_by: string | null;
}