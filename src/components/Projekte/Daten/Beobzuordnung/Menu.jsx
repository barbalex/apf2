import { memo, useCallback, useContext, useState } from 'react'
import { useApolloClient, gql } from '@apollo/client'
import { useQueryClient } from '@tanstack/react-query'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { getSnapshot } from 'mobx-state-tree'
import isEqual from 'lodash/isEqual'

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
import { StyledLoadingButton, StyledButton } from '../TpopRouter/Menu.jsx'

export const Menu = memo(
  observer(() => {
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

    // ISSUE: refs are sometimes/often not set on first render
    // trying to measure widths of menus leads to complete chaos
    // so passing in static widths instead

    return (
      <ErrorBoundary>
        <MenuBar
          rerenderer={`${copyingBeobZugeordnetKoordToTpop}/${isBeobZugeordnet}/${isBeobNichtBeurteilt}/${creatingNewPopFromBeob}`}
        >
          <StyledLoadingButton
            variant="outlined"
            onClick={onClickCopyingBeobZugeordnetKoordToTpop}
            loading={copyingBeobZugeordnetKoordToTpop}
            width={190}
            hide={(!isBeobZugeordnet).toString()}
          >
            Koordinaten auf die
            <br />
            Teilpopulation übertragen
          </StyledLoadingButton>
          <StyledLoadingButton
            variant="outlined"
            onClick={onClickCreateNewPopFromBeob}
            loading={creatingNewPopFromBeob}
            width={245}
            hide={(!isBeobNichtBeurteilt).toString()}
          >
            {'Pop. und TPop. gründen >'}
            <br />
            {'Beobachtung der TPop. zuordnen'}
          </StyledLoadingButton>
          <StyledButton
            variant="outlined"
            onClick={onClickNewTpopFromBeob}
            width={258}
            hide={(!isBeobNichtBeurteilt).toString()}
          >
            {'TPop. in bestehender Pop. gründen'}
            <br />
            {'> Beobachtung der TPop. zuordnen'}
          </StyledButton>
          <StyledButton
            variant="outlined"
            onClick={onClickShowCoordOfBeobOnMapsZhCh}
            width={105}
            hide={'false'}
          >
            zeige auf
            <br />
            maps.zh.ch
          </StyledButton>
          <StyledButton
            variant="outlined"
            onClick={onClickShowCoordOfBeobOnMapGeoAdminCh}
            width={147}
            hide={'false'}
          >
            zeige auf
            <br />
            map.geo.admin.ch
          </StyledButton>
        </MenuBar>
      </ErrorBoundary>
    )
  }),
)
