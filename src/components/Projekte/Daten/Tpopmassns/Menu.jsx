import { memo, useCallback, useContext, useMemo, useState } from 'react'
import { useApolloClient, gql } from '@apollo/client'
import { useQueryClient } from '@tanstack/react-query'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { getSnapshot } from 'mobx-state-tree'
import { FaPlus, FaFolder, FaFolderTree } from 'react-icons/fa6'
import { RiFolderCloseFill } from 'react-icons/ri'
import { MdOutlineMoveDown, MdContentCopy } from 'react-icons/md'
import { BsSignStopFill } from 'react-icons/bs'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import ToggleButton from '@mui/material/ToggleButton'
import LoadingButton from '@mui/lab/LoadingButton'
import MuiMenu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Tooltip from '@mui/material/Tooltip'
import isEqual from 'lodash/isEqual'
import uniq from 'lodash/uniq'
import styled from '@emotion/styled'

import { MenuBar, buttonWidth } from '../../../shared/MenuBar/index.jsx'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
import { StoreContext } from '../../../../storeContext.js'
import { MenuTitle } from '../../../shared/Files/Menu/index.jsx'
import { openLowerNodes } from '../../TreeContainer/openLowerNodes/index.js'
import { closeLowerNodes } from '../../TreeContainer/closeLowerNodes.js'
import { moveTo } from '../../../../modules/moveTo/index.js'
import { copyTo } from '../../../../modules/copyTo/index.js'

// unfortunately, toggle buttons are different from icon buttons...
const RoundToggleButton = styled(ToggleButton)`
  border-radius: 50%;
  border-width: 0;
  padding: 8px;
  svg {
    height: 24px;
    width: 24px;
  }
`
const MoveIcon = styled(MdOutlineMoveDown)`
  color: white;
`
const CopyIcon = styled(MdContentCopy)`
  color: white;
`
const StyledLoadingButton = styled(LoadingButton)`
  margin: 0 5px;
  padding: 3px 10px;
  text-transform: none;
  line-height: 1.1;
  font-size: 0.8rem;
  color: white;
  border-color: white;
  width: ${(props) => props.width}px;
`
const StyledButton = styled(Button)`
  margin: 0 5px;
  padding: 3px 10px;
  text-transform: none;
  line-height: 1.1;
  font-size: 0.8rem;
  max-height: 36px;
  color: white;
  border-color: white;
`
const iconStyle = { color: 'white' }

export const Menu = memo(
  observer(({ row }) => {
    const { search, pathname } = useLocation()
    const navigate = useNavigate()
    const client = useApolloClient()
    const tanstackQueryClient = useQueryClient()
    const { projId, apId, popId, tpopId } = useParams()
    const store = useContext(StoreContext)
    const { activeApfloraLayers, setMoving, moving, setCopying, copying } =
      store

    const onClickAdd = useCallback(async () => {
      let result
      try {
        result = await client.mutate({
          mutation: gql`
            mutation createTpopmassnForTpopmassnForm($tpopId: UUID!) {
              createTpopmassn(input: { tpopmassn: { tpopId: $tpopId } }) {
                tpopmassn {
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
        return store.enqueNotification({
          message: error.message,
          options: {
            variant: 'error',
          },
        })
      }
      tanstackQueryClient.invalidateQueries({
        queryKey: [`treeTpopmassn`],
      })
      tanstackQueryClient.invalidateQueries({
        queryKey: [`treeTpopFolders`],
      })
      const id = result?.data?.createTpopmassn?.tpopmassn?.id
      navigate(`./${id}${search}`)
    }, [
      apId,
      client,
      store,
      tanstackQueryClient,
      navigate,
      search,
      projId,
      popId,
      tpopId,
    ])

    const onClickOpenLowerNodes = useCallback(() => {
      openLowerNodes({
        id: tpopId,
        projId,
        apId,
        popId,
        client,
        store,
        menuType: 'tpop',
        parentId: popId,
      })
    }, [projId, apId, popId, tpopId, client, store])

    const onClickCloseLowerNodes = useCallback(() => {
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
        ],
        store,
        search,
      })
    }, [projId, apId, popId, tpopId, store, search])

    const isMovingTpop = moving.table === 'tpop'
    const thisTpopIsMoving = moving.id === tpopId
    const movingFromThisPop = moving.fromParentId === popId
    const isMovingTpopfeldkontr = moving.table === 'tpopfeldkontr'
    const isMovingTpopfreiwkontr = moving.table === 'tpopfreiwkontr'
    const isMovingTpopmassn = moving.table === 'tpopmassn'
    const onClickMoveInTree = useCallback(() => {
      if (isMovingTpop) {
        // move to this pop
        return moveTo({
          id: popId,
          client,
          store,
          tanstackQueryClient,
        })
      }
      if (
        isMovingTpopfeldkontr ||
        isMovingTpopfreiwkontr ||
        isMovingTpopmassn
      ) {
        // move to this tpop
        return moveTo({
          id: tpopId,
          client,
          store,
          tanstackQueryClient,
        })
      }
      setMoving({
        id: row.id,
        label: row.label,
        table: 'tpop',
        toTable: 'tpop',
        fromParentId: popId,
      })
    }, [
      row,
      setMoving,
      popId,
      tpopId,
      client,
      store,
      tanstackQueryClient,
      isMovingTpop,
      isMovingTpopfeldkontr,
      isMovingTpopfreiwkontr,
      isMovingTpopmassn,
      moveTo,
    ])

    const onClickStopMoving = useCallback(() => {
      setMoving({
        table: null,
        id: '99999999-9999-9999-9999-999999999999',
        label: null,
        toTable: null,
        fromParentId: null,
      })
    }, [setMoving])

    const isCopyingTpop = copying.table === 'tpop'
    const thisTpopIsCopying = copying.id === tpopId
    const isCopyingFeldkontr = copying.table === 'tpopfeldkontr'
    const isCopyingFreiwkontr = copying.table === 'tpopfreiwkontr'
    const isCopyingMassn = copying.table === 'tpopmassn'
    const isCopying =
      isCopyingTpop ||
      isCopyingFeldkontr ||
      isCopyingFreiwkontr ||
      isCopyingMassn
    const onClickCopy = useCallback(() => {
      if (isCopyingTpop) {
        // copy to this pop
        return copyTo({
          parentId: popId,
          client,
          store,
          tanstackQueryClient,
        })
      }
      if (isCopyingFeldkontr || isCopyingFreiwkontr || isCopyingMassn) {
        // copy to this tpop
        return copyTo({
          parentId: tpopId,
          client,
          store,
          tanstackQueryClient,
        })
      }
      setCopying({
        table: 'tpop',
        id: tpopId,
        label: row.label,
        withNextLevel: false,
      })
    }, [
      isCopying,
      copyTo,
      popId,
      tpopId,
      client,
      store,
      tanstackQueryClient,
      row,
      setCopying,
      isCopyingTpop,
      isCopyingFeldkontr,
      isCopyingFreiwkontr,
      isCopyingMassn,
    ])

    const onClickStopCopying = useCallback(() => {
      setCopying({
        table: null,
        id: '99999999-9999-9999-9999-999999999999',
        label: null,
        withNextLevel: false,
      })
    }, [setCopying])

    const widths = useMemo(
      () => [
        buttonWidth,
        buttonWidth,
        buttonWidth,
        buttonWidth,
        buttonWidth,
        buttonWidth,
        ...(isMovingTpop ? [buttonWidth] : []),
        buttonWidth,
        ...(isCopyingTpop ? [buttonWidth] : []),
        130,
        90,
      ],
      [isCopyingTpop, isMovingTpop],
    )

    // to paste copied feldkontr/frwkontr/massn
    const onClickCopyLowerElementToHere = useCallback(() => {
      copyTo({
        parentId: tpopId,
        client,
        store,
        tanstackQueryClient,
      })
    }, [tpopId, client, store, tanstackQueryClient])

    return (
      <ErrorBoundary>
        <MenuBar
          bgColor="#388e3c"
          color="white"
          rerenderer={`${isMovingTpop}/${moving.label}/${isCopyingTpop}/${copying.label}/${movingFromThisPop}/${thisTpopIsMoving}/${thisTpopIsCopying}`}
          widths={widths}
        >
          <Tooltip title="Neue Teil-Population erstellen">
            <IconButton onClick={onClickAdd}>
              <FaPlus style={iconStyle} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Ordner im Navigationsbaum öffnen">
            <IconButton onClick={onClickOpenLowerNodes}>
              <FaFolderTree style={iconStyle} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Ordner im Navigationsbaum schliessen">
            <IconButton onClick={onClickCloseLowerNodes}>
              <RiFolderCloseFill style={iconStyle} />
            </IconButton>
          </Tooltip>
          <Tooltip
            title={
                : thisTpopIsMoving
                  ? 'Zum Verschieben gemerkt, bereit um in einer anderen Population einzufügen'
                  : movingFromThisPop
                    ? `'${moving.label}' zur selben Population zu vershieben, macht keinen Sinn`
                    : `Verschiebe '${moving.label}' zu dieser Population`
            }
          >
            <IconButton onClick={onClickMoveInTree}>
              <MoveIcon
              />
            </IconButton>
          </Tooltip>
          {isMovingTpop && (
            <Tooltip title={`Verschieben von '${moving.label}' abbrechen`}>
              <IconButton onClick={onClickStopMoving}>
                <BsSignStopFill style={iconStyle} />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip
            title={
              isCopying
                ? `Kopiere '${copying.label}' in diese Population`
                : 'Kopieren'
            }
          >
            <IconButton onClick={onClickCopy}>
              <CopyIcon  />
            </IconButton>
          </Tooltip>
          {isCopying && (
            <Tooltip title={`Kopieren von '${copying.label}' abbrechen`}>
              <IconButton onClick={onClickStopCopying}>
                <BsSignStopFill style={iconStyle} />
              </IconButton>
            </Tooltip>
          )}
        </MenuBar>
      </ErrorBoundary>
    )
  }),
)
