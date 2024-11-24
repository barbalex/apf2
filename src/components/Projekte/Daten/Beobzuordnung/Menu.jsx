import { memo, useCallback, useContext, useState } from 'react'
import { useApolloClient, gql } from '@apollo/client'
import { useQueryClient } from '@tanstack/react-query'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { getSnapshot } from 'mobx-state-tree'
import Button from '@mui/material/Button'
import LoadingButton from '@mui/lab/LoadingButton'
import isEqual from 'lodash/isEqual'
import styled from '@emotion/styled'

import { useSetAtom, useAtom } from 'jotai'
import {
  newTpopFromBeobDialogOpenAtom,
  newTpopFromBeobBeobIdAtom,
} from '../../../../JotaiStore/index.js'

import { MenuBar } from '../../../shared/MenuBar/index.jsx'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
import { StoreContext } from '../../../../storeContext.js'
import { showCoordOfBeobOnMapsZhCh } from '../../../../modules/showCoordOfBeobOnMapsZhCh.js'
import { showCoordOfBeobOnMapGeoAdminCh } from '../../../../modules/showCoordOfBeobOnMapGeoAdminCh.js'
import { copyBeobZugeordnetKoordToTpop } from '../../../../modules/copyBeobZugeordnetKoordToTpop/index.js'
import { createNewPopFromBeob } from '../../../../modules/createNewPopFromBeob/index.js'

const StyledButton = styled(Button)`
  margin: 0 5px;
  padding: 3px 10px;
  text-transform: none;
  line-height: 1.1;
  font-size: 0.8rem;
  max-height: 36px;
  color: white;
  border-color: white;
  border-width: 0.67px;
  border-color: rgba(255, 255, 255, 0.5) !important;
  width: ${(props) => props.width}px;
`
const StyledLoadingButton = styled(LoadingButton)`
  margin: 0 5px;
  padding: 3px 10px;
  text-transform: none;
  line-height: 1.1;
  font-size: 0.8rem;
  color: white;
  border-color: white;
  border-width: 0.67px;
  border-color: rgba(255, 255, 255, 0.5) !important;
  width: ${(props) => props.width}px;
`

export const Menu = memo(
  observer(({ row }) => {
    const { search, pathname } = useLocation()
    const navigate = useNavigate()
    const client = useApolloClient()
    const tanstackQueryClient = useQueryClient()
    const { projId, apId, beobId, tpopId } = useParams()
    const store = useContext(StoreContext)

    const isBeobZugeordnet = !!tpopId
    const isBeobNichtBeurteilt =
      !tpopId && pathname.includes('nicht-beurteilte-Beobachtungen')
    const isBeobNichtZuzuordnen =
      !tpopId && pathname.includes('nicht-zuzuordnende-Beobachtungen')

    const onClickAdd = useCallback(async () => {
      let result
      try {
        result = await client.mutate({
          mutation: gql`
            mutation createEkzaehleinheitForBeobzuordnungForm($apId: UUID!) {
              createEkzaehleinheit(input: { ekzaehleinheit: { apId: $apId } }) {
                ekzaehleinheit {
                  id
                  apId
                }
              }
            }
          `,
          variables: { apId },
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
        queryKey: [`treeEkzaehleinheit`],
      })
      tanstackQueryClient.invalidateQueries({
        queryKey: [`treeApFolders`],
      })
      const id = result?.data?.createEkzaehleinheit?.ekzaehleinheit?.id
      navigate(
        `/Daten/Projekte/${projId}/Arten/${apId}/EK-Zähleinheiten/${id}${search}`,
      )
    }, [apId, client, store, tanstackQueryClient, navigate, search, projId])

    const [delMenuAnchorEl, setDelMenuAnchorEl] = useState(null)
    const delMenuOpen = Boolean(delMenuAnchorEl)

    const onClickDelete = useCallback(async () => {
      let result
      try {
        result = await client.mutate({
          mutation: gql`
            mutation deleteEkzaehleinheitForBeobzuordnung($id: UUID!) {
              deleteEkzaehleinheitById(input: { id: $id }) {
                ekzaehleinheit {
                  id
                }
              }
            }
          `,
          variables: { id: row.id },
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
        queryKey: [`treeEkzaehleinheit`],
      })
      tanstackQueryClient.invalidateQueries({
        queryKey: [`treeApFolders`],
      })
      // navigate to parent
      navigate(
        `/Daten/Projekte/${projId}/Arten/${apId}/EK-Zähleinheiten${search}`,
      )
    }, [
      client,
      store,
      tanstackQueryClient,
      navigate,
      search,
      apId,
      projId,
      row,
      pathname,
    ])

    const [
      copyingBeobZugeordnetKoordToTpop,
      setCopyingBeobZugeordnetKoordToTpop,
    ] = useState(false)
    const onClickCopyingBeobZugeordnetKoordToTpop = useCallback(async () => {
      setCopyingBeobZugeordnetKoordToTpop(true)
      await copyBeobZugeordnetKoordToTpop({
        id: beobId,
        client,
        enqueNotification: store.enqueNotification,
      })
      setCopyingBeobZugeordnetKoordToTpop(false)
    }, [beobId, client, store])

    const onClickShowCoordOfBeobOnMapGeoAdminCh = useCallback(() => {
      showCoordOfBeobOnMapGeoAdminCh({
        id: beobId,
        client,
        enqueNotification: store.enqueNotification,
      })
    }, [beobId, client, store])

    const onClickShowCoordOfBeobOnMapsZhCh = useCallback(() => {
      showCoordOfBeobOnMapsZhCh({
        id: beobId,
        client,
        enqueNotification: store.enqueNotification,
      })
    }, [beobId, client, store])

    const [creatingNewPopFromBeob, setCreatingNewPopFromBeob] = useState(false)
    const onClickCreateNewPopFromBeob = useCallback(async () => {
      setCreatingNewPopFromBeob(true)
      await createNewPopFromBeob({
        id: beobId,
        apId,
        projId,
        client,
        store,
        search,
        tanstackQueryClient,
      })
      setTimeout(() => {
        setCreatingNewPopFromBeob(false)
      }, 500)
    }, [beobId, apId, projId, client, store, search])

    const [newTpopFromBeobDialogOpen, setNewTpopFromBeobDialogOpen] = useAtom(
      newTpopFromBeobDialogOpenAtom,
    )
    const [newTpopFromBeobBeobId, setNewTpopFromBeobBeobId] = useAtom(
      newTpopFromBeobBeobIdAtom,
    )
    const closeNewTpopFromBeobDialog = useCallback(
      () => setNewTpopFromBeobDialogOpen(false),
      [],
    )
    const onClickNewTpopFromBeob = useCallback(() => {
      setNewTpopFromBeobBeobId(beobId)
      setNewTpopFromBeobDialogOpen(true)
    }, [beobId, setNewTpopFromBeobBeobId, setNewTpopFromBeobDialogOpen])

    return (
      <ErrorBoundary>
        <MenuBar
          rerenderer={`${copyingBeobZugeordnetKoordToTpop}/${isBeobZugeordnet}/${isBeobNichtBeurteilt}/${creatingNewPopFromBeob}`}
        >
          {isBeobZugeordnet && (
            <StyledLoadingButton
              variant="outlined"
              onClick={onClickCopyingBeobZugeordnetKoordToTpop}
              loading={copyingBeobZugeordnetKoordToTpop}
              width={180}
            >
              Koordinaten auf die Teilpopulation übertragen
            </StyledLoadingButton>
          )}
          {isBeobNichtBeurteilt && (
            <StyledLoadingButton
              variant="outlined"
              onClick={onClickCreateNewPopFromBeob}
              loading={creatingNewPopFromBeob}
              width={210}
            >
              {'Pop. u. TPop. gründen > Beobachtung der TPop. zuordnen'}
            </StyledLoadingButton>
          )}
          {isBeobNichtBeurteilt && (
            <StyledButton
              variant="outlined"
              onClick={onClickNewTpopFromBeob}
              width={240}
            >
              {
                'TPop. in bestehender Pop. gründen > Beobachtung der TPop. zuordnen'
              }
            </StyledButton>
          )}
          <StyledButton
            variant="outlined"
            onClick={onClickShowCoordOfBeobOnMapsZhCh}
            width={90}
          >
            zeige auf maps.zh.ch
          </StyledButton>
          <StyledButton
            variant="outlined"
            onClick={onClickShowCoordOfBeobOnMapGeoAdminCh}
            width={130}
          >
            zeige auf map.geo.admin.ch
          </StyledButton>
        </MenuBar>
      </ErrorBoundary>
    )
  }),
)
