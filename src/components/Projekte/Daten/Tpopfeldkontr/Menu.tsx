import { useState } from 'react'
import { useSetAtom, useAtomValue } from 'jotai'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQueryClient } from '@tanstack/react-query'
import { useParams, useNavigate, useLocation } from 'react-router'
import { FaPlus, FaMinus } from 'react-icons/fa6'
import { MdOutlineMoveDown, MdContentCopy } from 'react-icons/md'
import { BsSignStopFill } from 'react-icons/bs'
import IconButton from '@mui/material/IconButton'
import MuiMenu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Tooltip from '@mui/material/Tooltip'
import { isEqual } from 'es-toolkit'

import { MenuBar } from '../../../shared/MenuBar/index.tsx'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'
import { copyTo } from '../../../../modules/copyTo/index.ts'
import { copyBiotopTo } from '../../../../modules/copyBiotopTo.ts'
import { moveTo } from '../../../../modules/moveTo/index.ts'

import type {
  TpopkontrId,
  TpopId,
  TpopkontrzaehlId,
} from '../../../../generated/apflora/models.ts'

import styles from '../../../shared/Files/Menu/index.module.css'

import {
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
  row?: {
    label?: string
    labelEk?: string
  }
}

const iconStyle = { color: 'white' }

export const Menu = ({ row }: MenuProps) => {
  const addNotification = useSetAtom(addNotificationAtom)
  const { search, pathname } = useLocation()
  const navigate = useNavigate()
  const { projId, apId, popId, tpopId, tpopkontrId } = useParams()

  const moving = useAtomValue(movingAtom)
  const setMoving = useSetAtom(setMovingAtom)
  const copying = useAtomValue(copyingAtom)
  const setCopying = useSetAtom(setCopyingAtom)
  const copyingBiotop = useAtomValue(copyingBiotopAtom)
  const setCopyingBiotop = useSetAtom(setCopyingBiotopAtom)
  const openNodes = useAtomValue(treeOpenNodesAtom)
  const setOpenNodes = useSetAtom(treeSetOpenNodesAtom)
  const activeNodeArray = useAtomValue(treeActiveNodeArrayAtom)

  const apolloClient = useApolloClient()
  const tsQueryClient = useQueryClient()

  const onClickAdd = async () => {
    // 1. add new tpopkontr
    let result
    try {
      result = await apolloClient.mutate<CreateTpopkontrResult>({
        mutation: gql`
          mutation createTpopkontrForTpopfeldkontrForm($tpopId: UUID!) {
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
          // typ: 'Zwischenbeurteilung'
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
        mutation createTpokontrzaehlForTpopfeldkontrForm($parentId: UUID!) {
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
    const activeNodeArrayWithoutLastElement = activeNodeArray.slice(0, -1)
    const tpopkontrNode = [...activeNodeArrayWithoutLastElement, id]
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
      queryKey: [`treeTpop`],
    })
    tsQueryClient.invalidateQueries({
      queryKey: [`treeTpopfeldkontr`],
    })
    tsQueryClient.invalidateQueries({
      queryKey: [`treeTpopfeldkontrzaehl`],
    })

    // 5. navigate to new tpopkontr
    navigate(
      `/Daten/Projekte/${projId}/Arten/${apId}/Populationen/${popId}/Teil-Populationen/${tpopId}/Feld-Kontrollen/${id}/Feld-Kontrolle${search}`,
    )
  }

  const [delMenuAnchorEl, setDelMenuAnchorEl] = useState<HTMLElement | null>(
    null,
  )
  const delMenuOpen = Boolean(delMenuAnchorEl)
  const [copyBiotopMenuAnchorEl, setCopyBiotopMenuAnchorEl] =
    useState<HTMLElement | null>(null)
  const copyBiotopMenuOpen = Boolean(copyBiotopMenuAnchorEl)

  const onClickDelete = async () => {
    let result
    try {
      result = await apolloClient.mutate({
        mutation: gql`
          mutation deleteTpopkontrForTpopfeldkontrRouter($id: UUID!) {
            deleteTpopkontrById(input: { id: $id }) {
              tpopkontr {
                id
              }
            }
          }
        `,
        variables: { id: tpopkontrId },
      })
    } catch (error) {
      return addNotification({
        message: (error as Error).message,
        options: {
          variant: 'error',
        },
      })
    }

    // remove active path from openNodes
    const activePath = pathname.split('/').filter((p) => !!p)
    const newOpenNodes = openNodes.filter((n) => !isEqual(n, activePath))
    setOpenNodes(newOpenNodes)

    // update tree query
    tsQueryClient.invalidateQueries({
      queryKey: [`treeTpopfeldkontr`],
    })
    tsQueryClient.invalidateQueries({
      queryKey: [`treeTpop`],
    })
    // navigate to parent
    navigate(
      `/Daten/Projekte/${projId}/Arten/${apId}/Populationen/${popId}/Teil-Populationen/${tpopId}/Feld-Kontrollen${search}`,
    )
  }

  const isMovingFeldkontr = moving.table === 'tpopfeldkontr'
  const thisTpopfeldkontrIsMoving = moving.id === tpopkontrId
  const movingFromThisTpop = moving.fromParentId === tpopId
  const onClickMoveInTree = () => {
    if (isMovingFeldkontr) {
      return moveTo({ id: tpopId })
    }
    setMoving({
      id: tpopkontrId,
      label: row.label,
      table: 'tpopfeldkontr',
      toTable: 'tpopfeldkontr',
      fromParentId: tpopId,
    })
  }

  const onClickStopMoving = () =>
    setMoving({
      table: null,
      id: '99999999-9999-9999-9999-999999999999',
      label: null,
      toTable: null,
      fromParentId: null,
    })

  const isCopyingTpopfeldkontr = copying.table === 'tpopfeldkontr'
  const isCopyingBiotop = !!copyingBiotop.id
  const isCopying = isCopyingTpopfeldkontr || isCopyingBiotop
  const thisTpopfeldkontrIsCopying = copying.id === tpopkontrId

  const onClickCopyFeldkontrToHere = () => copyTo({ parentId: tpopId })

  const onClickCopyBiotopToHere = () => copyBiotopTo({ id: tpopkontrId })

  const onClickSetFeldkontrCopying = () => {
    setCopying({
      table: 'tpopfeldkontr',
      id: tpopkontrId,
      label: row.labelEk ?? row.label,
      withNextLevel: false,
    })
    setCopyBiotopMenuAnchorEl(null)
  }

  const onClickSetBiotopCopying = () => {
    setCopyingBiotop({
      id: tpopkontrId,
      label: row.labelEk ?? row.label,
    })
    setCopyBiotopMenuAnchorEl(null)
  }

  const onClickStopCopying = () => {
    setCopying({
      table: null,
      id: '99999999-9999-9999-9999-999999999999',
      label: null,
      withNextLevel: false,
    })
    setCopyingBiotop({ id: null, label: null })
  }

  return (
    <ErrorBoundary>
      <MenuBar
        rerenderer={`${isMovingFeldkontr}/${moving.label}/${isCopyingTpopfeldkontr}/${isCopyingBiotop}/${copying.label}/${isCopying}/${copyingBiotop.label}/${movingFromThisTpop}/${thisTpopfeldkontrIsMoving}/${thisTpopfeldkontrIsCopying}`}
      >
        <Tooltip title="Neue Feld-Kontrolle erstellen">
          <IconButton onClick={onClickAdd}>
            <FaPlus style={iconStyle} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Löschen">
          <IconButton
            onClick={(event) => setDelMenuAnchorEl(event.currentTarget)}
            aria-owns={delMenuOpen ? 'tpopfeldkontrDelMenu' : undefined}
          >
            <FaMinus style={iconStyle} />
          </IconButton>
        </Tooltip>
        <Tooltip
          title={
            !isMovingFeldkontr ?
              `'${row.labelEk ?? row.label}' zu einer anderen Population verschieben`
            : thisTpopfeldkontrIsMoving ?
              'Zum Verschieben gemerkt, bereit um in einer anderen Teilpopulation einzufügen'
            : movingFromThisTpop ?
              `'${moving.label}' zur selben Teilpopulation zu vershieben, macht keinen Sinn`
            : `Verschiebe '${moving.label}' zu dieser Teilpopulation`
          }
        >
          <IconButton onClick={onClickMoveInTree}>
            <MdOutlineMoveDown
              style={{
                color:
                  isMovingFeldkontr && thisTpopfeldkontrIsMoving ?
                    'rgb(255, 90, 0)'
                  : 'white',
              }}
            />
          </IconButton>
        </Tooltip>
        {isMovingFeldkontr && (
          <Tooltip title={`Verschieben von '${moving.label}' abbrechen`}>
            <IconButton onClick={onClickStopMoving}>
              <BsSignStopFill style={iconStyle} />
            </IconButton>
          </Tooltip>
        )}
        {isCopyingTpopfeldkontr ?
          <Tooltip title={`Kopiere '${copying.label}' in diese Teilpopulation`}>
            <IconButton onClick={onClickCopyFeldkontrToHere}>
              <MdContentCopy
                style={{
                  color:
                    thisTpopfeldkontrIsCopying === 'true' ? 'rgb(255, 90, 0)'
                    : 'white',
                }}
              />
            </IconButton>
          </Tooltip>
        : isCopyingBiotop ?
          <Tooltip
            title={`Kopiere Biotop von '${copyingBiotop.label}' hierhin`}
          >
            <IconButton onClick={onClickCopyBiotopToHere}>
              <MdContentCopy style={{ color: 'white' }} />
            </IconButton>
          </Tooltip>
        : <Tooltip title="Kopieren">
            <IconButton
              onClick={(event) =>
                setCopyBiotopMenuAnchorEl(event.currentTarget)
              }
              aria-owns={copyBiotopMenuOpen ? 'copyBiotopMenu' : undefined}
            >
              <MdContentCopy
                style={{
                  color:
                    thisTpopfeldkontrIsCopying === 'true' ? 'rgb(255, 90, 0)'
                    : 'white',
                }}
              />
            </IconButton>
          </Tooltip>
        }
        {isCopying && (
          <Tooltip
            title={`Kopieren von '${copying.label ?? copyingBiotop.label}' abbrechen`}
          >
            <IconButton onClick={onClickStopCopying}>
              <BsSignStopFill style={iconStyle} />
            </IconButton>
          </Tooltip>
        )}
      </MenuBar>
      <MuiMenu
        id="tpopfeldkontrDelMenu"
        anchorEl={delMenuAnchorEl}
        open={delMenuOpen}
        onClose={() => setDelMenuAnchorEl(null)}
      >
        <h3 className={styles.menuTitle}>löschen?</h3>
        <MenuItem onClick={onClickDelete}>ja</MenuItem>
        <MenuItem onClick={() => setDelMenuAnchorEl(null)}>nein</MenuItem>
      </MuiMenu>
      <MuiMenu
        id="copyBiotopMenu"
        anchorEl={copyBiotopMenuAnchorEl}
        open={copyBiotopMenuOpen}
        onClose={() => setCopyBiotopMenuAnchorEl(null)}
      >
        <h3 className={styles.menuTitle}>Kopieren:</h3>
        <MenuItem onClick={onClickSetFeldkontrCopying}>Feld-Kontrolle</MenuItem>
        <MenuItem onClick={onClickSetBiotopCopying}>Biotop</MenuItem>
      </MuiMenu>
    </ErrorBoundary>
  )
}
