import { memo, useCallback, useContext, useState } from 'react'
import { useApolloClient, gql } from '@apollo/client'
import { useQueryClient } from '@tanstack/react-query'
import { useParams, useNavigate, useLocation } from 'react-router'
import { observer } from 'mobx-react-lite'
import { getSnapshot } from 'mobx-state-tree'
import { FaPlus, FaMinus } from 'react-icons/fa6'
import { MdOutlineMoveDown, MdContentCopy } from 'react-icons/md'
import { BsSignStopFill } from 'react-icons/bs'
import IconButton from '@mui/material/IconButton'
import MuiMenu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Tooltip from '@mui/material/Tooltip'
import isEqual from 'lodash/isEqual'
import styled from '@emotion/styled'

import { MenuBar } from '../../../shared/MenuBar/index.jsx'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
import { MobxContext } from '../../../../mobxContext.js'
import { MenuTitle } from '../../../shared/Files/Menu/index.jsx'
import { copyTo } from '../../../../modules/copyTo/index.js'
import { copyBiotopTo } from '../../../../modules/copyBiotopTo.js'
import { moveTo } from '../../../../modules/moveTo/index.js'
import { is } from 'date-fns/locale'

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
    const client = useApolloClient()
    const tanstackQueryClient = useQueryClient()

    const { search, pathname } = useLocation()
    const navigate = useNavigate()
    const { projId, apId, popId, tpopId, tpopkontrId } = useParams()

    const store = useContext(MobxContext)
    const {
      moving,
      setMoving,
      copying,
      setCopying,
      copyingBiotop,
      setCopyingBiotop,
    } = store
    const { activeNodeArray, openNodes, setOpenNodes } = store.tree

    const onClickAdd = useCallback(async () => {
      // 1. add new tpopkontr
      let result
      try {
        result = await client.mutate({
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
        return store.enqueNotification({
          message: error.message,
          options: {
            variant: 'error',
          },
        })
      }
      const id = result?.data?.createTpopkontr?.tpopkontr?.id

      // 2. add new tpopkontrzaehl
      const resultZaehl = await client.mutate({
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
      const zaehlId =
        resultZaehl?.data?.createTpopkontrzaehl?.tpopkontrzaehl?.id
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
      tanstackQueryClient.invalidateQueries({
        queryKey: [`treeTpop`],
      })
      tanstackQueryClient.invalidateQueries({
        queryKey: [`treeTpopfeldkontr`],
      })
      tanstackQueryClient.invalidateQueries({
        queryKey: [`treeTpopfeldkontrzaehl`],
      })

      // 5. navigate to new tpopkontr
      navigate(
        `/Daten/Projekte/${projId}/Arten/${apId}/Populationen/${popId}/Teil-Populationen/${tpopId}/Feld-Kontrollen/${id}${search}`,
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
    const [copyBiotopMenuAnchorEl, setCopyBiotopMenuAnchorEl] = useState(null)
    const copyBiotopMenuOpen = Boolean(copyBiotopMenuAnchorEl)

    const onClickDelete = useCallback(async () => {
      let result
      try {
        result = await client.mutate({
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
        queryKey: [`treeTpopfeldkontr`],
      })
      tanstackQueryClient.invalidateQueries({
        queryKey: [`treeTpop`],
      })
      // navigate to parent
      navigate(
        `/Daten/Projekte/${projId}/Arten/${apId}/Populationen/${popId}/Teil-Populationen/${tpopId}/Feld-Kontrollen${search}`,
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

    const isMovingFeldkontr = moving.table === 'tpopfeldkontr'
    const thisTpopfeldkontrIsMoving = moving.id === tpopkontrId
    const movingFromThisTpop = moving.fromParentId === tpopId
    const onClickMoveInTree = useCallback(() => {
      if (isMovingFeldkontr) {
        return moveTo({
          id: tpopId,
          client,
          store,
          tanstackQueryClient,
        })
      }
      setMoving({
        id: tpopkontrId,
        label: row.labelEk,
        table: 'tpopfeldkontr',
        toTable: 'tpopfeldkontr',
        fromParentId: tpopId,
      })
    }, [
      row,
      setMoving,
      tpopId,
      tpopkontrId,
      isMovingFeldkontr,
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

    const isCopyingTpopfeldkontr = copying.table === 'tpopfeldkontr'
    const isCopyingBiotop = !!copyingBiotop.id
    const isCopying = isCopyingTpopfeldkontr || isCopyingBiotop
    const thisTpopfeldkontrIsCopying = copying.id === tpopkontrId
    const onClickCopyFeldkontrToHere = useCallback(() => {
      copyTo({
        parentId: tpopId,
        client,
        store,
        tanstackQueryClient,
      })
    }, [copyTo, tpopId, client, store, tanstackQueryClient])
    const onClickCopyBiotopToHere = useCallback(() => {
      copyBiotopTo({
        id: tpopkontrId,
        copyingBiotop,
        client,
      })
    }, [copyBiotopTo, copyingBiotop, tpopkontrId, client])
    const onClickSetFeldkontrCopying = useCallback(() => {
      setCopying({
        table: 'tpopfeldkontr',
        id: tpopkontrId,
        label: row.labelEk,
        withNextLevel: false,
      })
      setCopyBiotopMenuAnchorEl(null)
    }, [tpopkontrId, row, setCopying])
    const onClickSetBiotopCopying = useCallback(() => {
      setCopyingBiotop({
        id: tpopkontrId,
        label: row.labelEk,
      })
      setCopyBiotopMenuAnchorEl(null)
    }, [tpopkontrId, row, setCopyingBiotop])

    const onClickStopCopying = useCallback(() => {
      if (isCopyingTpopfeldkontr) {
        return setCopying({
          table: null,
          id: '99999999-9999-9999-9999-999999999999',
          label: null,
          withNextLevel: false,
        })
      }
      setCopyingBiotop({ id: null, label: null })
    }, [setCopying])

    return (
      <ErrorBoundary>
        <MenuBar
          rerenderer={`${isMovingFeldkontr}/${moving.label}/${isCopyingTpopfeldkontr}/${isCopyingBiotop}/${copying.label}/${movingFromThisTpop}/${thisTpopfeldkontrIsMoving}/${thisTpopfeldkontrIsCopying}`}
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
                `'${row.labelEk}' zu einer anderen Population verschieben`
              : thisTpopfeldkontrIsMoving ?
                'Zum Verschieben gemerkt, bereit um in einer anderen Teilpopulation einzufügen'
              : movingFromThisTpop ?
                `'${moving.label}' zur selben Teilpopulation zu vershieben, macht keinen Sinn`
              : `Verschiebe '${moving.label}' zu dieser Teilpopulation`
            }
          >
            <IconButton onClick={onClickMoveInTree}>
              <MoveIcon
                moving={(
                  isMovingFeldkontr && thisTpopfeldkontrIsMoving
                ).toString()}
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
            <Tooltip
              title={`Kopiere '${copying.label}' in diese Teilpopulation`}
            >
              <IconButton onClick={onClickCopyFeldkontrToHere}>
                <CopyIcon copying={thisTpopfeldkontrIsCopying.toString()} />
              </IconButton>
            </Tooltip>
          : isCopyingBiotop ?
            <Tooltip
              title={`Kopiere Biotop von '${copyingBiotop.label}' hierhin`}
            >
              <IconButton onClick={onClickCopyBiotopToHere}>
                <CopyIcon copying={'false'} />
              </IconButton>
            </Tooltip>
          : <Tooltip title="Kopieren">
              <IconButton
                onClick={(event) =>
                  setCopyBiotopMenuAnchorEl(event.currentTarget)
                }
                aria-owns={copyBiotopMenuOpen ? 'copyBiotopMenu' : undefined}
              >
                <CopyIcon copying={thisTpopfeldkontrIsCopying.toString()} />
              </IconButton>
            </Tooltip>
          }
          {(isCopyingTpopfeldkontr || isCopyingBiotop) && (
            <Tooltip title={`Kopieren von '${copying.label}' abbrechen`}>
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
          <MenuTitle>löschen?</MenuTitle>
          <MenuItem onClick={onClickDelete}>ja</MenuItem>
          <MenuItem onClick={() => setDelMenuAnchorEl(null)}>nein</MenuItem>
        </MuiMenu>
        <MuiMenu
          id="copyBiotopMenu"
          anchorEl={copyBiotopMenuAnchorEl}
          open={copyBiotopMenuOpen}
          onClose={() => setCopyBiotopMenuAnchorEl(null)}
        >
          <MenuTitle>Kopieren:</MenuTitle>
          <MenuItem onClick={onClickSetFeldkontrCopying}>
            Feld-Kontrolle
          </MenuItem>
          <MenuItem onClick={onClickSetBiotopCopying}>Biotop</MenuItem>
        </MuiMenu>
      </ErrorBoundary>
    )
  }),
)
