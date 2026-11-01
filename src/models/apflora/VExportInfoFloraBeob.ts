import type { TpopkontrId } from './Tpopkontr.ts';

/** Represents the view apflora.v_export_info_flora_beob */
export default interface VExportInfoFloraBeob {
  id_projektintern: TpopkontrId;

  taxonomie_id: number | null;

  taxonomie: string | null;

  artname: string | null;

  beobachtungstyp: string;

  beobachtungstyp_codiert: string;

  herkunft: string;

  herkunft_codiert: string;

  status: string | null;

  bekannt_seit: number | null;

  datum: string;

  jahr: number | null;

  monat: number;

  tag: number;

  genauigkeit_datum: string;

  genauigkeit_datum_codiert: string;

  praesenz: string;

  praesenz_codiert: string;

  gefaehrdung: string | null;

  vitalitaet: string | null;

  beschreibung: string | null;

  lebensraum_nach_delarze: string | null;

  umgebung_nach_delarze: string | null;

  deckung_moosschicht: string | null;

  deckung_krautschicht: string | null;

  deckung_strauchschicht: string | null;

  deckung_baumschicht: string | null;

  genauigkeit_lage: string;

  genauigkeit_lage_codiert: string;

  geometry_type: string;

  genauigkeit_hoehe: string;

  x: number;

  y: number;

  gemeinde: string | null;

  flurname: string | null;

  obergrenze_hoehe: number;

  zaehlungen: string;

  expertise_introduit: string;

  expertise_introduite_nom: string;

  projekt: string;

  autor: string | null;

  aktionsplan: string;
}