/**
 * 1. load all data
 * 2. add activeNodeArrays for all data to openNodes
 * 3. update openNodes
 * 4. refresh tree
 */
import { groupBy } from 'es-toolkit'

import { apiFetch } from '../../../../../modules/api.ts'
import { store, treeAddOpenNodesAtom } from '../../../../../store/index.ts'

interface ZielFolderParams {
  id?: string | null | undefined
  projId?: string | null | undefined
}

export const zielFolder = async ({
  id,
  projId = '99999999-9999-9999-9999-999999999999',
}: ZielFolderParams) => {
  // 1. load all data
  const ziels =
    (await apiFetch<{ id: string; jahr: number | null }[]>(
      `/q_ziel?ap_id=eq.${id}&select=id,jahr`,
    )) ?? []
  const zielsGrouped = groupBy(ziels, (e) => e.jahr ?? 0)

  // 2. add activeNodeArrays for all data to openNodes
  let newOpenNodes: (string | number | null | undefined)[][] = [
    ['Projekte', projId, 'Arten', id, 'AP-Ziele'],
  ]

  Object.keys(zielsGrouped).forEach((jahr) => {
    newOpenNodes = [
      ...newOpenNodes,
      ['Projekte', projId, 'Arten', id, 'AP-Ziele', +jahr],
    ]
    const ziels = zielsGrouped[+jahr]
    ziels?.forEach((ziel) => {
      newOpenNodes = [
        ...newOpenNodes,
        ['Projekte', projId, 'Arten', id, 'AP-Ziele', +jahr, ziel.id],
        [
          'Projekte',
          projId,
          'Arten',
          id,
          'AP-Ziele',
          +jahr,
          ziel.id,
          'Berichte',
        ],
      ]
    })
  })

  // 3. update openNodes
  store.set(treeAddOpenNodesAtom, newOpenNodes as (string | number)[][])
}
