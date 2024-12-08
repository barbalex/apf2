import { memo, useCallback, useContext, useState } from 'react'
import { useApolloClient, gql } from '@apollo/client'
import { useQueryClient } from '@tanstack/react-query'
import { useParams, useNavigate, useLocation } from 'react-router'
import { observer } from 'mobx-react-lite'
import { getSnapshot } from 'mobx-state-tree'
import { FaPlus, FaMinus } from 'react-icons/fa6'
import { MdOutlineMoveDown, MdContentCopy, MdPrint } from 'react-icons/md'
import { BsSignStopFill } from 'react-icons/bs'
import IconButton from '@mui/material/IconButton'
import MuiMenu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Tooltip from '@mui/material/Tooltip'
import isEqual from 'lodash/isEqual'
import styled from '@emotion/styled'

import { MenuBar } from '../../../shared/MenuBar/index.jsx'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
import { MobxContext } from '../../../../storeContext.js'
import { MenuTitle } from '../../../shared/Files/Menu/index.jsx'
import { copyTo } from '../../../../modules/copyTo/index.js'
import { moveTo } from '../../../../modules/moveTo/index.js'

const MoveIcon = styled(MdOutlineMoveDown)`
  color: ${(props) =>
    props.moving === 'true' ? 'rgb(255, 90, 0) !important' : 'white'};
`
const CopyIcon = styled(MdContentCopy)`
  color: ${(props) =>
    props.copying === 'true' ? 'rgb(255, 90, 0) !important' : 'white'};
`
const iconStyle = { color: 'white' }

export const Menu = memo(
  observer(({ row }) => {
    const { search, pathname } = useLocation()
    const navigate = useNavigate()
    const client = useApolloClient()
    const tanstackQueryClient = useQueryClient()
    const { projId, apId, popId, tpopId, tpopkontrId } = useParams()
    const store = useContext(MobxContext)
    const { moving, setMoving, copying, setCopying, setIsPrint } = store

    const onClickAdd = useCallback(async () => {
      let result
      try {
        result = await client.mutate({
          mutation: gql`
            mutation createTpopkontrForTpopfreiwkontrForm(
              $tpopId: UUID!
              $typ: String!
            ) {
              createTpopkontr(
                input: { tpopkontr: { tpopId: $tpopId, typ: $typ } }
              ) {
                tpopkontr {
                  id
                  tpopId
                  typ
                }
              }
            }
          `,
          variables: { tpopId, typ: 'Freiwilligen-Erfolgskontrolle' },
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
        queryKey: [`treeTpopfreiwkontrs`],
      })
      tanstackQueryClient.invalidateQueries({
        queryKey: [`treeTpopFolders`],
      })
      const id = result?.data?.createTpopkontr?.tpopkontr?.id
      navigate(
        `/Daten/Projekte/${projId}/Arten/${apId}/Populationen/${popId}/Teil-Populationen/${tpopId}/Freiwilligen-Kontrollen/${id}${search}`,
      )
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

    const [delMenuAnchorEl, setDelMenuAnchorEl] = useState(null)
    const delMenuOpen = Boolean(delMenuAnchorEl)

    const onClickDelete = useCallback(async () => {
      let result
      try {
        result = await client.mutate({
          mutation: gql`
            mutation deleteTpopkontrForTpopfreiwkontr($id: UUID!) {
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
        return store.enqueNotification({
          message: error.message,
          options: {
            variant: 'error',
          },
        })
      }

      // remove active path from openNodes
      const openNodesRaw = store?.tree?.openNodes
      const openNodes = getSnapshot(openNodesRaw)
      const activePath = pathname.split('/').filter((p) => !!p)
      const newOpenNodes = openNodes.filter((n) => !isEqual(n, activePath))
      store.tree.setOpenNodes(newOpenNodes)

      // update tree query
      tanstackQueryClient.invalidateQueries({
        queryKey: [`treeTpopfreiwkontrs`],
      })
      tanstackQueryClient.invalidateQueries({
        queryKey: [`treeTpopFolders`],
      })
      // navigate to parent
      navigate(
        `/Daten/Projekte/${projId}/Arten/${apId}/Populationen/${popId}/Teil-Populationen/${tpopId}/Freiwilligen-Kontrollen${search}`,
      )
    }, [
      client,
      store,
      tanstackQueryClient,
      navigate,
      search,
      apId,
      projId,
      popId,
      tpopId,
      pathname,
    ])

    const onClickPrint = useCallback(() => {
      setIsPrint(true)
      // wait for file to load
      // https://github.com/barbalex/apf2/issues/617
      setTimeout(() => {
        window.print()
        setIsPrint(false)
      }, 0)
    }, [setIsPrint])

    const isMovingTpopfreiwkontr = moving.table === 'tpopfreiwkontr'
    const thisTpopfreiwkontrIsMoving = moving.id === tpopkontrId
    const movingFromThisTpop = moving.fromParentId === tpopId
    const onClickMoveInTree = useCallback(() => {
      if (isMovingTpopfreiwkontr) {
        return moveTo({
          id: tpopId,
          client,
          store,
          tanstackQueryClient,
        })
      }
      setMoving({
        id: row.id,
        label: row.labelEkf,
        table: 'tpopfreiwkontr',
        toTable: 'tpopfreiwkontr',
        fromParentId: tpopId,
      })
    }, [
      row,
      setMoving,
      tpopId,
      isMovingTpopfreiwkontr,
      moveTo,
      client,
      store,
      tanstackQueryClient,
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

    const isCopyingTpopfreiwkontr = copying.table === 'tpopfreiwkontr'
    const thisTpopfreiwkontrIsCopying = copying.id === tpopkontrId
    const onClickCopy = useCallback(() => {
      if (isCopyingTpopfreiwkontr) {
        // copy to this tpop
        return copyTo({
          parentId: tpopId,
          client,
          store,
          tanstackQueryClient,
        })
      }
      setCopying({
        table: 'tpopfreiwkontr',
        id: tpopkontrId,
        label: row.labelEkf,
        withNextLevel: false,
      })
    }, [
      isCopyingTpopfreiwkontr,
      copyTo,
      tpopId,
      tpopkontrId,
      client,
      store,
      tanstackQueryClient,
      row,
      setCopying,
    ])

    const onClickStopCopying = useCallback(() => {
      setCopying({
        table: null,
        id: '99999999-9999-9999-9999-999999999999',
        label: null,
        withNextLevel: false,
      })
    }, [setCopying])

    return (
      <ErrorBoundary>
        <MenuBar
          rerenderer={`${isMovingTpopfreiwkontr}/${moving.label}/${isCopyingTpopfreiwkontr}/${copying.label}/${movingFromThisTpop}/${thisTpopfreiwkontrIsMoving}/${thisTpopfreiwkontrIsCopying}`}
        >
          <Tooltip title="Neuen Bericht erstellen">
            <IconButton onClick={onClickAdd}>
              <FaPlus style={iconStyle} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Löschen">
            <IconButton
              onClick={(event) => setDelMenuAnchorEl(event.currentTarget)}
              aria-owns={delMenuOpen ? 'tpopfreiwkontrDelMenu' : undefined}
            >
              <FaMinus style={iconStyle} />
            </IconButton>
          </Tooltip>
          <Tooltip title="drucken">
            <IconButton onClick={onClickPrint}>
              <MdPrint style={iconStyle} />
            </IconButton>
          </Tooltip>
          <Tooltip
            title={
              !isMovingTpopfreiwkontr ?
                `'${row.labelEkf}' zu einer anderen Population verschieben`
              : thisTpopfreiwkontrIsMoving ?
                'Zum Verschieben gemerkt, bereit um in einer anderen Teilpopulation einzufügen'
              : movingFromThisTpop ?
                `'${moving.label}' zur selben Teilpopulation zu vershieben, macht keinen Sinn`
              : `Verschiebe '${moving.label}' zu dieser Teilpopulation`
            }
          >
            <IconButton onClick={onClickMoveInTree}>
              <MoveIcon
                moving={(
                  isMovingTpopfreiwkontr && thisTpopfreiwkontrIsMoving
                ).toString()}
              />
            </IconButton>
          </Tooltip>
          {isMovingTpopfreiwkontr && (
            <Tooltip title={`Verschieben von '${moving.label}' abbrechen`}>
              <IconButton onClick={onClickStopMoving}>
                <BsSignStopFill style={iconStyle} />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip
            title={
              isCopyingTpopfreiwkontr ?
                `Kopiere '${copying.label}' in diese Teilpopulation`
              : 'Kopieren'
            }
          >
            <IconButton onClick={onClickCopy}>
              <CopyIcon copying={thisTpopfreiwkontrIsCopying.toString()} />
            </IconButton>
          </Tooltip>
          {isCopyingTpopfreiwkontr && (
            <Tooltip title={`Kopieren von '${copying.label}' abbrechen`}>
              <IconButton onClick={onClickStopCopying}>
                <BsSignStopFill style={iconStyle} />
              </IconButton>
            </Tooltip>
          )}
        </MenuBar>
        <MuiMenu
          id="tpopfreiwkontrDelMenu"
          anchorEl={delMenuAnchorEl}
          open={delMenuOpen}
          onClose={() => setDelMenuAnchorEl(null)}
        >
          <MenuTitle>löschen?</MenuTitle>
          <MenuItem onClick={onClickDelete}>ja</MenuItem>
          <MenuItem onClick={() => setDelMenuAnchorEl(null)}>nein</MenuItem>
        </MuiMenu>
      </ErrorBoundary>
    )
  }),
)
