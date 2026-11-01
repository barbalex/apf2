import type { ApId } from './Ap.ts';
import type { PopId } from './Pop.ts';
import type { TpopId } from './Tpop.ts';
import type { TpopmassnId } from './Tpopmassn.ts';

/** Represents the view apflora.v_massn_webgisbun */
export default interface VMassnWebgisbun {
  APARTID: ApId;

  APART: string | null;

  POPGUID: PopId;

  POPNR: number | null;

  TPOPGUID: TpopId;

  TPOPNR: number | null;

  TPOP_X: number;

  TPOP_Y: number;

  TPOP_WGS84LAT: number;

  TPOP_WGS84LONG: number;

  TPop_apber_relevant: boolean | null;

  TPop_apber_relevant_grund: string | null;

  TPOPSTATUS: string | null;

  MASSNGUID: TpopmassnId;

  MASSNJAHR: number | null;

  MASSNDAT: string;

  MASSTYP: string | null;

  MASSNMASSNAHME: string | null;

  MASSNBEARBEITER: string | null;

  MASSNBEMERKUNG: string;

  MASSNPLAN: boolean | null;

  MASSPLANBEZ: string | null;

  MASSNFLAECHE: number | null;

  MASSNFORMANSIEDL: string | null;

  MASSNPFLANZANORDNUNG: string | null;

  MASSNMARKIERUNG: string | null;

  MASSNANZTRIEBE: number | null;

  MASSNANZPFLANZEN: number | null;

  MASSNANZPFLANZSTELLEN: number | null;

  MASSNZIELEINHEITEINHEIT: string | null;

  MASSNZIELEINHEITANZAHL: number | null;

  MASSNWIRTSPFLANZEN: string | null;

  MASSNHERKUNFTSPOP: string | null;

  MASSNSAMMELDAT: string | null;

  MASSNVONANZAHLINDIVIDUEN: number | null;

  MASSNCHANGEDAT: string;

  MASSNCHANGEBY: string | null;
}