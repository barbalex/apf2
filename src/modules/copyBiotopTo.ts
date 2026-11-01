import { apiFetch, apiUpdateByVariables } from './api.ts'

import { store, copyingBiotopAtom } from '../store/index.ts'

export const copyBiotopTo = async ({ id }: { id: string }) => {
  const copyingBiotop = store.get(copyingBiotopAtom)
  // fetch previous id from copyingBiotop
  const previousId = copyingBiotop.id
  const kontrs = await apiFetch<
    {
      flaeche: number | null
      lr_delarze: string | null
      lr_umgebung_delarze: string | null
      vegetationstyp: string | null
      konkurrenz: string | null
      moosschicht: string | null
      krautschicht: string | null
      strauchschicht: string | null
      baumschicht: string | null
      handlungsbedarf: string | null
      idealbiotop_uebereinstimmung: number | null
    }[]
  >(
    `/q_tpopkontr?id=eq.${previousId}&select=flaeche,lr_delarze,lr_umgebung_delarze,vegetationstyp,konkurrenz,moosschicht,krautschicht,strauchschicht,baumschicht,handlungsbedarf,idealbiotop_uebereinstimmung`,
  )
  const from = kontrs?.[0]
  await apiUpdateByVariables('tpopkontr', {
    id,
    flaeche: from?.flaeche ?? null,
    lrDelarze: from?.lr_delarze ?? null,
    lrUmgebungDelarze: from?.lr_umgebung_delarze ?? null,
    vegetationstyp: from?.vegetationstyp ?? null,
    konkurrenz: from?.konkurrenz ?? null,
    moosschicht: from?.moosschicht ?? null,
    krautschicht: from?.krautschicht ?? null,
    strauchschicht: from?.strauchschicht ?? null,
    baumschicht: from?.baumschicht ?? null,
    handlungsbedarf: from?.handlungsbedarf ?? null,
    idealbiotopUebereinstimmung: from?.idealbiotop_uebereinstimmung ?? null,
  })
}
