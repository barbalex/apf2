import { apiFetch } from './api.ts'

import { copyTo } from './copyTo/index.ts'

export const copyZaehlOfTpopKontr = async ({
  tpopkontrIdFrom,
  tpopkontrIdTo,
}: {
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
        parentId: tpopkontrIdTo ?? undefined,
        table: 'tpopkontrzaehl',
        id: zaehl.id,
      }),
  )
}
