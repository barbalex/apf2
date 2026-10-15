import { useAtomValue, useSetAtom } from 'jotai'
import { useParams, useLocation } from 'react-router'
import { useQueryClient } from '@tanstack/react-query'
import { uniq, isEqual, upperFirst } from 'es-toolkit'

import {
  addNotificationAtom,
  treeOpenNodesAtom,
  treeSetOpenNodesAtom,
  setCopyingAtom,
  setCopyingBiotopAtom,
  setMovingAtom,
  setToDeleteAtom,
  setIdOfTpopBeingLocalizedAtom,
  mapActiveApfloraLayersAtom,
  setMapActiveApfloraLayersAtom,
  newTpopFromBeobDialogOpenAtom,
  newTpopFromBeobBeobIdAtom,
  setOpenChooseApToCopyEkfrequenzsFromAtom,
  setOpenChooseApToCopyErfkritsFromAtom,
} from '../../../../store/index.ts'
import { copyBiotopTo } from '../../../../modules/copyBiotopTo.ts'
import { moveTo } from '../../../../modules/moveTo/index.ts'
import { copyTo } from '../../../../modules/copyTo/index.ts'
import { createNewPopFromBeob } from '../../../../modules/createNewPopFromBeob/index.ts'
import { copyBeobZugeordnetKoordToTpop } from '../../../../modules/copyBeobZugeordnetKoordToTpop/index.ts'
import { copyTpopKoordToPop } from '../../../../modules/copyTpopKoordToPop/index.ts'
import { openLowerNodes } from '../openLowerNodes/index.ts'
import { closeLowerNodes } from '../closeLowerNodes.ts'
import { insertDataset } from '../insertDataset.ts'
import { useProjekteTabs } from '../../../../modules/useProjekteTabs.ts'
import { showCoordOfBeobOnMapsZhCh } from '../../../../modules/showCoordOfBeobOnMapsZhCh.ts'
import { showCoordOfBeobOnMapGeoAdminCh } from '../../../../modules/showCoordOfBeobOnMapGeoAdminCh.ts'
import { showCoordOfTpopOnMapsZhCh } from '../../../../modules/showCoordOfTpopOnMapsZhCh.ts'
import { showCoordOfTpopOnMapGeoAdminCh } from '../../../../modules/showCoordOfTpopOnMapGeoAdminCh.ts'
import type { TreeNodeData } from '../Tree/types.ts'

import type { TreeMenuItem } from './menuConfig.tsx'

/**
 * returns a function running a menu item's action for the node the menu
 * was opened on. Successor of the handleClick in the former Menus.tsx,
 * which read the node's data from data-* attributes on the row.
 */
export const useRunMenuAction = () => {
  const addNotification = useSetAtom(addNotificationAtom)
  const params = useParams()
  const { projId, apId, popId } = params
  const { search } = useLocation()

  const openNodes = useAtomValue(treeOpenNodesAtom)
  const setOpenNodes = useSetAtom(treeSetOpenNodesAtom)

  const tsQueryClient = useQueryClient()

  const activeApfloraLayers = useAtomValue(mapActiveApfloraLayersAtom)
  const setActiveApfloraLayers = useSetAtom(setMapActiveApfloraLayersAtom)
  const setCopying = useSetAtom(setCopyingAtom)
  const setMoving = useSetAtom(setMovingAtom)
  const setCopyingBiotop = useSetAtom(setCopyingBiotopAtom)
  const setToDelete = useSetAtom(setToDeleteAtom)
  const setIdOfTpopBeingLocalized = useSetAtom(setIdOfTpopBeingLocalizedAtom)
  const setNewTpopFromBeobBeobId = useSetAtom(newTpopFromBeobBeobIdAtom)
  const setNewTpopFromBeobDialogOpen = useSetAtom(newTpopFromBeobDialogOpenAtom)
  const setOpenChooseApToCopyEkfrequenzsFrom = useSetAtom(
    setOpenChooseApToCopyEkfrequenzsFromAtom,
  )
  const setOpenChooseApToCopyErfkritsFrom = useSetAtom(
    setOpenChooseApToCopyErfkritsFromAtom,
  )

  const [projekteTabs, setProjekteTabs] = useProjekteTabs()
  const showMapIfNotYetVisible = (projekteTabs: string[]) => {
    const isVisible = projekteTabs.includes('karte')
    if (!isVisible) {
      setProjekteTabs([...projekteTabs, 'karte'])
    }
  }

  return (item: TreeMenuItem, node: TreeNodeData) => {
    const { action, table, actionTable } = item
    // as the former implementation read them from the row's data-* attributes
    const id = String((node.tableId || node.id) ?? '')
    // treeParentTableId/parentId are never set at runtime but typed number-
    // capable; the former implementation always passed a string or null
    const parentId = ((node.treeParentTableId || node.parentId) ??
      null) as string | null
    const url = node.url
    const label = node.label
    const nodeType = node.nodeType ?? null
    const menuType = node.menuType
    const singleElementName = node.singleElementName ?? null
    const jahr = node.jahr === undefined ? null : String(node.jahr)

    const actions: Record<string, () => void> = {
      insert() {
        const urlForInsert = [...url]
        // when inserting on same level, remove last url element
        if (nodeType === 'table') {
          urlForInsert.pop()
        }
        if (menuType === 'zielFolder') {
          // db sets year 1 as standard
          urlForInsert.push(1)
        }
        void insertDataset({
          tablePassed: table ?? '',
          parentId: parentId || id,
          url: urlForInsert,
          menuType,
          singleElementUrlName: singleElementName,
          search,
          jahr,
        })
      },
      openLowerNodes() {
        openLowerNodes({
          id,
          parentId,
          apId,
          projId,
          popId,
          menuType,
          jahr,
        })
      },
      closeLowerNodes() {
        void closeLowerNodes({
          url,
          search,
        })
      },
      delete() {
        setToDelete({
          table: table ?? null,
          id,
          label,
          url,
          afterDeletionHook: () => {
            const newOpenNodes = openNodes.filter((n) => !isEqual(n, url))
            setOpenNodes(newOpenNodes)
            void tsQueryClient.invalidateQueries({
              queryKey: [`tree${upperFirst(table ?? '')}`],
            })
            // also invalidate parent queries for folder counts
            void tsQueryClient.invalidateQueries({
              queryKey: [`treeApFolders`],
            })
            void tsQueryClient.invalidateQueries({
              queryKey: [`treeAp`],
            })
          },
        })
      },
      showBeobOnMap() {
        // 1. open map if not yet open
        showMapIfNotYetVisible(projekteTabs)
        // 2 add layer for actionTable
        if (activeApfloraLayers.includes(actionTable ?? '')) {
          setActiveApfloraLayers(
            activeApfloraLayers.filter((o) => o !== actionTable),
          )
        } else {
          setActiveApfloraLayers([...activeApfloraLayers, actionTable ?? ''])
        }
      },
      localizeOnMap() {
        setIdOfTpopBeingLocalized(id)
        showMapIfNotYetVisible(projekteTabs)
        setActiveApfloraLayers(uniq([...activeApfloraLayers, 'tpop']))
      },
      markForMoving() {
        setMoving({
          table,
          id,
          label,
          toTable: actionTable,
          fromParentId: apId,
        })
      },
      move() {
        void moveTo({
          id,
        })
      },
      markForCopying() {
        setCopying({ table, id, label, withNextLevel: false })
      },
      markForCopyingWithNextLevel() {
        setCopying({ table, id, label, withNextLevel: true })
      },
      resetCopying() {
        setCopying({
          table: null,
          id: '99999999-9999-9999-9999-999999999999',
          label: null,
          withNextLevel: false,
        })
      },
      copy() {
        // issue: tpop-folder passes no parentId
        void copyTo({
          parentId: nodeType === 'folder' ? (parentId ?? id) : id,
        })
      },
      markForCopyingBiotop() {
        setCopyingBiotop({ id, label })
      },
      resetCopyingBiotop() {
        setCopyingBiotop({ id: null, label: null })
      },
      copyBiotop() {
        void copyBiotopTo({ id })
      },
      copyTpopKoordToPop() {
        void copyTpopKoordToPop({ id })
      },
      createNewPopFromBeob() {
        void createNewPopFromBeob({
          id,
          apId,
          projId,
          search,
        })
      },
      createNewTpopFromBeob() {
        setNewTpopFromBeobBeobId(id)
        setNewTpopFromBeobDialogOpen(true)
      },
      copyBeobZugeordnetKoordToTpop() {
        void copyBeobZugeordnetKoordToTpop({ id })
      },
      openChooseApToCopyEkfrequenzsFrom() {
        setOpenChooseApToCopyEkfrequenzsFrom(true)
      },
      openChooseApToCopyErfkritsFrom() {
        setOpenChooseApToCopyErfkritsFrom(true)
      },
      showCoordOfTpopOnMapsZhCh() {
        void showCoordOfTpopOnMapsZhCh({
          id,
        })
      },
      showCoordOfTpopOnMapGeoAdminCh() {
        void showCoordOfTpopOnMapGeoAdminCh({
          id,
        })
      },
      showCoordOfBeobOnMapsZhCh() {
        void showCoordOfBeobOnMapsZhCh({
          id,
        })
      },
      showCoordOfBeobOnMapGeoAdminCh() {
        void showCoordOfBeobOnMapGeoAdminCh({
          id,
        })
      },
    }
    const actionFunction = actions[action]
    if (actionFunction) {
      actionFunction()
    } else {
      addNotification({
        message: `action "${action}" unknown, therefore not executed`,
        options: {
          variant: 'error',
        },
      })
    }
  }
}
