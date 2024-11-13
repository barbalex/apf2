import { memo, useCallback, useContext, useState } from 'react'
import { useApolloClient, gql } from '@apollo/client'
import { useQueryClient } from '@tanstack/react-query'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { getSnapshot } from 'mobx-state-tree'
import {
  FaPlus,
  FaMinus,
  FaFolder,
  FaFolderTree,
  FaMapLocationDot,
} from 'react-icons/fa6'
import { RiFolderCloseFill } from 'react-icons/ri'
import IconButton from '@mui/material/IconButton'
import ToggleButton from '@mui/material/ToggleButton'
import MuiMenu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import isEqual from 'lodash/isEqual'
import uniq from 'lodash/uniq'
import styled from '@emotion/styled'

import { MenuBar } from '../../../shared/MenuBar/index.jsx'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
import { StoreContext } from '../../../../storeContext.js'
import { MenuTitle } from '../../../shared/Files/Menu/index.jsx'
import { openLowerNodes } from '../../TreeContainer/openLowerNodes/index.js'
import { closeLowerNodes } from '../../TreeContainer/closeLowerNodes.js'
import { isMobilePhone } from '../../../../modules/isMobilePhone.js'
import { useSearchParamsState } from '../../../../modules/useSearchParamsState.js'

const iconStyle = { color: 'white' }
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

export const Menu = memo(
  observer(({ row }) => {
    const { search, pathname } = useLocation()
    const navigate = useNavigate()
    const client = useApolloClient()
    const tanstackQueryClient = useQueryClient()
    const { projId, apId, popId, tpopId } = useParams()
    const store = useContext(StoreContext)
    const {
      setIdOfTpopBeingLocalized,
      idOfTpopBeingLocalized,
      activeApfloraLayers,
      setActiveApfloraLayers,
    } = store

    const onClickAdd = useCallback(async () => {
      let result
      try {
        result = await client.mutate({
          mutation: gql`
            mutation createTpopForTpopForm($popId: UUID!) {
              createTpop(input: { tpop: { popId: $popId } }) {
                tpop {
                  id
                  popId
                }
              }
            }
          `,
          variables: {
            popId,
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
        queryKey: [`treeTpop`],
      })
      tanstackQueryClient.invalidateQueries({
        queryKey: [`treePopFolders`],
      })
      const id = result?.data?.createTpop?.tpop?.id
      navigate(
        `/Daten/Projekte/${projId}/Arten/${apId}/Populationen/${popId}/Teil-Populationen/${id}${search}`,
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
            mutation deleteTpop($id: UUID!) {
              deleteTpopById(input: { id: $id }) {
                tpop {
                  id
                }
              }
            }
          `,
          variables: { id: tpopId },
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
        queryKey: [`treeTpop`],
      })
      tanstackQueryClient.invalidateQueries({
        queryKey: [`treePopFolders`],
      })
      // navigate to parent
      navigate(
        `/Daten/Projekte/${projId}/Arten/${apId}/Populationen/${popId}/Teil-Populationen${search}`,
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

    const [projekteTabs, setProjekteTabs] = useSearchParamsState(
      'projekteTabs',
      isMobilePhone() ? ['tree'] : ['tree', 'daten'],
    )
    const showMapIfNotYetVisible = useCallback(
      (projekteTabs) => {
        const isVisible = projekteTabs.includes('karte')
        if (!isVisible) {
          setProjekteTabs([...projekteTabs, 'karte'])
        }
      },
      [setProjekteTabs],
    )
    const isLocalizing = !!idOfTpopBeingLocalized
    const onClickLocalizeOnMap = useCallback(() => {
      if (isLocalizing) {
        return setIdOfTpopBeingLocalized(null)
      }
      setIdOfTpopBeingLocalized(tpopId)
      showMapIfNotYetVisible(projekteTabs)
      setActiveApfloraLayers(uniq([...activeApfloraLayers, 'tpop']))
    }, [
      setIdOfTpopBeingLocalized,
      tpopId,
      showMapIfNotYetVisible,
      projekteTabs,
      activeApfloraLayers,
      setActiveApfloraLayers,
      idOfTpopBeingLocalized,
    ])

    return (
      <ErrorBoundary>
        <MenuBar
          bgColor="#388e3c"
          color="white"
          rerenderer={`${idOfTpopBeingLocalized}`}
        >
          <IconButton
            title="Neue Teil-Population erstellen"
            onClick={onClickAdd}
          >
            <FaPlus style={iconStyle} />
          </IconButton>
          <IconButton
            title="Löschen"
            onClick={(event) => setDelMenuAnchorEl(event.currentTarget)}
            aria-owns={delMenuOpen ? 'tpopDelMenu' : undefined}
          >
            <FaMinus style={iconStyle} />
          </IconButton>
          <IconButton
            title="Ordner im Navigationsbaum öffnen"
            onClick={onClickOpenLowerNodes}
          >
            <FaFolderTree style={iconStyle} />
          </IconButton>
          <IconButton
            title="Ordner im Navigationsbaum schliessen"
            onClick={onClickCloseLowerNodes}
          >
            <RiFolderCloseFill style={iconStyle} />
          </IconButton>
          <RoundToggleButton
            value={idOfTpopBeingLocalized ?? ''}
            title="Auf Karte verorten (mit Doppelklick)"
            onChange={onClickLocalizeOnMap}
            selected={isLocalizing}
          >
            <FaMapLocationDot style={iconStyle} />
          </RoundToggleButton>
        </MenuBar>
        <MuiMenu
          id="tpopDelMenu"
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
