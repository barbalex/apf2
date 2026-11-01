/**
 * shared lookup for exports: the "ap context" most export rows embed
 * (artname, bearbeitung/umsetzung texts, startjahr), fetched once per
 * export click via /v_ap and mapped client-side
 */
import { apiFetch } from './api.ts'

export interface ApContextRow {
  id: string
  startJahr: number | null
  aeTaxonomyByArtId: { artname: string | null } | null
  apBearbstandWerteByBearbeitung: { text: string | null } | null
  apUmsetzungWerteByUmsetzung: { text: string | null } | null
}

export const fetchApContext = async (
  apIds: string[],
): Promise<Map<string, ApContextRow>> => {
  const uniqueIds = [...new Set(apIds.filter(Boolean))]
  if (!uniqueIds.length) return new Map()
  const rows = await apiFetch<ApContextRow[]>(
    `/v_ap?id=in.(${uniqueIds.join(',')})&select=id,startJahr:start_jahr,aeTaxonomyByArtId:ae_taxonomy_by_art_id,apBearbstandWerteByBearbeitung:ap_bearbstand_werte_by_bearbeitung,apUmsetzungWerteByUmsetzung:ap_umsetzung_werte_by_umsetzung`,
  )
  return new Map((rows ?? []).map((r) => [r.id, r]))
}
