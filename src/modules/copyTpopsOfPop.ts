import { apiFetch } from './api.ts'

import { copyTo } from './copyTo/index.ts'

export const copyTpopsOfPop = async ({
  popIdFrom,
  popIdTo,
}: {
  popIdFrom: string
  popIdTo: string | null | undefined
}) => {
  // 1. fetch all tpops
  const tpops = await apiFetch<{ id: string }[]>(
    `/q_tpop?pop_id=eq.${popIdFrom}&select=id`,
  )

  // 2. add tpops to new pop
  ;(tpops ?? []).forEach(
    (tpop) =>
      void copyTo({
        parentId: popIdTo ?? undefined,
        table: 'tpop',
        id: tpop.id,
      }),
  )
}
