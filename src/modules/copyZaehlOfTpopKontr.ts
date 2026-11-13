import { apiFetch } from './api.ts'
import type { Store } from 'jotai'

import { copyTo } from './copyTo/index.ts'

export const copyZaehlOfTpopKontr = async ({
  store,
  tpopkontrIdFrom,
  tpopkontrIdTo,
}: {
  store: Store
  tpopkontrIdFrom: string
  tpopkontrIdTo: string | null | undefined
}) => {
  // 1. fetch all tpopkontrzaehl
  const tpopkontrzaehl = await apiFetch<{ id: string }[]>(
    `/q_tpopkontrzaehl?tpopkontr_id=eq.${tpopkontrIdFrom}&select=id`,
  )
  // 2. add tpopkontrzaehl to new tpopkontr
  ;(tpopkontrzaehl ?? []).forEach(
    (zaehl) =>
      void copyTo({
        store,
        parentId: tpopkontrIdTo ?? undefined,
        table: 'tpopkontrzaehl',
        id: zaehl.id,
      }),
  )
}
