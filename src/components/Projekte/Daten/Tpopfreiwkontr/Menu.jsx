import { useContext, useState } from 'react'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
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
import { isEqual } from 'es-toolkit'

import { MenuBar } from '../../../shared/MenuBar/index.jsx'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
import { MobxContext } from '../../../../mobxContext.js'
import { MenuTitle } from '../../../shared/Files/Menu/index.jsx'
import { copyTo } from '../../../../modules/copyTo/index.js'
import { moveTo } from '../../../../modules/moveTo/index.js'

const iconStyle = { color: 'white' }

export const Menu = observer(({ row }) => {
  const { search, pathname } = useLocation()
  const navigate = useNavigate()
  const { projId, apId, popId, tpopId, tpopkontrId } = useParams()

  const store = useContext(MobxContext)
  const { moving, setMoving, copying, setCopying, setIsPrint } = store

  const apolloClient = useApolloClient()
  const tsQueryClient = useQueryClient()

  const onClickAdd = async () => {
    let result
    try {
      result = await apolloClient.mutate({
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
    tsQueryClient.invalidateQueries({
      queryKey: [`treeTpopfreiwkontr`],
    })
    tsQueryClient.invalidateQueries({
      queryKey: [`treeTpop`],
    })
    const id = result?.data?.createTpopkontr?.tpopkontr?.id
    navigate(
      `/Daten/Projekte/${projId}/Arten/${apId}/Populationen/${popId}/Teil-Populationen/${tpopId}/Freiwilligen-Kontrollen/${id}${search}`,
    )
  }

  const [delMenuAnchorEl, setDelMenuAnchorEl] = useState(null)
  const delMenuOpen = Boolean(delMenuAnchorEl)

  const onClickDelete = async () => {
    let result
    try {
      result = await apolloClient.mutate({
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
    tsQueryClient.invalidateQueries({
      queryKey: [`treeTpopfreiwkontr`],
    })
    tsQueryClient.invalidateQueries({
      queryKey: [`treeTpop`],
    })
    // navigate to parent
    navigate(
      `/Daten/Projekte/${projId}/Arten/${apId}/Populationen/${popId}/Teil-Populationen/${tpopId}/Freiwilligen-Kontrollen${search}`,
    )
  }

  const onClickPrint = () => {
    setIsPrint(true)
    // wait for file to load
    // https://github.com/barbalex/apf2/issues/617
    setTimeout(() => {
      window.print()
      setIsPrint(false)
    }, 0)
  }

  const isMovingTpopfreiwkontr = moving.table === 'tpopfreiwkontr'
  const thisTpopfreiwkontrIsMoving = moving.id === tpopkontrId
  const movingFromThisTpop = moving.fromParentId === tpopId

  const onClickMoveInTree = () => {
    if (isMovingTpopfreiwkontr) {
      return moveTo({
        id: tpopId,
        apolloClient,
        store,
      })
    }
    setMoving({
      id: row.id,
      label: row.labelEkf,
      table: 'tpopfreiwkontr',
      toTable: 'tpopfreiwkontr',
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

  const isCopyingTpopfreiwkontr = copying.table === 'tpopfreiwkontr'
  const thisTpopfreiwkontrIsCopying = copying.id === tpopkontrId

  const onClickCopy = () => {
    if (isCopyingTpopfreiwkontr) {
      // copy to this tpop
      return copyTo({
        parentId: tpopId,
        apolloClient,
        store,
      })
    }
    setCopying({
      table: 'tpopfreiwkontr',
      id: tpopkontrId,
      label: row.labelEkf,
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
            <MdOutlineMoveDown
              style={{
                color:
                  isMovingTpopfreiwkontr && thisTpopfreiwkontrIsMoving ?
                    'rgb(255, 90, 0) !important'
                  : 'white',
              }}
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
            <MdContentCopy
              style={{
                color:
                  thisTpopfreiwkontrIsCopying ?
                    'rgb(255, 90, 0) !important'
                  : 'white',
              }}
            />
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
})
