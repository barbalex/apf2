import type { ApId } from './Ap.ts';
import type { PopId } from './Pop.ts';
import type { TpopId } from './Tpop.ts';
import type { EkfrequenzId } from './Ekfrequenz.ts';
import type { TpopberId } from './Tpopber.ts';
import type { TpopmassnberId } from './Tpopmassnber.ts';

/** Represents the view apflora.v_tpop_popberundmassnber */
export default interface VTpopPopberundmassnber {
  ap_id: ApId;

  artname: string | null;

  ap_bearbeitung: string | null;

  ap_start_jahr: number | null;

  ap_umsetzung: string | null;

  pop_id: PopId;

  pop_nr: number | null;

  pop_name: string | null;

  pop_status: string | null;

  pop_bekannt_seit: number | null;

  pop_status_unklar: boolean | null;

  pop_status_unklar_begruendung: string | null;

  pop_x: number;

  pop_y: number;

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

  tpopber_id: TpopberId;

  tpopber_jahr: number | null;

  tpopber_entwicklung: string | null;

  tpopber_bemerkungen: string | null;

  tpopber_created_at: string;

  tpopber_updated_at: string;

  tpopber_changed_by: string | null;

  tpopmassnber_id: TpopmassnberId;

  tpopmassnber_jahr: number | null;

  tpopmassnber_entwicklung: string | null;

  tpopmassnber_bemerkungen: string | null;

  tpopmassnber_created_at: string;

  tpopmassnber_updated_at: string;

  tpopmassnber_changed_by: string | null;
}