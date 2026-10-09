import { useState } from 'react'
import { useSetAtom, useAtomValue } from 'jotai'
import { graphql } from '../../../../gql/index.ts'
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

import { MenuBar } from '../../../shared/MenuBar/index.tsx'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'
import { deleteModule } from '../../TreeContainer/DeleteDatasetModal/delete/index.ts'
import { copyTo } from '../../../../modules/copyTo/index.ts'
import { moveTo } from '../../../../modules/moveTo/index.ts'

import type { TpopmassnId } from '../../../../models/apflora/Tpopmassn.ts'
import type { TpopId } from '../../../../models/apflora/Tpop.ts'

import filesMenuStyles from '../../../shared/Files/Menu/index.module.css'

import {
  addNotificationAtom,
  copyingAtom,
  setCopyingAtom,
  movingAtom,
  setMovingAtom,
} from '../../../../store/index.ts'

interface CreateTpopmassnResult {
  createTpopmassn: {
    tpopmassn: {
      id: TpopmassnId
      tpopId: TpopId
    }
  }
}

interface MenuProps {
  row: { id?: string | undefined; label?: string | undefined }
}

const iconStyle = { color: 'white' }

export const Menu = ({ row }: MenuProps) => {
  const addNotification = useSetAtom(addNotificationAtom)
  const { search, pathname } = useLocation()
  const navigate = useNavigate()
  const { projId, apId, popId, tpopId, tpopmassnId } = useParams()

  const moving = useAtomValue(movingAtom)
  const setMoving = useSetAtom(setMovingAtom)
  const copying = useAtomValue(copyingAtom)
  const setCopying = useSetAtom(setCopyingAtom)

  const apolloClient = useApolloClient()
  const tsQueryClient = useQueryClient()

  const onClickAdd = async () => {
    let result: { data?: CreateTpopmassnResult | undefined } | undefined
    try {
      result = await apolloClient.mutate<CreateTpopmassnResult>({
        mutation: graphql(`
          mutation createTpopmassnForTpopmassnForm($tpopId: UUID!) {
            createTpopmassn(input: { tpopmassn: { tpopId: $tpopId } }) {
              tpopmassn {
                id
                tpopId
              }
            }
          }
        `),
        variables: {
          tpopId: tpopId ?? '',
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
    void tsQueryClient.invalidateQueries({
      queryKey: [`treeTpopmassn`],
    })
    void tsQueryClient.invalidateQueries({
      queryKey: [`treeTpop`],
    })
    const id = result?.data?.createTpopmassn?.tpopmassn?.id
    void navigate(
      `/Daten/Projekte/${projId}/Arten/${apId}/Populationen/${popId}/Teil-Populationen/${tpopId}/Massnahmen/${id}${search}`,
    )
  }

  const [delMenuAnchorEl, setDelMenuAnchorEl] = useState<HTMLElement | null>(
    null,
  )
  const delMenuOpen = Boolean(delMenuAnchorEl)

  const onClickDelete = () =>
    void deleteModule({
      search,
      toDelete: {
        table: 'tpopmassn',
        id: tpopmassnId ?? null,
        label: row.label ?? null,
        url: pathname.split('/').filter((p) => !!p),
        afterDeletionHook: () => {
          void tsQueryClient.invalidateQueries({
            queryKey: [`treeTpop`],
          })
          void navigate(
            `/Daten/Projekte/${projId}/Arten/${apId}/Populationen/${popId}/Teil-Populationen/${tpopId}/Massnahmen${search}`,
          )
        },
      },
    })

  const isMovingTpopmassn = moving.table === 'tpopmassn'
  const thisTpopmassnIsMoving = moving.id === tpopmassnId
  const movingFromThisTpop = moving.fromParentId === tpopId
  const onClickMoveInTree = () => {
    if (isMovingTpopmassn) return moveTo({ id: tpopId })

    setMoving({
      id: row.id,
      label: row.label,
      table: 'tpopmassn',
      toTable: 'tpopmassn',
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

  const isCopyingTpopmassn = copying.table === 'tpopmassn'
  const thisTpopmassnIsCopying = copying.id === tpopmassnId
  const onClickCopy = () => {
    if (isCopyingTpopmassn) return copyTo({ parentId: tpopId })

    setCopying({
      table: 'tpopmassn',
      id: tpopmassnId,
      label: row.label,
      withNextLevel: false,
    })
  }

  const onClickStopCopying = () =>
    setCopying({
      table: null,
      id: '99999999-9999-9999-9999-999999999999',
      label: null,
      withNextLevel: false,
    })

  return (
    <ErrorBoundary>
      <MenuBar
        rerenderer={`${isMovingTpopmassn}/${moving.label}/${isCopyingTpopmassn}/${copying.label}/${movingFromThisTpop}/${thisTpopmassnIsMoving}/${thisTpopmassnIsCopying}`}
      >
        <Tooltip title="Neue Massnahme erstellen">
          <IconButton onClick={() => void onClickAdd()}>
            <FaPlus style={iconStyle} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Löschen">
          <IconButton
            onClick={(event) => setDelMenuAnchorEl(event.currentTarget)}
            aria-owns={delMenuOpen ? 'tpopmassnDelMenu' : undefined}
          >
            <FaMinus style={iconStyle} />
          </IconButton>
        </Tooltip>
        <Tooltip
          title={
            !isMovingTpopmassn ?
              `'${row.label}' zu einer anderen Teil-Population verschieben`
            : thisTpopmassnIsMoving ?
              'Zum Verschieben gemerkt, bereit um in einer anderen Teil-Population einzufügen'
            : movingFromThisTpop ?
              `'${moving.label}' zur selben Teil-Population zu vershieben, macht keinen Sinn`
            : `Verschiebe '${moving.label}' zu dieser Teil-Population`
          }
        >
          <IconButton onClick={() => void onClickMoveInTree()}>
            <MdOutlineMoveDown
              style={{
                color:
                  isMovingTpopmassn && thisTpopmassnIsMoving ? 'rgb(255, 90, 0)'
                  : 'white',
              }}
            />
          </IconButton>
        </Tooltip>
        {isMovingTpopmassn && (
          <Tooltip title={`Verschieben von '${moving.label}' abbrechen`}>
            <IconButton onClick={onClickStopMoving}>
              <BsSignStopFill style={iconStyle} />
            </IconButton>
          </Tooltip>
        )}
        <Tooltip
          title={
            isCopyingTpopmassn ?
              `Kopiere '${copying.label}' in diese Teilpopulation`
            : 'Kopieren'
          }
        >
          <IconButton onClick={() => void onClickCopy()}>
            <MdContentCopy
              style={{
                color: thisTpopmassnIsCopying ? 'rgb(255, 90, 0)' : 'white',
              }}
            />
          </IconButton>
        </Tooltip>
        {isCopyingTpopmassn && (
          <Tooltip title={`Kopieren von '${copying.label}' abbrechen`}>
            <IconButton onClick={onClickStopCopying}>
              <BsSignStopFill style={iconStyle} />
            </IconButton>
          </Tooltip>
        )}
      </MenuBar>
      <MuiMenu
        id="tpopmassnDelMenu"
        anchorEl={delMenuAnchorEl}
        open={delMenuOpen}
        onClose={() => setDelMenuAnchorEl(null)}
      >
        <h3 className={filesMenuStyles.menuTitle}>löschen?</h3>
        <MenuItem onClick={() => void onClickDelete()}>ja</MenuItem>
        <MenuItem onClick={() => setDelMenuAnchorEl(null)}>nein</MenuItem>
      </MuiMenu>
    </ErrorBoundary>
  )
}
