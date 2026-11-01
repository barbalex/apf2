/**
 * 1. load all data
 * 2. add activeNodeArrays for all data to openNodes
 * 3. update openNodes
 * 4. refresh tree
 */

import { apiFetch } from '../../../../../modules/api.ts'
import { store, treeAddOpenNodesAtom } from '../../../../../store/index.ts'

interface ZieljahrFolderParams {
  parentId?: string | null | undefined
  projId?: string | null | undefined
  jahr?: string | null | undefined
  // id is passed but not used
  id?: string | null | undefined
}

export const zieljahrFolder = async ({
  parentId: apId,
  projId = '99999999-9999-9999-9999-999999999999',
  jahr: jahrString,
}: ZieljahrFolderParams) => {
  const jahr = +(jahrString as string)

  // 1. load all data
  const ziels =
    (await apiFetch<{ id: string; jahr: number | null }[]>(
      `/q_ziel?ap_id=eq.${apId}&jahr=eq.${jahr}&select=id,jahr`,
    )) ?? []

  // 2. add activeNodeArrays for all data to openNodes
  let newOpenNodes = [['Projekte', projId, 'Arten', apId, 'AP-Ziele', jahr]]

  ziels.forEach((ziel) => {
    newOpenNodes = [
      ...newOpenNodes,
      ['Projekte', projId, 'Arten', apId, 'AP-Ziele', jahr, ziel.id],
      [
        'Projekte',
        projId,
        'Arten',
        apId,
        'AP-Ziele',
        jahr,
        ziel.id,
        'Berichte',
      ],
    ]
  })

  // 3. update
  store.set(treeAddOpenNodesAtom, newOpenNodes as (string | number)[][])
}
