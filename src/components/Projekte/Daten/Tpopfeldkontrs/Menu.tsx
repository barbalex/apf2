import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQueryClient } from '@tanstack/react-query'
import { useParams, useNavigate, useLocation } from 'react-router'
import { FaPlus, FaFolderTree } from 'react-icons/fa6'
import { RiFolderCloseFill } from 'react-icons/ri'
import { MdOutlineMoveDown, MdContentCopy } from 'react-icons/md'
import { BsSignStopFill } from 'react-icons/bs'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { useSetAtom, useAtomValue } from 'jotai'

import { MenuBar } from '../../../shared/MenuBar/index.tsx'
import { FilterButton } from '../../../shared/MenuBar/FilterButton.tsx'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'
import { openLowerNodes } from '../../TreeContainer/openLowerNodes/index.ts'
import { closeLowerNodes } from '../../TreeContainer/closeLowerNodes.ts'
import { moveTo } from '../../../../modules/moveTo/index.ts'
import { copyTo } from '../../../../modules/copyTo/index.ts'
import {
  showTreeMenusAtom,
  addNotificationAtom,
  copyingAtom,
  setCopyingAtom,
  copyingBiotopAtom,
  setCopyingBiotopAtom,
  movingAtom,
  setMovingAtom,
  treeOpenNodesAtom,
  treeSetOpenNodesAtom,
  treeActiveNodeArrayAtom,
} from '../../../../store/index.ts'

import type {
  TpopkontrId,
  TpopId,
  TpopkontrzaehlId,
} from '../../../../generated/apflora/models.ts'

import styles from './Menu.module.css'

interface CreateTpopkontrResult {
  createTpopkontr: {
    tpopkontr: {
      id: TpopkontrId
      tpopId: TpopId
    }
  }
}

interface CreateTpopkontrzaehlResult {
  createTpopkontrzaehl: {
    tpopkontrzaehl: {
      id: TpopkontrzaehlId
    }
  }
}

interface MenuProps {
  toggleFilterInput?: () => void
}

export const Menu = ({ toggleFilterInput }: MenuProps) => {
  const addNotification = useSetAtom(addNotificationAtom)
  const apolloClient = useApolloClient()
  const tsQueryClient = useQueryClient()

  const { search } = useLocation()
  const navigate = useNavigate()
  const { projId, apId, popId, tpopId } = useParams()

  const moving = useAtomValue(movingAtom)
  const setMoving = useSetAtom(setMovingAtom)
  const copying = useAtomValue(copyingAtom)
  const setCopying = useSetAtom(setCopyingAtom)
  const copyingBiotop = useAtomValue(copyingBiotopAtom)
  const setCopyingBiotop = useSetAtom(setCopyingBiotopAtom)
  const activeNodeArray = useAtomValue(treeActiveNodeArrayAtom)
  const openNodes = useAtomValue(treeOpenNodesAtom)
  const setOpenNodes = useSetAtom(treeSetOpenNodesAtom)

  const onClickAdd = async () => {
    // 1. create new tpopkontr
    let result
    try {
      result = await apolloClient.mutate<CreateTpopkontrResult>({
        mutation: gql`
          mutation createTpopfeldkontrForTpopfeldkontrForm($tpopId: UUID!) {
            createTpopkontr(input: { tpopkontr: { tpopId: $tpopId } }) {
              tpopkontr {
                id
                tpopId
              }
            }
          }
        `,
        variables: {
          tpopId,
        },
      })
    } catch (error) {
      return addNotification({
        message: (error as Error).message,
        options: {
          variant: 'error',
        },
      })
    }
    const id = result?.data?.createTpopkontr?.tpopkontr?.id

    // 2. add new tpopkontrzaehl
    const resultZaehl = await apolloClient.mutate<CreateTpopkontrzaehlResult>({
      mutation: gql`
        mutation createTpokontrzaehlForTpopfeldkontrs($parentId: UUID!) {
          createTpopkontrzaehl(
            input: { tpopkontrzaehl: { tpopkontrId: $parentId } }
          ) {
            tpopkontrzaehl {
              id
            }
          }
        }
      `,
      variables: { parentId: id },
    })

    // 3. open the tpopkontrzaehl Folder
    const zaehlId = resultZaehl?.data?.createTpopkontrzaehl?.tpopkontrzaehl?.id
    const tpopkontrNode = [...activeNodeArray, id]
    const zaehlungenFolderNode = [...tpopkontrNode, 'Zaehlungen']
    const zaehlungNode = [...zaehlungenFolderNode, zaehlId]
    const newOpenNodes = [
      ...openNodes,
      tpopkontrNode,
      zaehlungenFolderNode,
      zaehlungNode,
    ]
    setOpenNodes(newOpenNodes)

    // 4. refresh tree
    tsQueryClient.invalidateQueries({
      queryKey: [`treeTpopfeldkontr`],
    })
    tsQueryClient.invalidateQueries({
      queryKey: [`treeTpop`],
    })
    tsQueryClient.invalidateQueries({
      queryKey: [`treeTpopfeldkontrzaehl`],
    })

    // 5. navigate to new tpopkontr
    navigate(`./${id}${search}`)
  }

  const onClickOpenLowerNodes = () =>
    openLowerNodes({
      id: tpopId,
      projId,
      apId,
      popId,
      menuType: 'tpopfeldkontrFolder',
    })

  const onClickCloseLowerNodes = () =>
    closeLowerNodes({
      url: [
        'Projekte',
        projId,
        'Arten',
        apId,
        'Populationen',
        popId,
        'Teil-Populationen',
        tpopId,
        'Feld-Kontrollen',
      ],
      search,
    })

  const isMovingEk = moving.table === 'tpopfeldkontr'

  const onClickMoveEkfToHere = () => moveTo({ id: tpopId })

  const onClickStopMoving = () =>
    setMoving({
      table: null,
      id: '99999999-9999-9999-9999-999999999999',
      label: null,
      toTable: null,
      fromParentId: null,
    })

  const isCopyingEk = copying.table === 'tpopfeldkontr'
  const isCopyingBiotop = !!copyingBiotop.id
  const isCopying = isCopyingEk || isCopyingBiotop

  const onClickCopyEkfToHere = () => copyTo({ parentId: tpopId })

  const onClickStopCopying = () => {
    setCopying({
      table: null,
      id: '99999999-9999-9999-9999-999999999999',
      label: null,
      withNextLevel: false,
    })
    setCopyingBiotop({ id: null, label: null })
  }

  const showTreeMenus = useAtomValue(showTreeMenusAtom)

  return (
    <ErrorBoundary>
      <MenuBar
        rerenderer={`${moving.label}/${copying.label}/${copyingBiotop.label}/${isMovingEk}/${isCopyingEk}/${showTreeMenus}`}
      >
        {!!toggleFilterInput && (
          <FilterButton toggleFilterInput={toggleFilterInput} />
        )}
        <Tooltip title="Neue Feld-Kontrolle erstellen">
          <IconButton onClick={onClickAdd}>
            <FaPlus className={styles.icon} />
          </IconButton>
        </Tooltip>
        {showTreeMenus && (
          <Tooltip title="Ordner im Navigationsbaum öffnen">
            <IconButton onClick={onClickOpenLowerNodes}>
              <FaFolderTree className={styles.icon} />
            </IconButton>
          </Tooltip>
        )}
        {showTreeMenus && (
          <Tooltip title="Ordner im Navigationsbaum schliessen">
            <IconButton onClick={onClickCloseLowerNodes}>
              <RiFolderCloseFill className={styles.icon} />
            </IconButton>
          </Tooltip>
        )}
        {isMovingEk && (
          <Tooltip title={`Verschiebe '${moving.label}' hierhin`}>
            <IconButton onClick={onClickMoveEkfToHere}>
              <MdOutlineMoveDown className={styles.icon} />
            </IconButton>
          </Tooltip>
        )}
        {isMovingEk && (
          <Tooltip title={`Verschieben von '${moving.label}' abbrechen`}>
            <IconButton onClick={onClickStopMoving}>
              <BsSignStopFill className={styles.icon} />
            </IconButton>
          </Tooltip>
        )}
        {isCopyingEk && (
          <Tooltip title={`Kopiere '${copying.label}' hierhin`}>
            <IconButton onClick={onClickCopyEkfToHere}>
              <MdContentCopy className={styles.icon} />
            </IconButton>
          </Tooltip>
        )}
        {isCopying && (
          <Tooltip
            title={`Kopieren von '${copying.label ?? copyingBiotop.label}' abbrechen`}
          >
            <IconButton onClick={onClickStopCopying}>
              <BsSignStopFill className={styles.icon} />
            </IconButton>
          </Tooltip>
        )}
      </MenuBar>
    </ErrorBoundary>
  )
}
