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
  movingAtom,
  setMovingAtom,
} from '../../../../store/index.ts'

import type { TpopkontrId } from '../../../../models/apflora/TpopkontrId.ts'
import type { TpopId } from '../../../../models/apflora/TpopId.ts'

interface CreateTpopkontrResult {
  data: {
    createTpopkontr: {
      tpopkontr: {
        id: TpopkontrId
        tpopId: TpopId
      }
    }
  }
}

interface MenuProps {
  toggleFilterInput?: () => void
}

const iconStyle = { color: 'white' }

export const Menu = ({ toggleFilterInput }: MenuProps) => {
  const addNotification = useSetAtom(addNotificationAtom)
  const { search } = useLocation()
  const navigate = useNavigate()
  const apolloClient = useApolloClient()
  const tsQueryClient = useQueryClient()
  const { projId, apId, popId, tpopId } = useParams()
  const moving = useAtomValue(movingAtom)
  const setMoving = useSetAtom(setMovingAtom)
  const copying = useAtomValue(copyingAtom)
  const setCopying = useSetAtom(setCopyingAtom)

  const onClickAdd = async () => {
    let result: CreateTpopkontrResult | undefined
    try {
      result = await apolloClient.mutate<CreateTpopkontrResult['data']>({
        mutation: gql`
          mutation createTpopfreiwkontrForTpopfreiwkontrForm($tpopId: UUID!) {
            createTpopkontr(
              input: {
                tpopkontr: {
                  tpopId: $tpopId
                  typ: "Freiwilligen-Erfolgskontrolle"
                }
              }
            ) {
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
    tsQueryClient.invalidateQueries({
      queryKey: [`treeTpopfreiwkontr`],
    })
    tsQueryClient.invalidateQueries({
      queryKey: [`treeTpop`],
    })
    const id = result?.data?.createTpopkontr?.tpopkontr?.id
    navigate(`./${id}${search}`)
  }

  const onClickOpenLowerNodes = () =>
    openLowerNodes({
      id: tpopId,
      projId,
      apId,
      popId,
      menuType: 'tpopfreiwkontrFolder',
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
        'Freiwilligen-Kontrollen',
      ],
      search,
    })

  const isMovingEkf = moving.table === 'tpopfreiwkontr'

  const onClickMoveEkfToHere = () => moveTo({ id: tpopId })

  const onClickStopMoving = () =>
    setMoving({
      table: null,
      id: '99999999-9999-9999-9999-999999999999',
      label: null,
      toTable: null,
      fromParentId: null,
    })

  const isCopyingEkf = copying.table === 'tpopfreiwkontr'

  const onClickCopyEkfToHere = () => copyTo({ parentId: tpopId })

  const onClickStopCopying = () =>
    setCopying({
      table: null,
      id: '99999999-9999-9999-9999-999999999999',
      label: null,
      withNextLevel: false,
    })

  const showTreeMenus = useAtomValue(showTreeMenusAtom)

  return (
    <ErrorBoundary>
      <MenuBar
        rerenderer={`${moving.label}/${copying.label}/${isMovingEkf}/${isCopyingEkf}/${showTreeMenus}`}
      >
        {!!toggleFilterInput && (
          <FilterButton toggleFilterInput={toggleFilterInput} />
        )}
        <Tooltip title="Neue Freiwilligen-Kontrolle erstellen">
          <IconButton onClick={onClickAdd}>
            <FaPlus style={iconStyle} />
          </IconButton>
        </Tooltip>
        {showTreeMenus && (
          <Tooltip title="Ordner im Navigationsbaum öffnen">
            <IconButton onClick={onClickOpenLowerNodes}>
              <FaFolderTree style={iconStyle} />
            </IconButton>
          </Tooltip>
        )}
        {showTreeMenus && (
          <Tooltip title="Ordner im Navigationsbaum schliessen">
            <IconButton onClick={onClickCloseLowerNodes}>
              <RiFolderCloseFill style={iconStyle} />
            </IconButton>
          </Tooltip>
        )}
        {isMovingEkf && (
          <Tooltip title={`Verschiebe '${moving.label}' hierhin`}>
            <IconButton onClick={onClickMoveEkfToHere}>
              <MdOutlineMoveDown style={iconStyle} />
            </IconButton>
          </Tooltip>
        )}
        {isMovingEkf && (
          <Tooltip title={`Verschieben von '${moving.label}' abbrechen`}>
            <IconButton onClick={onClickStopMoving}>
              <BsSignStopFill style={iconStyle} />
            </IconButton>
          </Tooltip>
        )}
        {isCopyingEkf && (
          <Tooltip title={`Kopiere '${copying.label}' hierhin`}>
            <IconButton onClick={onClickCopyEkfToHere}>
              <MdContentCopy style={iconStyle} />
            </IconButton>
          </Tooltip>
        )}
        {isCopyingEkf && (
          <Tooltip title={`Kopieren von '${copying.label}' abbrechen`}>
            <IconButton onClick={onClickStopCopying}>
              <BsSignStopFill style={iconStyle} />
            </IconButton>
          </Tooltip>
        )}
      </MenuBar>
    </ErrorBoundary>
  )
}
