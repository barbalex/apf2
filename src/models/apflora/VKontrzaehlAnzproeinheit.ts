import type { ApId } from './Ap.ts';
import type { PopId } from './Pop.ts';
import type { TpopId } from './Tpop.ts';
import type { EkfrequenzId } from './Ekfrequenz.ts';
import type { TpopkontrId } from './Tpopkontr.ts';
import type { TpopkontrzaehlId } from './Tpopkontrzaehl.ts';

/** Represents the view apflora.v_kontrzaehl_anzproeinheit */
export default interface VKontrzaehlAnzproeinheit {
  ap_id: ApId;

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

  tpop_id: TpopId;

  tpop_nr: number | null;

  tpop_gemeinde: string | null;

  tpop_flurname: string | null;

  tpop_status: string | null;

  tpop_bekannt_seit: number | null;

  tpop_status_unklar: boolean | null;

  tpop_status_unklar_grund: string | null;

  tpop_x: number;

  tpop_y: number;

  tpop_radius: number | null;

  tpop_hoehe: number | null;

  tpop_exposition: string | null;

  tpop_klima: string | null;

  tpop_neigung: string | null;

  tpop_boden_typ: string | null;

  tpop_boden_kalkgehalt: string | null;

  tpop_boden_durchlaessigkeit: string | null;

  tpop_boden_humus: string | null;

  tpop_boden_naehrstoffgehalt: string | null;

  tpop_boden_abtrag: string | null;

  tpop_wasserhaushalt: string | null;

  tpop_beschreibung: string | null;

  tpop_kataster_nr: string | null;

  tpop_apber_relevant: boolean | null;

  tpop_apber_relevant_grund: number | null;

  tpop_eigentuemer: string | null;

  tpop_kontakt: string | null;

  tpop_nutzungszone: string | null;

  tpop_bewirtschafter: string | null;

  tpop_bewirtschaftung: string | null;

  tpop_ekfrequenz: EkfrequenzId | null;

  tpop_ekfrequenz_abweichend: boolean | null;

  kontr_id: TpopkontrId;

  kontr_jahr: number | null;

  kontr_datum: string | null;

  kontr_typ: string | null;

  kontr_bearbeiter: string | null;

  kontr_ueberlebensrate: number | null;

  kontr_vitalitaet: string | null;

  kontr_entwicklung: string | null;

  kontr_ursachen: string | null;

  kontr_erfolgsbeurteilung: string | null;

  kontr_umsetzung_aendern: string | null;

  kontr_kontrolle_aendern: string | null;

  kontr_bemerkungen: string | null;

  kontr_lr_delarze: string | null;

  kontr_lr_umgebung_delarze: string | null;

  kontr_vegetationstyp: string | null;

  kontr_konkurrenz: string | null;

  kontr_moosschicht: string | null;

  kontr_krautschicht: string | null;

  kontr_strauchschicht: string | null;

  kontr_baumschicht: string | null;

  kontr_idealbiotop_uebereinstimmung: string | null;

  kontr_handlungsbedarf: string | null;

  kontr_flaeche_ueberprueft: number | null;

  kontr_flaeche: number | null;

  kontr_plan_vorhanden: boolean | null;

  kontr_deckung_vegetation: number | null;

  kontr_deckung_nackter_boden: number | null;

  kontr_deckung_ap_art: number | null;

  kontr_jungpflanzen_vorhanden: boolean | null;

  kontr_vegetationshoehe_maximum: number | null;

  kontr_vegetationshoehe_mittel: number | null;

  kontr_gefaehrdung: string | null;

  kontr_created_at: string;

  kontr_updated_at: string;

  kontr_changed_by: string | null;

  kontr_apber_nicht_relevant: boolean | null;

  kontr_apber_nicht_relevant_grund: string | null;

  kontr_ekf_bemerkungen: string | null;

  id: TpopkontrzaehlId;

  einheit: string | null;

  methode: string | null;

  anzahl: number | null;
}